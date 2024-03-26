import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
//auth middleware for checking user is logged in or not || authenticated
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        //taking the token from user through cookies or bearer token
        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        //verifying the user or token is correct
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
        //if user is there then adding new object in req and then move to next
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})