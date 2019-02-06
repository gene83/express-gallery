'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../database');

const renderData = {
  photoList: null,
  singlePhoto: null
};

router.post('/', (req, res) => {
  knex('photos')
    .insert({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description
    })
    .then(() => {
      res.redirect('/');
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;

  knex('photos')
    .where('id', id)
    .update(req.body)
    .then(() => {
      res.redirect(`/gallery/${id}`);
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  knex('photos')
    .where('id', id)
    .delete()
    .then(() => {
      res.redirect('/');
    });
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  knex('photos')
    .select('id', 'link', 'title', 'author')
    .then(photoList => {
      return (renderData.photoList = photoList.slice(0, 3));
    });

  knex('photos')
    .where('id', id)
    .select('id', 'link', 'title', 'author', 'description')
    .then(singlePhoto => {
      renderData.singlePhoto = singlePhoto[0];
      res.render('details', renderData);
    });
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;

  knex('photos')
    .where('id', '=', id)
    .select('id', 'link', 'title', 'author', 'description')
    .then(singlePhoto => {
      renderData.singlePhoto = singlePhoto[0];
      res.render('edit', renderData);
    });
});

module.exports = router;
