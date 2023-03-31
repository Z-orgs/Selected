import 'dotenv/config';
import { clean } from 'diacritic';
import { toLower, deburr } from 'lodash';

export const env = {
  MongoURI: process.env.MONGO_URI,
  ClientId: process.env.GOOGLE_CLIENT_ID,
  ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  ExpiresIn: process.env.EXPIRES_IN,
  CallbackURL: process.env.CALLBACK_URL,
  Password: process.env.PASSWORD,
  DefaultPassword: process.env.DEFAULTPASSWORD,
  TmpUri: process.env.TMPURI,
  Artist: 'artist',
  Admin: 'admin',
  UnitPrice: process.env.UNITPRICE,
  UrlServer: '',
};

export const MXZ = (input: string) => toLower(deburr(clean(input)));
