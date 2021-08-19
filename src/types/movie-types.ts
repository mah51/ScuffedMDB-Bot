export interface MovieType<T = ReviewType[]> {
  _id: string;
  name: string;
  releaseDate: string;
  revenue: number;
  budget: number;
  originalLanguage: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  imdbID: string;
  image?: string;
  genres: string[];
  movieID: string;
  description?: string;
  tagLine?: string;
  rating: number;
  numReviews: number;
  reviews: T;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookData {
  type: 'movie' | 'review' | 'user';
  action: 'added' | 'modified' | 'deleted' | 'banned';
  user: UserAuthType;
  movie: MovieType<ReviewType<string>[]> | MovieType;
  review: ReviewType<string | PopulatedUserType>;
  ban: { reason: string; user: UserAuthType };
}

export interface ReviewType<T = PopulatedUserType> {
  _id: string;
  user: T extends string ? T : T | null;
  comment?: string;
  rating: number;
}

export interface PopulatedUserType {
  _id: string;
  discord_id: string;
  image: string;
  username: string;
  discriminator: string;
}

export interface UserAuthType {
  id: string;
  name: string;
  email: string;
  image: string;
  sub: string;
  iat: number;
  exp: number;
  username: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type?: number;
  isAdmin: boolean;
  isReviewer: boolean;
  isBanned: boolean;
  banReason?: string;
  discord_id: string;
}
