import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    /* para hacer la inyección correcta del Modelo Pokemon, debemos usar el decorador InjectModel que recibe como parámetro el nombre de nuestro modelo para
    saber cómo va a inyectarlo en la DB. */
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  /* Nuestra función debe ser asíncrona porque las inserciones a la DB lo son. */
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      /**
       * Este código 11000 indica que ya existe un registro en DB que coincide con ese valor.  */
      if (error.code === 11000)
        throw new BadRequestException(
          `pokemon exists in DB ${JSON.stringify(error.keyValue)}`,
        );
      /**
       * Si no es error 11000, tenemos que revisar qué salió mal, y para indicar esto al frontend necesitamos usar el siguiente Exception Filter
       */
      throw new InternalServerErrorException(
        `Can not create Pokemon - Check server logs`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
