import { createError } from '../error.js'
import CommentModel from "../models/comment.model.js"
import VideoModel from "../models/video.model.js"

export const addComment = async (req, res, next) => {
    try{
        const data = req.body
        const { id } = req.user

        const video = await CommentModel.create({ userId: id, ...data })
        res.status(201).json(video)
    } catch(err) {
        next(err)
    }
}

export const deleteComment = async (req, res, next) => {
    try{
        const commentId = req.params.id
        const { id } = req.user

        if (!commentId) {
            return next(createError(400, "Video id is missing"))
        }

        const comment = await CommentModel.findById(commentId)
        const video = await VideoModel.findById(commentId)
        if (id === comment.userId || id === video.userId) {
            await CommentModel.findByIdAndDelete(commentId)
            res.status(200).json({ message: "Comment has been deleted" })
        } else {
            return next(createError(403, "you can only delete your Comment"))
        }
    } catch(err) {
        next(err)
    }
}

export const getComment = async (req, res, next) => {
    try{
        const id = req.params.videoId
        if (!id) {
            return next(createError(400, "id is missing"))
        }
        const comments = await CommentModel.find({videoId: id})

        req.status(200).json(comments)
    } catch(err) {
        next(err)
    }
}
