import { body } from 'express-validator'

export const createPostValidator = [
	body('title', 'Write an article').isLength({ min: 3 }).isString(),
	body('text', 'Write a text').isLength({ min: 10 }).isString(),
	body('tags', 'Incorrect tags (use array)').optional().isArray(),
	body('imageUrl', 'Incorrect url').optional().isString()
]

export const updatePostValidator = [
	body('title', 'Write an article').optional().isLength({ min: 3 }).isString(),
	body('text', 'Write a text').optional().isLength({ min: 10 }).isString(),
	body('tags', 'Incorrect tags (use array)').optional().isArray(),
	body('imageUrl', 'Incorrect url').optional().isString()
]