import { createError } from '../error.js'
import VideoModel from '../models/video.model.js'
import UserModel from "../models/user.model.js"

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const { id } = req.user

        if (userId !== id) {
            return next(createError(403, "can not get the user"))
        }
        const user = await UserModel.findById(userId)
        const { password, ...info } = user._doc
        res.status(200).json(info)
    } catch (err) {
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const data = req.body
        const { id } = req.user

        if (data.password || email) {
            return next(createError(400, "can not update the password or email"))
        }

        if (userId !== id) {
            return next(createError(403, "you can update only your account"))
        }
        const user = await UserModel.findByIdAndUpdate(userId, {
            $set: data
        }, { new: true })
        const { password, ...info } = user._doc
        res.status(200).json(info)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const { id } = req.user

        if (userId !== id) {
            return next(createError(403, "you can delete only your account"))
        }
        await UserModel.findByIdAndDelete(userId)
        res.status(200).json({ message: "user deletedsss" })
    } catch (err) {
        next(err)
    }
}

export const subcribeUser = async (req, res, next) => {
    try {
        const {id} = req.params
        if(!id) {
            return next(createError(400, "id missing"))
        }
        await UserModel.findByIdUpdate(id, {
            $push: {subcribeUser: id}
        })
        await UserModel.findByIdAndUpdate(id, {
            $inc: {subscribers: 1}
        })
        res.status(200).json({message: "subscription successful"})
    } catch (err) {
        next(err)
    }
}

export const unSubcribeUser = async (req, res, next) => {
    try {
        const {id} = req.params
        if(!id) {
            return next(createError(400, "id missing"))
        }
        await UserModel.findByIdUpdate(id, {
            $pull: {subcribeUser: id}
        })
        await UserModel.findByIdAndUpdate(id, {
            $inc: {subscribers: -1}
        })
        res.status(200).json({message: "Unsubscription successful"})
    } catch (err) {
        next(err)
    }
}

export const likeVideo = async (req, res, next) => {
    try {
        const id = req.user.id
        const videoId = req.params.videoId

        if(!videoId) {
            return next(createError(400, "video id is missing"))
        }
        await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: {likes: id},
            $pull: {dislikes: id}
        })
        res.status(200).json({message: "the video has been liked"})
    } catch (err) {
        next(err)
    }
}

export const disLikeVideo = async (req, res, next) => {
    try {
        const id = req.user.id
        const videoId = req.params.videoId
        if(!videoId) {
            return next(createError(400, "video id is missing"))
        }

        await VideoModel.findByIdAndUpdate(videoId, {
            $addToSet: {dislikes: id},
            $pull: {likes: id}
        })
        res.status(200).json({message: "the video has been disliked"})
    } catch (err) {
        next(err)
    }
}


