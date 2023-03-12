import 'dotenv/config';
export const ENVConstants = {
  MongoURI: process.env.MONGO_URI,
  ClientId: process.env.GOOGLE_CLIENT_ID,
  ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  expiresIn: process.env.EXPIRES_IN,
};
