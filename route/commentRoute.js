import express from 'express'
import { authentication } from '../middlewares/authMiddleware.js'
import { createComment, deleteComment, editComment } from '../controller/commentController.js'
const route = express.Router()

route.post('/comment/:postId', authentication, createComment)
route.put('/editComment/:commentId', authentication, editComment)
route.delete('/deleteComment/:commentId', authentication, deleteComment)

export default route
