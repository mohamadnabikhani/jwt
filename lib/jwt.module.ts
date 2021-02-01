import {
  DynamicModule,
  Module,
  Provider,
  FactoryProvider
} from '@nestjs/common';
import {
  JwtModuleAsyncOptions,
  JwtModuleOptions,
  JwtOptionsFactory,
  MultipleProviders,
  IJwtService,
  Provide
} from './interfaces/jwt-module-options.interface';
import { JWT_MODULE_OPTIONS } from './jwt.constants';
import { JwtServiceFactory } from './core/jwt.service';
import { createJwtProvider } from './jwt.providers';
import { JwtService } from './jwt.service';
import { JwtServiceCore } from './core/jwt.service';

@Module({
  //   providers: [JwtService],
  //   exports: [JwtService]
})
export class JwtModule {
  static register(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [...createJwtProvider(options), JwtService],
      exports: [JwtService]
    };
  }

  static registerAsyncMultiple(
    multiplesFactoryProvider: FactoryProvider<JwtServiceFactory>[]
  ): DynamicModule {
    let exports: Provide[] = [];
    for (let factoryProvider of multiplesFactoryProvider) {
      exports.push(factoryProvider.provide);
    }
    return {
      module: JwtModule,
      providers: multiplesFactoryProvider,
      exports
    };
  }

  static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      module: JwtModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), JwtService],
      exports: [JwtService]
    };
  }

  private static createAsyncProviders(
    options: JwtModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(
    options: JwtModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: JWT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }
    return {
      provide: JWT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: JwtOptionsFactory) =>
        await optionsFactory.createJwtOptions(),
      inject: [options.useExisting || options.useClass]
    };
  }
}
