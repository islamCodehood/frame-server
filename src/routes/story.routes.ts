import express from 'express'
import { getStories } from '../controllers/story.controllers'

const router = express.Router()

router.get('/', getStories)

export default router
