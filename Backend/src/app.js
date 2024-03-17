import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

//configuration of CORS
app.use(cors({
    origin:process.env.CORS_ORIGIN,  //setting origin for good practice
    credentials:true
}))

//configurations for production grade
//.use is used for middleware config
app.use(express.json({limit:'16kb'})) //setting json limit of incoming data to resufe server to crash.we dont need high size coming that cause server to crash
app.use(express.urlencoded({extended:true,limit:"16kb"})) //config of url for every browser. this is done when data is to be taken from url
app.use(express.static("public"))   //using public folder as static server. this will contain files that can be accessed by users eg:favicon
app.use(cookieParser()) //cookie config





export {app}