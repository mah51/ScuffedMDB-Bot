import type BotClient from '../structures/client';

export async function run(client: BotClient) {
    console.log(`Logged in as ${client.user?.tag}`);
    await client.prisma.$connect();
    const test = await client.prisma.user.create({
        data: {
            name: 'test',
            lastName: 'last-name',
        },
    });

    console.log(test);
}
