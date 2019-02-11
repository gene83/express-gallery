'use strict';

const express = require('express');
const router = express.Router();
const Photo = require('../database/models/Photo');

const renderData = {
  photoList: null,
  singlePhoto: null,
  user: null,
  message: null,
  ownsPhoto: null
};

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('');
    res.redirect(`/gallery/${req.params.id}`);
  }
}

function isUsersPhoto(req, res, next) {
  let photoId = req.params.id;

  if (!req.isAuthenticated()) {
    req.flash('message', 'Acess denied: user does not own this photo');
    res.redirect(`/gallery/${req.params.id}`);
  }

  Photo.where('id', photoId)
    .fetch()
    .then(photo => {
      const userId = parseInt(req.user.id);

      photo = photo.toJSON();
      if (photo.user_id === userId) {
        next();
      } else {
        req.flash('message', 'Acess denied: user does not own this photo');
        res.redirect(`/gallery/${req.params.id}`);
      }
    });
}

router.post('/', isAuthenticated, (req, res) => {
  new Photo({
    user_id: parseInt(req.user.id),
    link: req.body.link,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  })
    .save()
    .then(() => {
      req.flash('message', 'photo posted succesfully');
      return res.redirect('/');
    })
    .catch(err => {
      res.writeHead(500);
      req.flash('message', 'could not post photo');
      return res.redirect('/gallery/new');
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
          req.flash('message', 'Photo updated successfully');
          return res.redirect(`/gallery/${id}`);
        })
        .catch(err => {
          res.writeHead(500);
          req.flash('message', 'Photo could not be updated');
          return res.redirect(`/gallery/${id}`);
        });
    });
});

router.delete('/:id', isUsersPhoto, (req, res) => {
  const id = req.params.id;

  Photo.where('id', id)
    .destroy()
    .then(() => {
      req.flash('message', 'Photo deleted succesfully');
      return res.redirect('/');
    })
    .catch(err => {
      res.writeHead(500);
      req.flash('message', 'Photo could not be deleted');
      return res.redirect(`/gallery/${id}`);
    });
});

router.get('/new', isAuthenticated, (req, res) => {
  renderData.message = req.flash('message');
  renderData.user = req.user;
  return res.render('new', renderData);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  renderData.message = req.flash('message');
  renderData.user = req.user;
  renderData.ownsPhoto = false;

  if (req.user) {
    const userId = parseInt(req.user.id);

    Photo.where('id', id)
      .fetch()
      .then(photo => {
        let photoJSON = photo.toJSON();

        if (photoJSON.user_id === userId) {
          return (renderData.ownsPhoto = true);
        }
      });
  }

  Photo.fetchAll()
    .then(photoList => {
      return (renderData.photoList = photoList.toJSON().slice(0, 3));
    })
    .catch(err => {
      res.writeHead(500);
      return res.send('Error fetching photos');
    });

  Photo.where('id', id)
    .fetch()
    .then(singlePhoto => {
      singlePhoto = singlePhoto.toJSON();
      renderData.singlePhoto = singlePhoto;
      return res.render('details', renderData);
    })
    .catch(err => {
      res.writeHead(500);
      return res.send('Error fetching photo');
    });
});

router.get('/:id/edit', isUsersPhoto, (req, res) => {
  const id = req.params.id;

  renderData.user = req.user;
  renderData.message = req.flash('message');

  Photo.where('id', id)
    .fetch()
    .then(singlePhoto => {
      renderData.singlePhoto = singlePhoto.toJSON();
      return res.render('edit', renderData);
    })
    .catch(err => {
      res.writeHead(500);
      return res.send('Error fetching photo');
    });
});

module.exports = router;
