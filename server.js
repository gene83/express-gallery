'use strict';

const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const redis = require('connect-redis')(session);
const flash = require('connect-flash');

const gallery = require('./routes/gallery');
const listing = require('./routes/listing');
const User = require('./database/models/User');
const Photo = require('./database/models/Photo');

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'super tube';
const saltRounds = 12;

const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  session({
    store: new redis({ url: 'redis://localhost:6379', logErrors: true }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: ENV === 'production' }
  })
);
app.use(flash());
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User({ id: user.id })
    .fetch()
    .then(dbUser => {
      dbUser = dbUser.toJSON();
      return done(null, {
        id: dbUser.id,
        username: dbUser.username
      });
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
        console.log(user);

        if (user === null) {
          return done(null, false, {
            message: `user: ${username} doesnt exist`
          });
        } else {
          user = user.toJSON();
          bcrypt.compare(password, user.password).then(res => {
            if (res) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'incorrect password' });
            }
          });
        }
      })
      .catch(err => {
        console.log('error: ', err);
        return done(err);
      });
  })
);

app.post('/register', (req, res) => {
  if (req.body.username === '') {
    req.flash('message', 'Missing Username');
    res.redirect('/register');
  }

  if (req.body.password === '') {
    req.flash('message', 'Missing Password');
    res.redirect('/register');
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
    }

    bcrypt.hash(req.body.password, salt, (err, hash) => {
      return new User({
        username: req.body.username,
        password: hash
      })
        .save()
        .then(user => {
          console.log(user);
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          return res.send('Error Creating account');
        });
    });
  });
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login', {
    loginOrRegisterPage: true,
    message: req.flash('error')
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    loginOrRegisterPage: true,
    message: req.flash('message')
  });
});

app.use('/', listing);
app.use('/gallery', gallery);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
