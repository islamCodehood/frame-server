import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id: String,
  favoriteGenres: Array,
  followers: Array,
  following: Array,
  movies: Array,
  wantToWatch: Array,
  lists: Array,
  reviews: Array,
  ratings: Array,
})

export default mongoose.model('User', userSchema)
