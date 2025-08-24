import express from 'express'
import { createUser, getAllUsers, getOneUser, loginUser } from '../controller/userController.js'
const route = express()
import upload from '../utils/multer.js'

route.post('/create-user', upload.single('profilePic'), createUser)
route.post('/login-user', loginUser)
route.get('/getOneUser/:id', getOneUser)
route.get('/getAllUsers', getAllUsers)

export default route
