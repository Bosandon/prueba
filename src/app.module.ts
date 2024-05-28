import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'bosandon',
      password: process.env.DB_PASSWORD || 'passwor',
      database: process.env.DB_NAME || 'prueba_falp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorHandlerMiddleware)
      .forRoutes('*');
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
