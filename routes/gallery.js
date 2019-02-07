'use strict';

const express = require('express');
const router = express.Router();
const Photo = require('../database/models/Photo');
const User = require('../database/models/User');

const renderData = {
  photoList: null,
  singlePhoto: null,
  user: null
};

router.post('/', (req, res) => {
  new Photo({
    link: req.body.link,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  })
    .save()
    .then(() => {
      res.redirect('/');
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;

  Photo.where('id', id)
    .fetch()
    .then(photo => {
      photo
        .save({
          link: req.body.link,
          title: req.body.title,
          author: req.body.author,
          description: req.body.description
        })
        .then(() => {
          res.redirect(`/gallery/${id}`);
        });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Photo.where('id', id)
    .destroy()
    .then(() => {
      res.redirect('/');
    });
});

router.get('/new', (req, res) => {
  renderData.user = req.user;
  res.render('new', renderData);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  renderData.user = req.user;

  Photo.fetchAll().then(photoList => {
    return (renderData.photoList = photoList.toJSON().slice(0, 3));
  });

  Photo.where('id', id)
    .fetch()
    .then(singlePhoto => {
      renderData.singlePhoto = singlePhoto.toJSON();
      res.render('details', renderData);
    });
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;

  renderData.user = req.user;

  Photo.where('id', id)
    .fetch()
    .then(singlePhoto => {
      renderData.singlePhoto = singlePhoto.toJSON();
      res.render('edit', renderData);
    });
});

module.exports = router;
