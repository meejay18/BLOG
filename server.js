import express from 'express'
import mongoose from 'mongoose'
const app = express()
const port = 4500
import dotenv from 'dotenv'
dotenv.config()
import userRoute from './route/userRoute.js'
import postRoute from './route/postRoute.js'
import commentRoute from './route/commentRoute.js'
import cookieParser from 'cookie-parser'

app.use(express.json())
app.use(cookieParser())

app.use(userRoute)
app.use(postRoute)
app.use(commentRoute)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('Error :', err.message)
  })

app.use((error, req, res, next) => {
  return res.status(error.status || 500).json({ message: error.message || 'Something went wrong' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
