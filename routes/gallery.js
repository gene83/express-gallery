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

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect(`/gallery/${req.params.id}`);
  }
}

function isUsersPhoto(req, res, next) {
  let photoId = req.params.id;
  let userId = parseInt(req.user.id);

  if (req.isAuthenticated()) {
    Photo.where('id', photoId)
      .fetch()
      .then(photo => {
        photo = photo.toJSON();
        if (photo.user_id === userId) {
          next();
        } else {
          res.redirect(`/gallery/${req.params.id}`);
        }
      });
  } else {
    res.redirect(`/gallery/${req.params.id}`);
  }
}

router.post('/', isAuthenticated, (req, res) => {
  new Photo({
    user_id: req.user.id,
    link: req.body.link,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  })
    .save()
    .then(() => {
      req.flash('success', 'photo posted succesfully');
      res.redirect('/');
    });
});

router.put('/:id', isUsersPhoto, (req, res) => {
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

router.delete('/:id', isUsersPhoto, (req, res) => {
  const id = req.params.id;

  Photo.where('id', id)
    .destroy()
    .then(() => {
      res.redirect('/');
    });
});

router.get('/new', isAuthenticated, (req, res) => {
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

router.get('/:id/edit', isUsersPhoto, (req, res) => {
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
