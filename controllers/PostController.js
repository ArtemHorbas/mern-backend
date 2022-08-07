import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

export const create = async (req, res) => {
	try {
		const doc = new Post({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		res.status(500).json({
			message: 'Error with making a post'
		})
	}
}

export const getFull = async (req, res) => {
	try {
		let posts;

		const id = req.params.paramId;
		const tag = req.params.activeTag;

		switch (id){
			case "0":
				if(tag === 'null'){
					posts = await Post.find().populate('user').sort({ createdAt: -1 }).exec();
				}else if(tag){
					posts = await Post.find({tags: tag}).populate('user').sort({ createdAt: -1 }).exec();
				}	
				break;

			case "1":
				if(tag === 'null'){
					posts = await Post.find().populate('user').sort({ viewsCount: -1 }).exec();
				}else if(tag){
					posts = await Post.find({tags: tag}).populate('user').sort({ viewsCount: -1 }).exec();
				}
				break;
			
			default:
				posts = await Post.find().populate('user').exec();
		}


		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: 'Error with taking posts'
		})
	}
}



export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		const comments = await Comment.find({post: postId}).populate('user').exec()

		Post.findOneAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { viewsCount: 1 }
			},
			{
				returnDocument: 'after'
			},
			(error, doc) => {			
				if(error){
					return res.status(500).json({
						message: 'Can not return posts'
					})
				}
				
				if(!doc){
					return res.status(404).json({
						message: 'Can not find the post'
					})
				}

				res.json({doc, comments})
			}
		).populate('user')

	} catch (error) {
		res.status(500).json({
			message: 'Error with taking a post'
		})
	}
}


export const getLastTags = async (req, res) => {
	try {
		const posts = await Post.find().limit(5).exec();

		const tags = posts.map(obj => obj.tags).flat().slice(0, 10)

		const uniqueArray = tags.filter(function(item, pos) {
			return tags.indexOf(item) == pos;
		})

		res.json(uniqueArray)
	} catch (error) {
		res.status(500).json({
			message: 'Error with taking tags'
		})
	}
}


export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await Post.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				user: req.userId
			}
		)

		res.json({
			success: true
		})
	} catch (error) {
		res.status(500).json({
			message: 'Can not update a post'
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		Post.findOneAndDelete(
			{
				_id: postId
			},
			(error, doc) => {
				if(error){
					return res.status(500).json({
						message: 'Can not remove a post'
					})
				}
				
				if(!doc){
					return res.status(404).json({
						message: 'Can not find the post'
					})
				}

				res.json({
					success: true
				})
			}
		)

	} catch (error) {
		res.status(500).json({
			message: 'Error with taking a post'
		})
	}
}


