import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    /* para hacer la inyección correcta del Modelo Pokemon, debemos usar el decorador InjectModel que recibe como parámetro el nombre de nuestro modelo para
    saber cómo va a inyectarlo en la DB. */
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    /* La linea de abajo nos sirve para poder eliminar todos los registros de una taba o documento. En este caso, pokemon. Es lo mismo que la
    query delete * from pokemons */
    await this.pokemonModel.deleteMany({});

    let pokemonsToInsert: { name: string; no: number }[] = [];
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      const pokemon = { no, name };
      pokemonsToInsert.push(pokemon);
      // await this.pokemonModel.create(pokemon);
    });

    /* De esta manera nosotros podemos insertar registros por lote. 
    Es lo relativo a
    insert into pokemons (name,no)
     (name: someName, no: 2),
     (name: someName, no: 3),
     (name: someName, no: 4),
     (name: someName, no: 5),
     (name: someName, no: 6),
      ...*/
    await this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed successfully executed.';
  }
}
