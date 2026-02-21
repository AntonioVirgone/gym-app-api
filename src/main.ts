import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Imposta il prefisso globale per tutte le rotte (es. http://localhost:3000/api/...)
  app.setGlobalPrefix('api');

  // Abilita le chiamate dal frontend React
  app.enableCors({
    origin: 'http://localhost:5173', // L'URL del tuo React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Backend in esecuzione su: http://localhost:3000/api`);
}
bootstrap();
