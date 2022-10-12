import express from "express"
import { deleteUser, disLikeVideo, getUser, likeVideo, subcribeUser, unSubcribeUser, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verify.token.js"

const router = express.Router()

router.get('/find/:id', getUser)
router.put("/:id", verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)
router.put('/sub/:id', verifyToken, subcribeUser)
router.put('unsub/:id', verifyToken, unSubcribeUser)
router.put('like/:videoId', verifyToken, likeVideo)
router.put('dislike/:videoId', verifyToken, disLikeVideo)
export default router