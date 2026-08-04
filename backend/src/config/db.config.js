import mongoose from 'mongoose'
import { ENV } from './env.config.js'

const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(ENV.DB_URL);
        console.log(`DataBase Connected ${connection.connection.host}`);
    }catch(err){
        console.error('Failed to Connect DataBase');
        process.exit(1);
    }
}
export default connectDB;