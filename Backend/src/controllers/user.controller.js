import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
    const { fullname, email, username, password } = req.body
    console.log("email: ", email)
    //2
    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError("All fields are required", 400)
    }
    //3
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError('Email or Username already exists', 409)
    }
    //4
    // doing this from multer and multer will give us path on which it has uploaded on server. it is not  yet on cloudinary
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError("Avatar is required", 400)
    }
    //5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError("Avatar is required", 400)
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
    if(!createdUser){
        throw new ApiError("Failed to create a new user",500)
    }
    //8
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export { registerUser }