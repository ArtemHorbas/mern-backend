import Comment from '../models/Comment.js'

export const create = async (req, res) => {
	try {
		const doc = new Comment({
			user: req.userId,
			post: req.body.postId,
			text: req.body.text
		})

		const comment = await doc.save()

		res.json(comment)
	} catch (error) {
		res.status(500).json({
			message: 'Error with making a post'
		})
	}
}

export const getAll = async (req, res) => {
	try {
		let comments =  await Comment.find().populate('user').populate('post').sort({ createdAt: -1 }).exec();

		res.json(comments)
	} catch (error) {
		res.status(500).json({
			message: 'Error with taking posts'
		})
	}
}