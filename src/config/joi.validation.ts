import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
  /* Lo que hace JOI al seleccionar un valor por defecto es que, cuando la variable de entoorno en cuestión no exista, entonces JOI va a crearla
  con este valor por defecto. */
  DEFAULT_LIMIT: Joi.number().default(5),
});
