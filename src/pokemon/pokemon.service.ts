import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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
      this.handleExceptions(error, 'PATCH');
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return (
      this.pokemonModel
        .find()
        .limit(limit)
        .skip(offset)
        /* el sort con no: 1 ordena los elementos por no de forma ascendente. Es decir, del menor al mayor. */
        .sort({ no: 1 })
        /* Este select con ese argumento indica que va a omitir la devolución de la propiedad __v en cada elemento. */
        .select('-__v')
    );
  }

  /* Esta función es asíncrona porque tenemos que hacer conexiones a la DB. */
  async findOne(term: string) {
    /* Declarando pokemon de tipo Pokemon estamos diciendo también que es de ese tipo de entidad (Pokemon) */
    let pokemon: Pokemon;

    /* Si el param term es un número, significa que el cliente está tratando de buscar un pokemon por no (Número) */
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    /* La función isValidObjectId nos permite verificar si el término de búsqueda (term) es de tipo mongo ID. */
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found.`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      /** updateOne es una query que Mongo nos ofrece.
       * El segundo argumento de la query es un objeto con new como true. Esto indica que vamos a almacenar en pokemon el nuevo documento. Es decir, el nuevo valor del
       * pokemon que estamos actualizando. Si nosotros no indicáramos esto en la ejecución de la query, pokemon tendría el valor inicial al encontrarlo en DB.
       */
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error, 'PATCH');
    }
  }

  async remove(id: string) {
    /* Las lineas de abajo están comentadas porque cada una de ellas representa una consulta a DB, y eso no es lo más óptimo. */
    /*  const pokemon = await this.findOne(id);
    await pokemon.deleteOne(); */
    /* El método deleteOne nos permite INTENTAR eliminar el registro con la(s) propiedad(es) indicadas en el objeto como argumento
    y nos devolverá un objeto con dos datos: deletedCount y acknowledged. El primero nos permitirá saber si realmente se eliminó
    el registro que intentamos borrar. En caso de que su valor sea 1, significará que se eliminó satisfactoriamente. En caso de
    ser cero, significará que no encontró ningún registro que coincida con nuestra búsqueda, por lo que podremos manejar la 
    excepción para el cliente. */
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} is not found.`);

    return;
  }

  private handleExceptions(error: any, method: string = 'GET') {
    const methods = {
      PATCH: 'update',
      GET: 'get',
      POST: 'create',
    };
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
      `Can not ${methods[method]} Pokemon - Check server logs`,
    );
  }
}
