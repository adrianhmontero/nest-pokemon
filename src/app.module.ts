import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';

@Module({
  imports: [
    /* Es importante que esta linea esté al principio porque significa que va a leer el archivo .env, y
    para que todos nuestros módulos importandos en nuestra app funcionen correctamente cuando utilicen variables
    de entorno, se necesita primero leer dicho archivo. */
    ConfigModule.forRoot({ load: [EnvConfiguration] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    /* Para crear la referencia a nuestra base de datos usaremos el método forRoot de Mongoose
    que recibe como argumento la URI de nuestra base de datos. */
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
