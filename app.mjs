import express from 'express'
import ejslayouts from 'express-ejs-layouts'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import settings from './config/settings.mjs'
import routes from './routes/index.mjs'
import flashMiddleware from './middleware/flash.mjs'
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// ── Security ──
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP to allow inline scripts/styles from Bootstrap
}))

// ── Rate Limiting ──
app.use(rateLimit({
  windowMs: settings.rateLimit.windowMs,
  max: settings.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
}))

// ── View engine setup ──
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layout')
app.use(ejslayouts)

// ── Request logging ──
app.use(logger('dev'))

// ── Body parsing (built-in with Express 5) ──
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ── Cookie parser ──
app.use(cookieParser())

// ── Static files ──
app.use(express.static(path.join(__dirname, 'public')))

// ── Session ──
app.use(session({
  secret: settings.session.secret,
  resave: settings.session.resave,
  saveUninitialized: settings.session.saveUninitialized,
  name: 'microblog.sid',
  cookie: {
    maxAge: settings.session.cookie.maxAge,
    httpOnly: settings.session.cookie.httpOnly,
    secure: settings.session.cookie.secure
  },
  store: MongoStore.create({
    mongoUrl: `${settings.db.url}/${settings.db.name}`
  })
}))

// ── Flash messages (replaces connect-flash) ──
app.use(flashMiddleware)

// ── Expose user to all views ──
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

// ── Routes ──
app.use('/', routes)

// ── Error Handling ──
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app
