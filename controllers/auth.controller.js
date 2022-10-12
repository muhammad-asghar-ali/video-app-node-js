import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import UserModel from "../models/user.model.js"

export const signup = async (req, res, next) => {
    try {
        const data = req.body
        if (!data.name || !data.email || !data.password) {
            return next(createError(400, "name or email or password missing"))
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(data.password, salt)

        await UserModel.create({ ...data, password: hash })
        res.status(201).json({ message: "user created" })

    } catch (err) {
        next(err)
    }
}

export const signin = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email || !req.body.password) {
            return next(createError(400, "email or password missing"))
        }

        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return next(createError(404, "no user registered with this email"))
        }

        const isPassworCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPassworCorrect) {
            return next(createError(400, "wrong credentials"))
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT)

        const { password, ...info } = user._doc

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(info)

    } catch (err) {
        next(err)
    }
}

export const google = async (req, res, next) => {
    try {

    } catch (err) {
        next(err)
    }
}
