import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postURL: {
    type: String,
    required: true,
  },
  id: { type: String, required: true },
  overview: { type: String, required: true },
  releaseDate: { type: String, required: true },
  genres: Array,
  reviews: Array,
  rating: String,
  wantToWatchUsers: Array,
  watchedUsers: Array,
})

export default mongoose.model('Story', movieSchema)
