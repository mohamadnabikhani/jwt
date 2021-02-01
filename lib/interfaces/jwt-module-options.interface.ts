import { ModuleMetadata, Abstract, Type } from '@nestjs/common/interfaces';
import * as jwt from 'jsonwebtoken';

export enum JwtSecretRequestType {
  SIGN,
  VERIFY
}

export interface JwtModuleOptions {
  signOptions?: jwt.SignOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  /**
   * @deprecated
   */
  secretOrPrivateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions
  ) => jwt.Secret;
  verifyOptions?: jwt.VerifyOptions;
}

export interface JwtOptionsFactory {
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions;
}

export interface JwtModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<JwtOptionsFactory>;
  useClass?: Type<JwtOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions;
  inject?: any[];
}

export interface JwtSignOptions extends jwt.SignOptions {
  secret?: string | Buffer;
  privateKey?: string | Buffer;
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
}

export interface IJwtService {
  sign(payload: string | Buffer | object, options?: JwtSignOptions): string;
  signAsync(
    payload: string | Buffer | object,
    options?: JwtSignOptions
  ): Promise<string>;
  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;
  verifyAsync<T extends object = any>(
    token: string,
    options?: JwtVerifyOptions
  ): Promise<T>;
  decode(
    token: string,
    options?: jwt.DecodeOptions
  ): null | { [key: string]: any } | string;
}

export interface MultipleProviders {
  provide: string | symbol | Type<any> | Abstract<any> | Function;
  useFactory?: (...args: any[]) => IJwtService;
  inject?: any[];
}

export type Provide = string | symbol | Type<any> | Abstract<any> | Function;
