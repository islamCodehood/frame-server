import express from 'express'
import { signin, signup, getAllUsers } from '../controllers/user.controllers'

const router = express.Router()

//refer to controllers for these functions
router.post('/signin', signin)
router.post('/signup', signup)
router.get('/all-users', getAllUsers)

export default router
