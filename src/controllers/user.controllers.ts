import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import User from '../models/user.model'
import dotenv from 'dotenv'

dotenv.config()

export const signin = async (req: Request, res: Response) => {
  //1. find if user existsSync
  //2. find if password is correct
  //3. if user exists and password is correct, create token
  //4. send status, token, and user
  const { email, password } = req.body
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (!existingUser)
      return res.status(404).json({ message: 'User does not exist' })
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    )
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )
    return res.status(200).json({ user: existingUser, token })
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong.' })
  }
}
export const signup = async (req: Request, res: Response) => {
  //1. find if there is an existing user with the same email
  //2. check if the password is the same as confirmPassword
  //3. send status, user, token
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    favoriteGenres,
  } = req.body

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' })
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' })
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      favoriteGenres,
    })
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )
    return res.status(201).json({ user: newUser, token })
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong.' })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find(/* {}, 'name email' */)
    if (!allUsers.length)
      return res.status(404).json({ message: 'No users found' })
    return res.status(200).json({ users: allUsers })
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong.' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const followUser = async (req: Request, res: Response) => {
  const { id: followedUserId } = req.body
  const { id } = req.params
  try {
    const followedUser = await User.findOne({ _id: followedUserId })
    if (!followedUser)
      return res.status(404).json({ message: 'User not found' })
    const user = await User.findOne({ _id: id })
    user?.following.push(followedUserId)
    console.log(user?.following)
    await user?.save()
    followedUser?.followers.push(id)
    console.log(followedUser)
    await followedUser?.save()
    return res.status(200).json({ message: 'follow done' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(id)
  try {
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    await User.deleteOne({ _id: id })
    await User.deleteOne({ _id: id })
    const followingUsers = await User.find({ following: { $elemMatch: id } })
    console.log(followingUsers)

    return res.status(200).json({ message: 'user removed' })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const removeFollow = async (req: Request, res: Response) => {
  const { id: followedUserId } = req.body
  const { id } = req.params

  try {
    const followedUser = await User.findOne({ _id: followedUserId })
    if (!followedUser)
      return res.status(404).json({ message: 'User not found' })
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    const newFollowingList = user.following.filter(
      (followedId) => followedId !== followedUserId
    )
    user.following = newFollowingList
    await user.save()
    const newFollowerList = followedUser.followers.filter(
      (followingId) => followingId !== id
    )
    followedUser.followers = newFollowerList
    await followedUser.save()
    return res.status(200).json({ message: 'remove following success' })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const getFollowers = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!user.followers.length)
      return res.status(404).json({ message: 'no followers found' })
    console.log(user.followers)
    return res.status(200).json({ followers: user.followers })
  } catch (error) {
    return res.status(500).json({ message: 'something wrong happened' })
  }
}

export const getFollowing = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!user.following.length)
      return res.status(404).json({ message: 'no following found' })
    console.log(user.following)
    return res.status(200).json({ following: user.following })
  } catch (error) {
    return res.status(500).json({ message: 'something wrong happened' })
  }
}



export const addReview = async (req: Request, res: Response) => {
  const {userId, review} = req.body
  const {id} = req.params
  try {
    if (!userId || !review || !id) return res.status(500).json({ message: 'Either userId, review, or movieId is not specified' })
    const user = await User.findOne({_id: userId})
    if (!user) return res.status(404).json({ message: 'user not found'})
    user.reviews.push({id, review})
    await user.save()
    return res.status(200).json({ message: 'review added'})
  } catch (error) {
    return res.status(500).json({ message: 'something wrong happened' })
  }
}
export const createList = async (req: Request, res: Response) => {

}
export const wantToWatch = async (req: Request, res: Response) => {

}
