import Joi, { Root } from 'joi';
import joi from 'joi';

export interface IUser {
  email: string;
  password: string;
}

export type ISchemaData = {
  [key: string]: joi.AnySchema;
};
