import jwt from "jsonwebtoken"
import { createError } from '../error.js'

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if(!token) {
            return next(createError(401, "Unauthorized"))
        }

        jwt.verify(token, process.env.JWT, (err, user) => {
            if(err) {
                return next(createError(403, "token is not valid"))
            }
            req.user = user
            next()    
        })

    } catch(err) {
        next(err)
    }
} 