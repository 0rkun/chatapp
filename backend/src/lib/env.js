import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,

  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
};

// PORT=3000
// MONGO_URI= mongodb+srv://mongorkun_db_user:Tdryx9fNDH6xhy7M@cluster0.knvqgbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// NODE_ENV=development

// JWT_SECRET= myjwtsecret

// RESEND_API_KEY=re_Aa2NwgtU_J52sGsLs74XTHmuxodgsavTp

// EMAIL_FROM="onboarding@resend.dev"
// EMAIL_FROM_NAME="Orkun Yılmaz"

// CLIENT_URL= http://localhost:5173
