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

    const newUser = await userModel({
      name,
      email,
      password: hashedPassword,
      profilePic: resource.secure_url,
      ...others,
    })
    await fs.unlink(file.path)
    const savedUser = await newUser.save()

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
