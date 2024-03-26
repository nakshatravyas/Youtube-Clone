import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//method for generating refresh and access token
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //saving the token to the database
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) //to bypass password while saving token

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, 'Failed to generate refresh and access token')
    }
}


const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation-not empty
    //check if user already exist:using username and email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //check for user creation  error or success 
    //remove password and refresh token field from response
    //then send response

    //1
    // console.log(req.body)
    const { fullname, email, username, password } = req.body
    // console.log("email: ", email)
    //2
    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //3
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, 'Email or Username already exists')
    }
    //4
    // doing this from multer and multer will give us path on which it has uploaded on server. it is not  yet on cloudinary
    // console.log(req.files)
    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is required")
    }
    //5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }
    //6
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    //7
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Failed to create a new user")
    }
    //8
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation-not empty
    //find user (check for correct email)
    //check password
    //access and refresh token
    //send cookies(token/refresh token)

    //1
    const { email, username, password } = req.body
    //2
    if (!(username || email)) {
        throw new ApiError(400, "Email or Username are required")
    }
    //3
    // User.findOne({email})
    const user = await User.findOne({
        $or: [{ username }, { email }] //ya to username mil jaae ya email mil jaae
    })
    if (!user) {
        throw new ApiError(400, "User does not exist")
    }
    //4
    //we will use small user which is user not User(mongodb saved user)
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, 'Incorrect Password')
    }
    //5
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    //6
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,//nessage
                {
                    user: loggedInUser, accessToken, refreshToken
                },//data
                "User logged in successfully"//messgae
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    //we need to change refresh token from db  and clear cookie in frontend to make user logout
    //for this we will find the user through middleware and then make it undefined
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
})

const refreshTokenRenew = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        //matching incoming and token from db
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }
        //generating and sending a new pair of tokens
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})
export { registerUser, loginUser, logoutUser,refreshTokenRenew }