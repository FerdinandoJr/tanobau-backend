import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'

import { AppModule } from './app'

async function main() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/')
  app.use(cookieParser())
  app.enableCors({
    // Em produção, substitua pelo seu domínio real (ex: https://meuapp.com)
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
    credentials: true, // ESSENCIAL: Permite que os Cookies sejam enviados e recebidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  })
  
  const bodyLimit = process.env.BODY_LIMIT || '2mb'
  app.use(json({ limit: bodyLimit }))
  app.use(urlencoded({ extended: true, limit: bodyLimit }))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`)
  })
}

main()
