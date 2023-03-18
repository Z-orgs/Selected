import 'dotenv/config';
export const mxzASPIRE = {
  MongoURI: process.env.MONGO_URI,
  ClientId: process.env.GOOGLE_CLIENT_ID,
  ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  ExpiresIn: process.env.EXPIRES_IN,
  CallbackURL: process.env.CALLBACK_URL,
  Username: process.env.ADMIN,
  Password: process.env.PASSWORD,
};
