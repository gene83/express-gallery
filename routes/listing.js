'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();
const Photo = require('../database/models/Photo');
const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

const renderData = {
  photoList: null,
  user: null
};

router.get('/', (req, res) => {
  renderData.user = req.user;
  Photo.fetchAll().then(photoList => {
    renderData.photoList = photoList.toJSON();
    renderData.message = req.flash('message');
    return res.render('listing', renderData);
  });
});

router.post('/register', (req, res) => {
  if (req.body.username === '') {
    req.flash('message', 'Missing Username');
    return res.redirect('/register');
  }

  if (req.body.password === '') {
    req.flash('message', 'Missing Password');
    return res.redirect('/register');
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      res.writeHead(500);
      return res.send('Error creating account');
    }

    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        res.writeHead(500);
        return res.send('Error creating account');
      }

      return new User({
        username: req.body.username,
        password: hash
      })
        .save()
        .then(user => {
          return res.redirect('/login');
        })
        .catch(err => {
          res.writeHead(500);
          return res.send('Error creating account');
        });
    });
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('login', {
    loginOrRegisterPage: true,
    message: req.flash('error')
  });
});

router.get('/register', (req, res) => {
  res.render('register', {
    loginOrRegisterPage: true,
    message: req.flash('message')
  });
});

module.exports = router;
