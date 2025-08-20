import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

const commentModel = mongoose.model('comment', commentSchema)

export default commentModel
