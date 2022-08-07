import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { loginValidation, registerValidator } from './validations/auth.js'
import { createPostValidator, updatePostValidator } from './validations/post.js'

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import * as CommentController from './controllers/CommentController.js'

import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB RDY'))
	.catch((error) => console.log('DB ERROR', error))

const app = express()

const PORT = process.env.PORT || 3333

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},

	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.GetMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
})

app.post('/posts', checkAuth, createPostValidator, handleValidationErrors, PostController.create)
app.get('/posts/sortedBy/:paramId/activeTag/:activeTag', PostController.getFull)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.patch('/posts/:id', checkAuth, updatePostValidator, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.post('/comments', checkAuth, CommentController.create)
app.get('/comments', CommentController.getAll)

app.listen(PORT, (error) => {
	if (error) {
		return console.log(error)
	}

	console.log(`server rdy with port: ${PORT}`)
})