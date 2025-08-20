import commentModel from '../model/commentModel.js'
import postModel from '../model/postModel.js'

export const createComment = async (req, res, next) => {
  const { id } = req.user
  const { postId } = req.params
  const body = req.body

  try {
    const newComment = new commentModel({ author: id, postId, ...body })
    const savedComment = await newComment.save()

    await postModel.findByIdAndUpdate(postId, { $push: { comments: savedComment.id } }, { new: true })

    return res.status(201).json({
      message: 'Comment created successfully',
      data: savedComment,
    })
  } catch (error) {
    next(error)
  }
}

export const editComment = async (req, res, next) => {
  const { commentId } = req.params
  const body = req.body
  try {
    const comment = await commentModel.findById(commentId)
    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      })
    }
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'You cannot edit this comment',
      })
    }

    const editedComment = await commentModel.findByIdAndUpdate(commentId, { ...body }, { new: true })

    return res.status(200).json({
      message: 'Comment edited successfully',
      data: editedComment,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params

  try {
    const deletedComment = await commentModel.findByIdAndDelete(commentId)
    return res.status(200).json({
      message: 'Comment deleted successfully',
      data: deletedComment,
    })
  } catch (error) {
    next(error)
  }
}
