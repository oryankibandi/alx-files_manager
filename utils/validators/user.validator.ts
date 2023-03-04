import Joi from 'joi';
import { ISchemaData } from './base.validator';

interface IUserData {
  email: string;
  password: string;
}

const schemaValues: ISchemaData = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export function userRegistrationValidation(data: IUserData) {
  const schema = Joi.object({
    email: schemaValues.email,
    password: schemaValues.password,
  });

  return schema.validate(data);
}
