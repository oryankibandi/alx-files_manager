import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import base64 from 'base-64';

import { InvalidCredentialsHeader } from './exceptions/user.exceptions';

interface Ifilter {
  include?: string[];
  exclude?: string[];
}

interface IFilterData {
  [key: string]: any;
}

export function hashPassword(password: string): string {
  return sha1(password);
}

export function pick(data: IFilterData, filters: Ifilter) {
  if (filters.include) {
    const newObj: IFilterData = {};

    filters.include.forEach((item) => {
      newObj[`${item}`] = data[item];
    });

    return newObj;
  }

  if (filters.exclude) {
    const newObj = { ...data };

    filters.exclude.forEach((item) => {
      delete newObj[item];
    });

    return newObj;
  }
}

export function getCredFromHeader(authCredentials: string): string[] {
  if (!authCredentials)
    throw new InvalidCredentialsHeader('Invalid Authentication header');

  const creds = authCredentials.split(' ');
  const decodedCred = decodeTextBase64(creds[1]);
  return decodedCred.split(':');
}

export function generateToken(): string {
  return uuidv4();
}

export function encodeTextBase64(plainText: string): string {
  return base64.encode(plainText);
}

export function decodeTextBase64(encodedText: string): string {
  return base64.decode(encodedText);
}
