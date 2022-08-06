import express, { Express, Request, Response, NextFunction } from 'express';
import { Document, Model } from 'mongoose';

type ExpressCore = typeof express;

export declare interface AuthRequest<T = {}> extends Request {
  user?: T & Document;
}

export declare interface LoginExpressConfig<T = {}> {
  jwtSecret: string;
  jwtResetSecret: string;
  emailFromUser: string;
  emailFromPass: string;
  emailHost: string;
  userModel: Model<T>;
  clientBaseUrl: string;
  emailPort?: 25 | 465 | 587 | 2525;
  emailSecure?: boolean;
  verifyEmailHeading?: string;
  verifyEmailSubjectLine?: string;
  verifyEmailMessage?: string;
  verifyEmailRedirect?: string;
  resetEmailHeading?: string;
  resetEmailSubjectLine?: string;
  resetEmailMessage?: string;
  resetEmailRedirect?: string;
  passwordLength?: number;
  jwtSessionExpiration?: number;
  jwtResetExpiration?: number;
}

export declare interface RegisterBody {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export declare interface LoginBody {
  email: string;
  password: string;
}

export declare interface ChangePasswordBody {
  resetToken: string;
  newPassword: string;
}

export declare class LoginExpress<T = {}> {
  constructor(config: LoginExpressConfig<T>);
  isLoggedIn(req: Request, res: Response, next: NextFunction): void;
  isAdmin(req: Request, res: Response, next: NextFunction): void;
  getUser<T>(id: string): Promise<T>;
  register(res: Response, userInfo: RegisterBody): Promise<void>;
  verify(token: string): Promise<T>;
  login(res: Response, userInfo: LoginBody): Promise<void>;
  logout(res: Response): void;
  changePassword(res: Response, options: ChangePasswordBody): Promise<void>;
  createSession(res: Response, userId: string): void;
  sendVerificationEmail(user: Document<T>): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
}

export declare interface DatabaseConfig {
  mongodbURI: string;
  jwtSecret: string;
  passwordLength?: number;
  jwtSessionExpiration?: number;
}

export declare interface AppConfig {
  jwtResetSecret: string;
  emailFromUser: string;
  emailFromPass: string;
  emailHost: string;
  emailPort: number;
  emailSecure: boolean;
  jwtResetExpiration?: number;
  basePath?: string;
}

export declare interface EmailConfig {
  emailHeading: string;
  emailSubjectLine: string;
  emailMessage: string;
}

export default function loginJS(
  dbConfig: DatabaseConfig,
  appConfig: AppConfig,
  app: Express,
  express: ExpressCore,
  verifyEmailConfig?: EmailConfig | {},
  resetEmailConfig?: EmailConfig | {},
  basePath?: string
): void;
