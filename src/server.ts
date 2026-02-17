import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';

import { AppModule } from './app';

async function main() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/')
  app.enableCors()
  const bodyLimit = process.env.BODY_LIMIT || '2mb'
  app.use(json({ limit: bodyLimit }))
  app.use(urlencoded({ extended: true, limit: bodyLimit }))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
  });
}

main()
