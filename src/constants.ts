import 'dotenv/config';
import { clean } from 'diacritic';
import { toLower, deburr } from 'lodash';
import * as process from 'process';

export const SELECTED = {
  MongoURI: process.env.MONGO_URI,
  ClientId: process.env.GOOGLE_CLIENT_ID,
  ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  CallbackURL: process.env.CALLBACK_URL,
  Password: process.env.PASSWORD,
  DefaultPassword: process.env.DEFAULTPASSWORD,
  Artist: 'artist',
  Admin: 'admin',
  UnitPrice: Number(process.env.UNITPRICE),
  UrlServer: `${process.env.HOST_SERVER}:${process.env.PORT || '3000'}`,
  PORT: parseInt(process.env.PORT) || 3000,
  FE_URL: process.env.FE_URL,
  Secret: process.env.SECRET,
  RefreshSecret: process.env.REFRESH_SECRET,
  EmailBoss: process.env.EMAIL_BOSS,
};

export const normalString = (input: string) => toLower(deburr(clean(input)));
