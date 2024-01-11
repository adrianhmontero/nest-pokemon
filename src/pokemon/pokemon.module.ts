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
})
export class PokemonModule {}
