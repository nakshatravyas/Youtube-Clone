// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'  //config of env package for module type import
})

connectDB()       //function coming from index.js in db folder
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error: ",error)
        throw error
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
    })
})
.catch((err)=>{ 
    console.log("Mongo db connection failed! ",err)
})



// import express from "express"
// const app=express()

// //DB connection
// //written in immediate invoke function and should always be written with async await and try catch
// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log("Error: ",error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     }
//     catch(error)
//     {
//         console.log("Error: ",error)
//         throw err
//     }
// })()