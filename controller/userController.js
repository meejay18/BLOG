import userModel from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../utils/cloudinary.js'
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res, next) => {
  const { name, email, profilePic, password, ...others } = req.body
  const file = req.file
  // console.log(file)

  if (!name) {
    return res.status(404).json({
      message: 'Name is required',
    })
  }
  if (!email) {
    return res.status(404).json({
      message: 'Email is required',
    })
  }
  if (!password) {
    return res.status(404).json({
      message: 'password is required',
    })
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const resource = await cloudinary.uploader.upload(file.path)
    // console.log(resource)

    // console.log(resource)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePic: resource.secure_url,
      ...others,
    })
    const savedUser = await newUser.save()
    await fs.unlink(file.path)

    return res.status(201).json({
      message: 'New user created',
      data: savedUser,
    })
  } catch (error) {
    await fs.unlink(file.path)
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(404).json({
      message: 'Email required',
    })
  }
  if (!password) {
    return res.status(404).json({
      message: 'Password required',
    })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'user not found. Create a new account',
      })
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(404).json({
        message: 'Incorrect Password',
      })
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' })
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    })

    return res.status(200).json({
      message: 'Login Successful',
    })
  } catch (error) {
    next(error)
  }
}
export const updateUser = async (req, res, next) => {
  const { id, role } = req.user
  const { userId } = req.params
  const data = req.body
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const isUser = user.id === id
    const isAdmin = role === 'admin'

    if (!isUser && !isAdmin) {
      return res.status(403).json({
        message: 'You cannot carry out this operation',
      })
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, { ...data }, { new: true })
    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
export const getOneUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await userModel.findById(id).populate('posts')
    return res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().populate('posts').populate('comments')
    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    })
  } catch (error) {
    next(error)
  }
}
