import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SENDER_MAIL: process.env.SENDER_MAIL,
    BREVO_API_KEY: process.env.BREVO_API_KEY
}