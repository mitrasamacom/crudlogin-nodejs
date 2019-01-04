var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

//----------------START Koneksi DB-----------------//
mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});
//----------------END-Koneksi DB-----------------//

// Middleware
app.use(express.static(__dirname + '/public'));
// gambar,css,js yang static harus disimpen di public
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

//----------------START-Akses folder-----------------//

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

//----------------END-Akses folder-----------------//

//----------------START-Akses Port-----------------//
app.listen(secret.port, function(err){
  if (err) throw err;
  console.log("Server is Running on port " + secret.port);
});
//----------------END-Akses Port-----------------//