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
      return Movie.find()
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


exports.getCategory = async (req, res, next) => {

  const itemPerPage =20
  const pageNum = +req.query.page || 1;
  const category = req.params.category;
  let totalItems;
  Movie.find({ genres: category })
    .countDocuments()
    .then(numMovies => {
      totalItems = numMovies;
      console.log(totalItems);
      
      return Movie.find({ genres: category })
        .skip((pageNum - 1) * itemPerPage)
        .limit(itemPerPage)
    })
    .then(movies => {
      res.render("category", {
        movies: movies,
        errmsg: null,
        path: "/",
        title: category,
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

    })
}




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

