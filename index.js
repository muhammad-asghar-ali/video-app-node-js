import dotenv from "dotenv"
import express from "express"
import mongoose from 'mongoose';
import morgan from "morgan"
import cors from "cors"
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import videoRoutes from "./routes/video.route.js"
import commentRoutes from "./routes/comment.routes.js"
dotenv.config()

const app = express()

app.use(cookieParser())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize: 50 });
mongoose.connection
    .once('open', () => { console.log("connection open"); })
    .on('error', err => {
        console.log(err);
        console.log('DB is not connected');
        throw err;
    })

const port = process.env.PORT || 3009

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/video", videoRoutes)
app.use("/api/comment", commentRoutes)

// error handling
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "something went wrong"
    return res.status(status).json({
        success: false,
        status,
        message
    }) 
}) 

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})