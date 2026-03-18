declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;

      S3_ENDPOINT: string;
      S3_PORT: string;
      S3_ACCESS_KEY: string;
      S3_SECRET_KEY: string;

      REDIS_URI: string;

      ARGON2_SECRET_KEY: string;

      RESEND_API_KEY: string;

      JWT_SECRET: string;

      SMTP_URI: string;

      EMAIL_SENDER: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
