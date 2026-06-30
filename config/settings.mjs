import 'dotenv/config'

export default {
  server: {
    port: process.env.PORT || '3000',
    env: process.env.NODE_ENV || 'development'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    name: process.env.DB_NAME || 'microblog',
    get url() {
      return `mongodb://${this.host}:${this.port}`
    }
  },
  session: {
    secret: process.env.SESSION_SECRET || 'microblogverona',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  bcrypt: {
    saltRounds: 12
  }
}
