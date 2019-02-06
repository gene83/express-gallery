'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../database');

const renderData = {
  photoList: null
};

router.get('/', (req, res) => {
  knex('photos')
    .select('id', 'link', 'title', 'author', 'description')
    .then(photoList => {
      renderData.photoList = photoList;
      res.render('listing', renderData);
    });
});

module.exports = router;
