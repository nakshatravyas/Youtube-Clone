import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

//DB connection
//written in immediate invoke function and should always be written with async await and try catch
const connectDB = async () => {
    try {
        const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected! DB HOST: ${connInstance.connection.host}`) //checking in which DB host we are
    }
    catch (error) {
        console.log("DB connection error: ", error)
        process.exit(1)
    }
}
//exporting function of the connection of DB 
export default connectDB