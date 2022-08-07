import {body} from "express-validator";

export const registerValidator = [
	body('email', 'Your value is not an email').isEmail(),
	body('password', 'Password need to be at least 4 numbers').isLength({ min: 4 }),
	body('fullName', 'Write your nickname').isLength({ min: 3 }),
	body('avatarUrl', 'Incorrect link').optional().isURL()
];

export const loginValidation = [
	body('email', 'Your value is not an email').isEmail(),
	body('password', 'Password need to be at least 4 numbers').isLength({ min: 4 })
]