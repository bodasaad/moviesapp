
const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  facebookId:{
    type:String
  },
  accessToken:{
    type: String
  },
  password: {
    type: String
  },
  resetPassToken: String,
  signUpToken: String,
  isAdmin: Boolean,
  likes: {
    items: [
      {
        movieId: {
          type: Schema.Types.ObjectId,
          ref: 'Movies',
          required: true
        },
        name:{
          type:String,
          required: true,
        },
        poster:{
          type: String,
          required: true
        }
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);