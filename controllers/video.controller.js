import UserModel from "../models/user.model.js"
import VideoModel from "../models/video.model.js"
import { createError } from '../error.js'

export const addVideo = async (req, res, next) => {
    try {
        const data = req.body
        const { id } = req.user

        const video = await VideoModel.create({ userId: id, ...data })
        res.status(201).json(video)
    } catch (err) {
        next(err)
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id
        const data = req.body
        const { id } = req.user

        if (!videoId) {
            return next(createError(400, "Video id is missing"))
        }

        const video = await VideoModel.findById(videoId)
        if (!video) {
            return next(createError(404, "Video not found"))
        }
        if (videoId === id) {
            const updatedVideo = await VideoModel.findByIdAndUpdate(video, {
                $set: data
            }, { new: true })
            res.status(200).json(updatedVideo)
        } else {
            return next(createError(403, "you can only update your video"))
        }
    } catch (err) {
        next(err)
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id
        const { id } = req.user

        if (!videoId) {
            return next(createError(400, "Video id is missing"))
        }

        const video = await VideoModel.findById(videoId)
        if (!video) {
            return next(createError(404, "Video not found"))
        }
        if (videoId === id) {
            await VideoModel.findByIdAndDelete(videoId)
            res.status(200).json({ message: "video has been deleted" })
        } else {
            return next(createError(403, "you can only delete your video"))
        }
    } catch (err) {
        next(err)
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id

        if (!videoId) {
            return next(createError(400, "Video id is missing"))
        }

        const video = await VideoModel.findById(videoId)
        if (!video) {
            return next(createError(404, "Video not found"))
        }
        res.status(200).json(video)

    } catch (err) {
        next(err)
    }
}

export const views = async (req, res, next) => {
    try {
        const videoId = req.params.id

        if (!videoId) {
            return next(createError(400, "Video id is missing"))
        }

        await VideoModel.findByIdAndUpdate(videoId, {
            $inc: { views: 1 }
        })
        res.status(200).json({ message: "the views is increased" })

    } catch (err) {
        next(err)
    }
}

export const trend = async (req, res, next) => {
    try {
        const videos = await VideoModel.find().sort({ views: -1 })
        res.status(200).json(videos)

    } catch (err) {
        next(err)
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await VideoModel.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

export const sub = async (req, res, next) => {
    try {
        const { id } = req.user

        const user = await UserModel.findById(id)
        const subscribeChannels = user.subscribedUsers

        const list = await Promise.all(
            subscribeChannels.map(async channelId => {
                return await VideoModel.find({ userId: channelId })
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        next(err)
    }
}

export const tags = async (req, res, next) => {
    try {
        const tags = req.query.tags.split(",")

        const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20)
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

export const search = async (req, res, next) => {
    try {
        const query = req.query.q

        const videos = await VideoModel.find({title: {$regex: query, $options: "i"}})
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}