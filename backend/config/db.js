import mongoose from "mongoose";

const connedctDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongodb connected");
    } catch(error){
        console.log(error);
    }
}
export default connedctDb;