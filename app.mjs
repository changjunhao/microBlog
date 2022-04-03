import express from 'express'
import partials from 'express-partials'
import path from 'path'
// import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import MongoStore from 'connect-mongo'
import flash from 'connect-flash'

import settings from './settings.mjs'
import routes from './routes/index.mjs'
// import users from './routes/users.mjs'

const app = express()

// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(partials());
app.use(flash());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: MongoStore.create({
    mongoUrl: `mongodb://${settings.host}/${settings.db}`
  })
}));
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  const error = req.flash('error')
  const success = req.flash('success')
  res.locals.error = error.length ? error : null;
  res.locals.success = success.length ? success : null;
  next();
});
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app
