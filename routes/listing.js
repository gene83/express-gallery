'use strict';

const express = require('express');
const router = express.Router();
const Photo = require('../database/models/Photo');
const User = require('../database/models/User');

const renderData = {
  photoList: null
};

router.get('/', (req, res) => {
  Photo.fetchAll().then(photoList => {
    renderData.photoList = photoList.toJSON();
    res.render('listing', renderData);
  });
});

module.exports = router;
