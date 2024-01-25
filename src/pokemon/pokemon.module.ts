import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    /* Para que nuestros esquemas sean proporcionados adecuadamente y Mongoose cree las colecciones en la DB y que permita hacer la inyección de dependencias
    para usar las clases en nuestros servicios, debemos hacer lo siguiente: */
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
  /* Para que nosotros podamos usar un modelo de nuestro módulo, tenemos que exportar el MongooseModule que tiene la definición del esquema de ese modelo. 
  No olvidar que debemos añadir este módulo (PokemonModule) a las importaciones del módulo donde queremos usar el modelo. */
  exports: [MongooseModule],
})
export class PokemonModule {}
