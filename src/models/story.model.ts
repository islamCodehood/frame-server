import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
})

export default mongoose.model('Story', storySchema)
