const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const moviesSchema = new Schema({
    url:{},
    name:{},
    type:{},
    language:{},
    genres:{},
    status:{},
    runtime:{},
    premiered:{},
    officialSite:{},
    schedule:{},
    rating:{
        average:{type: Number, index:true}
    },
    weight:{},
    network:{},
    webChannel:{},
    externals:{},
    image:{},
    summary:{},
    updated:{},
    _links:{}
})

module.exports = mongoose.model('movies', moviesSchema);

