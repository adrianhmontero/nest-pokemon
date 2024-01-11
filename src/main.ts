import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Para poder añadir un path global en todos nuestros servicios, podemos definirlo desde el main con la siguiente linea de código. De esta forma,
  podremos tener mejor distribuido o versionado nuestro proyecto. */
  app.setGlobalPrefix('api/v2');

  await app.listen(3000);
}
bootstrap();
