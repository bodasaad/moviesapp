const User = require('./User');
module.exports.like = (movie, likes) => {
  const filtedredLikes = likes.items.filter(item => {
    return item.movieId.toString() !== movie._id.toString();
  });
  const updatedLikeItems = [...filtedredLikes];
  updatedLikeItems.push({
    movieId: movie._id,
    name: movie.name,
    poster: movie.image.original
  });
  const updatedLikes = {
    items: updatedLikeItems
  };
  return updatedLikes;
};


module.exports.unlike = (movieId, likes) =>{
  
  const filteredMovies = likes.items.filter(item => {
    return item.movieId.toString() !== movieId.toString();
  });
  const updatedLikeItems = [...filteredMovies];
  const updatedLikes = {
    items: updatedLikeItems
  };
  return updatedLikes;

}