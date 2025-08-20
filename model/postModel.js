import mongoose from 'mongoose'
const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
    },
    postBody: {
      type: String,
      required: true,
    },
    comments: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    },
    detailedPicture: {
      type: String,
      required: true,
    },
    previewPicture: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  { timestamps: true }
)

const postModel = mongoose.model('post', postSchema)

export default postModel
