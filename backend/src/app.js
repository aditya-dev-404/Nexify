import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routs.js'
import postRouter from './routes/post.routes.js';
import connectionRouter from './routes/connection.routes.js';
const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

//routes goes here 
app.get('/',(req, res)=>{
    res.json({
        status : 200,
        message:"Everything working fine"
    })
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/user/post', postRouter);
app.use('/api/user/connection', connectionRouter)


//global error handler

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        status,
        message: err.message || "Internal Server Error.",
        success: err.success,
        errors: err.errors || []
    })
})

export { app };