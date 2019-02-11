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

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'super tube';

const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  session({
    store: new redis({ url: 'redis://redis-server:6379', logErrors: true }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
    // cookie: { secure: ENV === 'production' }
  })
);
app.use(flash());
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
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
      res.writeHead(500);
      return res.send('server error');
    });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
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
        res.writeHead(500);
        return res.send('server error');
      });
  })
);

app.use('/', listing);
app.use('/gallery', gallery);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
