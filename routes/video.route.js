import express from "express"
import { addVideo, deleteVideo, getVideo, random, search, sub, tags, trend, updateVideo, views } from "../controllers/video.controller.js"
import { verifyToken } from "../middleware/verify.token.js"
const router = express.Router()

router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/:id', verifyToken, deleteVideo)
router.get('/find/:id', getVideo)

router.put('/view/:id', views)
router.get('/trend', trend)
router.get('/random', random)
router.get('/sub', verifyToken, sub)
router.get('/tags', tags)
router.get('/search', search)


export default router