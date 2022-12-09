import express from 'express'
import {
  signin,
  signup,
  getAllUsers,
  getUser,
  followUser,
  removeUser,
  removeFollow,
  getFollowers,
  getFollowing,
  addReview
} from '../controllers/user.controllers'

const router = express.Router()

//refer to controllers for these functions
router.post('/signin', signin)
router.post('/signup', signup)
router.get('/all-users', getAllUsers)
router.get('/:id', getUser)
router.patch('/follow/:id', followUser)
router.patch('/remove-follow/:id', removeFollow)
router.delete('/remove-user/:id', removeUser)
router.get('/:id/followers', getFollowers)
router.get('/:id/following', getFollowing)
router.post('/:id/review', addReview)
export default router
