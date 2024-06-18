import mongoose from 'mongoose';

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{ dbName:"agripro"}).then(()=>{console.log("Database connected")}).catch((err)=>{console.log("Error:",err)});
}