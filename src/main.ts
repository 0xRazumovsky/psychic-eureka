import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(3000);

  console.log('App is running on http://localhost:3000');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
