const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const session = require("express-session");
const mongoose = require("mongoose");
const MongoDbStore = require("connect-mongodb-session")(session);
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database");
const User = require("./models/User/User");
const Movie = require("./models/Movies");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

const MONGODBURI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@onlineshop-zsiuv.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;
const store = new MongoDbStore({
  uri: MONGODBURI,
  collection: "sessions"
});
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
// const adminRoutes = require('./routes/admin');
const moviesRoutes = require("./routes/moviesRoute");
const userRoutes = require("./routes/userRoute");
app.use(helmet());
app.use(compression());

app.use(async (req, res, next) => {
  // Using Indexes in database to fetch it effecintly
  const heighRating = await Movie.find({ "rating.average": { $gt: 8.5 } });
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.heighRating = heighRating;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    res.locals.name = undefined;
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      res.locals.name = req.user.name;
      console.log(user.name);

      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use(flash());

// app.use('/admin', adminRoutes);
app.use(moviesRoutes);
app.use(userRoutes);

// app.get("/500", errorController.get500);   
app.use(errorController.get404);


// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     pageTitle: "Error!",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn
//   });
//   console.log(`Error Is:${error}`);
// });

mongoose
  .connect(MONGODBURI)
  .then(result => {
    app.listen(process.env.PORT || 3000);
    console.log(`connected to db....`);
  })
  .catch(err => {
    console.log(`error is ${err}`);
  });
