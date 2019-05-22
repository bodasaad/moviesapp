const path = require('path');

const express = require('express');

const { check, body } = require('express-validator/check');

const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/', moviesController.getIndex);

router.post('/search', moviesController.searchPost);

router.get('/movies/:movieId', moviesController.getMovie);

router.get('/contact', moviesController.getContact);

router.get('/about', moviesController.getAbout);

router.get('/moviesCategory/:category', moviesController.getCategory);

module.exports = router;