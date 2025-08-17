import express from 'express'
import { createUser, loginUser } from '../controller/userController.js'
const route = express()
import upload from '../utils/multer.js'

route.post('/create-user', upload.single('profilePic'), createUser)
route.post('/login-user', loginUser)

export default route
