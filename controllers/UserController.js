
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js'

export const register = async (req, res) => {
	try {
		
		const password = req.body.password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt)

		const doc = new User({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id
			},
			'secret123',
			{
				expiresIn: '5d'
			}
		)

		const {passwordHash, ...userData} = user._doc

		res.json({
			...userData,
			token
		})

	} catch (error) {
		res.status(500).json({
			message: 'Can not successfuly registered'
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await User.findOne({email: req.body.email})

		if(!user){
			return res.status(404).json({
				message: 'Account did not find'
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if(!isValidPass){
			return res.status(400).json({
				message: 'Incorrect login or password'
			})
		}

		const token = jwt.sign(
			{
				_id: user._id
			},
			'secret123',
			{
				expiresIn: '5d'
			}
		)

		const {passwordHash, ...userData} = user._doc

		res.json({
			...userData,
			token
		})

	} catch (error) {
		res.status(500).json({
			message: 'Can not successfuly logged in'
		})
	}
}

export const GetMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId)

		if(!user){
			return res.status(404).json({
				message: 'User did not find'
			})
		}

		const token = jwt.sign(
			{
				_id: user._id
			},
			'secret123',
			{
				expiresIn: '5d'
			}
		)

		const {passwordHash, ...userData} = user._doc

		res.json({
			...userData,
			token
		})
		
	} catch (error) {
		res.status(500).json({
			message: 'Access denied'
		})
	}
}