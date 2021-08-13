import type { WebhookData } from './../types/movie-types';
import express, { NextFunction, Request, Response } from 'express';
import type BotClient from './client';
import type { Server } from 'http';

const app = express();
const port = 3100;

class APIClient {
  app: express.Application;
  client: BotClient;
  server?: Server;
  connections: any[];

  constructor(client: BotClient) {
    if (!process.env.WEBHOOK_TOKEN) {
      throw new Error(
        'APIClient requires a WEBHOOK_TOKEN which can be set in the .env file'
      );
    }

    this.app = app;

    this.client = client;

    this.connections = [];

    this.server = undefined;

    this.client.on('ready', () => {
      app.use(express.json());
      app.use((req, res, next) => this.auth(req, res, next, this));
      app.post('/api/event/movie', (req, res) => {
        const data = req.body as WebhookData;
        if (data.action === 'added') {
          this.client.emit('movieCreate', data);
        } else if (data.action === 'deleted') {
          this.client.emit('movieDelete', data);
        } else {
          return res.status(403).send('unknown action');
        }

        return res.status(200).send('success');
      });
      app.post('/api/event/review', (req, res) => {
        const data = req.body as WebhookData;
        if (data.action === 'added') {
          this.client.emit('reviewCreate', data);
        } else if (data.action === 'deleted') {
          this.client.emit('reviewDelete', data);
        } else if (data.action === 'modified') {
          this.client.emit('reviewModify', data);
        } else {
          return res.status(403).send('unknown action');
        }

        return res.status(200).send('success');
      });

      this.server = app.listen(port, () => {
        this.client.logger.success(
          `${this?.client?.user?.tag} listening on port ${port}`
        );
      });

      this.server.on('connection', (connection) => {
        this.connections.push(connection);
        connection.on(
          'close',
          () =>
            (this.connections = this.connections.filter(
              (curr) => curr !== connection
            ))
        );
      });
    });
  }

  auth(req: Request, res: Response, next: NextFunction, apiClient: this): void {
    if (!apiClient) return;
    if (req.headers.authorization !== `Bearer ${process.env.WEBHOOK_TOKEN}`) {
      apiClient.client.logger.error(
        'Unauthorized request made to webhook interface'
      );
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }

  shutDown() {
    this.server?.close(() => {
      this.client.logger.success('API server closed');
      process.exit(0);
    });

    this.connections.forEach((curr) => curr.end());

    setTimeout(() => this.connections.forEach((curr) => curr.destroy()), 5000);

    setTimeout(() => {
      this.client.logger.error(
        'Could not close API connections in time, forcefully shutting down'
      );
      process.exit(1);
    }, 10000);
  }
}

export default APIClient;
