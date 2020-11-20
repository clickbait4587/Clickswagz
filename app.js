var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const fs = require('fs');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const passport = require("passport")
const User = require("./models/user")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose");

const mongoose = require('mongoose');
const mongoURI =
"mongodb+srv://squashetonics:TPWbUdSRFfNVmnQM@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority";
try {
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
} catch (err) {
console.log(err.message);
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
{console.log('Connection')
    var dbAdmin = db.db.admin();
}
});
//The auth
app.use(passport.initialize());
app.use(passport.session());

app.use(
    require("express-session")({
        secret: "Hello World, this is a session",
        resave: false,
        saveUninitialized: false,
    })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/signup", require("./Routes/user"));
app.get('/login', (req,res)=>{
  res.render('login')
})
app.post("/login", passport.authenticate("local"), function(req, res) {
    res.redirect("/");
});
app.get("/logout", function(req, res) {
  let ref = req.headers.referer.split("/");
  ref = ref[ref.length - 1] ? `/${ref[ref.length - 1]}` : "/";
  req.logout();
  res.redirect(ref);
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/products', require('./routes/products'))
app.use('/cart', require('./routes/cart'))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.status(404).render('404')
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
