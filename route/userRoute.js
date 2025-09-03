import express from 'express'
import { createUser, getAllUsers, getOneUser, loginUser, updateUser } from '../controller/userController.js'
const route = express()
import upload from '../utils/multer.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'
import { authentication } from '../middlewares/authMiddleware.js'

route.post('/create-user', upload.single('profilePic'), createUser)
route.post('/login-user', loginUser)
route.get('/getOneUser/:id', authentication, isAdmin, getOneUser)
route.put('/updateUser/:userId', authentication, updateUser)
route.get('/getAllUsers', authentication, isAdmin, getAllUsers)

export default route
