import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routs.js'
import postRouter from './routes/post.routes.js';
import connectionRouter from './routes/connection.routes.js';
import http from 'http'
import {Server} from 'socket.io'
import notificationRouter from './routes/notification.routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : ({
    origin:"http://localhost:5173",
    credentials:true
    })
})
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
app.use('/api/user/connection', connectionRouter);
app.use('/api/notification',notificationRouter);
app.get('/ch',(req, res)=>{
    return res.status(200).json({status:"0k", message:"Backend is alive."})
})
io.on("connection", (socket) => {
    socket.on("register", (userId)=>{
        socket.join(`user:${userId}`);
    })
})

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

export { app, server, io };
