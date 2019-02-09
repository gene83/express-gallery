'use strict';

const express = require('express');
const router = express.Router();
const Photo = require('../database/models/Photo');
const User = require('../database/models/User');

const renderData = {
  photoList: null,
  user: null
};

router.get('/', (req, res) => {
  renderData.user = req.user;
  Photo.fetchAll().then(photoList => {
    renderData.photoList = photoList.toJSON();
    renderData.message = req.flash('message');
    res.render('listing', renderData);
  });
});

module.exports = router;
