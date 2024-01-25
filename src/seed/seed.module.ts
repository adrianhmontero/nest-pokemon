import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  /* Estamos importando PokemonModule porque en nuestros servicios de seed necesitamos crear un modelo pokemonModel para poder hacer una inserción de pokemones por lote
  a nuestra DB pero con las propiedades adicionales definidas en el esquema. */
  imports: [PokemonModule, CommonModule],
})
export class SeedModule {}
