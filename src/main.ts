import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Para poder añadir un path global en todos nuestros servicios, podemos definirlo desde el main con la siguiente linea de código. De esta forma,
  podremos tener mejor distribuido o versionado nuestro proyecto. */
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      /* Usar el transform puede ser contraproducente, ¿por qué?, porque al habilitarlo, aquellas peticiones que contengan DTOs
      con reglas o validaciones específicas tales como IsNumber en sus propiedades, se necesitará procesar estos datos y eso
      consume más memoria.  */
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
