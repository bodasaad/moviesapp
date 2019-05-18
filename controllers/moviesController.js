const Movie = require("../models/Movies");

const User = require("../models/User/User");

const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

exports.getIndex = (req, res, next) => {
  const itemPerPage = 10;
  const pageNum = +req.query.page || 1;
  let totalItems;
  Movie.find()
    .countDocuments()
    .then(numMovies => {
      totalItems = numMovies;
      return Movie .find()
        .skip((pageNum - 1) * itemPerPage)
        .limit(itemPerPage);
    })
    .then(movies => {
        res.render("index", {
        movies: movies,
        errmsg: null,
        path: "/",
        title: "Home Cinema: Brings Cinema's Movies To Your Home ",
        currentPage: pageNum,
        hasNextPage: itemPerPage * pageNum < totalItems,
        hasAfterNext: itemPerPage * pageNum < totalItems + 1,
        hasPrevPage: pageNum > 1,
        nextPage: pageNum + 1,
        prevPage: pageNum - 1,
        afterNext: pageNum + 2,
        lastPage: Math.ceil(totalItems / itemPerPage)
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.searchPost = (req, res, next) => {
  let searchValue = req.body.search;
  const db = getDb();
  return db
    .collection("movies")
    .findOne({ name: searchValue })
    .then(movie => {
      res.render("download", {
        movie: movie,
        errmsg: null,
        path: "/watch/:movieId",
        title: "Search Result"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getMovie = (req, res, next) => {
  const movId = req.params.movieId;
  return Movie.findById(movId)
    .then(movie => {
      res.render("download", {
        movie: movie,
        errmsg: null,
        path: "/movies/:movieId",
        title: `Watch:  ${movie.name}`
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// exports.getWatch = (req, res, next) => {
//   const movId = req.params.movieId;
//   Movie.findOne({ _id: new mongodb.ObjectId(movId) })
//     .then(movie => {
//       const genres = movie.genres;
//       console.log(genres);

//       res.render("watch", {
//         movie: movie,
//         path: "/watch/:movieId",
//         title: `Movie is: ${movie.name}`
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getDownload = (req, res, next) => {
//   const movId = req.params.movieId;
//   return Movie.findById(movId)
//     .then(movie => {
//       res.render("download", {
//         movie: movie,
//         path: "/download/:movieId",
//         title: `Download:  ${movie.name}`
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getAbout = (req, res, next) => {
  res.render("aboutus", {
    title: "About Us",
    errmsg: null,
    path: "/about"
  });
};

exports.getContact = (req, res, next) => {
  res.render("contact", {
    title: "Contact Us",
    errmsg: null,
    path: "/contact"
  });
};
