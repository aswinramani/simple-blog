import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { constants } from './shared/constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get(constants.allowedOrigins);
  const port = configService.get(constants.port)
  app.enableCors({
    origin: allowedOrigins,
  });
  await app.listen(port);
}
bootstrap();
