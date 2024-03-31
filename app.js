var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('morgan');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game');
var eventsRouter = require('./routes/events');

var app = express();

if (process.env.LIVERELOAD === "yes") {
	const liveReloadServer = livereload.createServer();
	liveReloadServer.server.once("connection", () => {
	setTimeout(() => {
	liveReloadServer.refresh("/");
	}, 100);
	});

	app.use(connectLiveReload());
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/game', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use('/', eventsRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;