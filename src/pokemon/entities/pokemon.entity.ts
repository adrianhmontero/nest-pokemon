import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* Para indicar que esta clase es un esquema de BD, usaremos el siguiente decorador: */
@Schema()
/* Al extender nuestra entidad/clase con Document de Mongoose, se añadirán todas las funcionalidades respectivas como nombres, métodos, etc.*/
export class Pokemon extends Document {
  // El id no necesitamos definirlo porque MongoDB generará uno internacionalmente único.

  /* Con el decorador Prop vamos a indicar que el valor/campo de name debe ser único y que cuente con un index para que sea fácil de encontrar al hacer búsquedas. */
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

/* Hay que exportar un esquema para que, cuando se inicie la DB, indique que estas son las definiciones que use, las reglas, las columnas, etc. */

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
