const path = require('path');

const express = require('express');

const { check, body } = require('express-validator/check');

const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/', moviesController.getIndex);

router.post('/search', moviesController.searchPost);


// router.get('/watch/:movieId', moviesController.getWatch);

router.get('/movies/:movieId', moviesController.getMovie);


// router.get('/download/:movieId', moviesController.getDownload);


router.get('/about', moviesController.getAbout);



module.exports = router;