module.exports = (movie ,likes) =>{
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
    return updatedLikes
}