const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const mongoose = require('mongoose');
const MongoDbStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');
const User = require('./models/User');
const flash = require('connect-flash');

const app = express();

const MONGODBURI = 'mongodb+srv://abdelrhman:ingodwetrust@onlineshop-zsiuv.mongodb.net/moviesApp?retryWrites=true';
const store = new MongoDbStore({
  uri: 'mongodb+srv://abdelrhman:ingodwetrust@onlineshop-zsiuv.mongodb.net/moviesApp?retryWrites=true',
  collection: 'sessions'
});
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret:'my secret',
     resave: false,
      saveUninitialized: false,
       store: store
  })
  );
// const adminRoutes = require('./routes/admin');
const moviesRoutes = require('./routes/moviesRoute');
const userRoutes = require('./routes/userRoute');

app.use((req, res, next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
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
    .catch(err => console.log(err));
});

app.use(flash());


// app.use('/admin', adminRoutes);
app.use(moviesRoutes);
app.use(userRoutes);

app.use(errorController.get404);



mongoose
  .connect(MONGODBURI)
  .then(result => {
    app.listen(3000);
    console.log(`connected to db....`);
  })
  .catch(err => {
    console.log(`error is ${err}`);
  });
