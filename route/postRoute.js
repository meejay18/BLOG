import express from 'express'
import { authentication } from '../middlewares/authMiddleware.js'
import { createPost, deletePost, editPost, getAllPosts, getOnePost } from '../controller/postController.js'
import upload from '../utils/multer.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'
const route = express.Router()

const uploadMultiplefields = upload.fields([
  { name: 'previewPicture', maxCount: 3 },
  { name: 'detailedPicture', maxCount: 3 },
])

route.post('/create-post', authentication, uploadMultiplefields, createPost)
route.get('/getAllPosts', authentication, isAdmin, getAllPosts)
route.get('/getOnePost/:postId', authentication, isAdmin, getOnePost)
route.put('/edit-post/:postId', authentication, editPost)
route.delete('/delete-post/:postId', authentication, isAdmin, deletePost)

export default route
