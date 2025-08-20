import postmodel from '../model/postModel.js'
import cloudinary from '../utils/cloudinary.js'
import fs from 'fs/promises'

export const createPost = async (req, res, next) => {
  const { id } = req.user
  const body = req.body
  const file = req.files
  try {
    const previewPicture = await cloudinary.uploader.upload(file['previewPicture'][0].path)
    const detailedPicture = await cloudinary.uploader.upload(file['detailedPicture'][0].path)

    body['previewPicture'] = previewPicture.secure_url
    body['detailedPicture'] = detailedPicture.secure_url

    const newPost = new postmodel({ author: id, ...body })

    const savedPost = await newPost.save()

    await fs.unlink(file['previewPicture'][0].path)
    await fs.unlink(file['detailedPicture'][0].path)

    return res.status(201).json({
      message: 'Post created successfully',
      data: savedPost,
    })
  } catch (error) {
    await fs.unlink(file['previewPicture'][0].path)
    await fs.unlink(file['detailedPicture'][0].path)
    next(error)
  }
}

export const editPost = async (req, res, next) => {
  const { postId } = req.params
  const body = req.body

  try {
    const updatedPost = await postmodel.findByIdAndUpdate(postId, { ...body }, { new: true })
    return res.status(200).json({
      message: 'Post edited successfully',
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}
export const deletePost = async (req, res, next) => {
  const { postId } = req.params
  try {
    const deletedPost = await postmodel.findByIdAndDelete(postId)

    return res.status(200).json({
      message: 'Post deleted successfully',
      data: deletedPost,
    })
  } catch (error) {
    next(error)
  }
}
