import connectDB from "./config/db.config.js";
import { ENV } from "./config/env.config.js";
import { app } from "./app.js";

connectDB()
    .then(()=>{
        app.listen(ENV.PORT, ()=>{
            console.log(`Server Running on Port ${ENV.PORT}`);
        })
    }).catch((err)=>{
        console.error('Server Setup Failed',err.message);
        process.exit(1);
    })