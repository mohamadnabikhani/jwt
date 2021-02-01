import { Inject, Injectable } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { JWT_MODULE_OPTIONS } from './jwt.constants';
import { JwtServiceCore } from './core/jwt.service';

@Injectable()
export class JwtService extends JwtServiceCore {
  constructor(
    @Inject(JWT_MODULE_OPTIONS)
    private readonly baseOptions: JwtModuleOptions
  ) {
    super(baseOptions);
  }
}
