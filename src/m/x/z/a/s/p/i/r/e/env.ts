import 'dotenv/config';

export const env = {
  MongoURI: process.env.MONGO_URI,
  ClientId: process.env.GOOGLE_CLIENT_ID,
  ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  ExpiresIn: process.env.EXPIRES_IN,
  CallbackURL: process.env.CALLBACK_URL,
  Username: process.env.ADMIN,
  Password: process.env.PASSWORD,
  DefaultPassword: process.env.DEFAULTPASSWORD,
  TmpUri: process.env.TMPURI,
  Artist: 'ARTIST',
  Admin: 'ADMIN',
  UnitPrice: process.env.UNITPRICE,
};
