import express from "express";
import mongoose from "mongoose";
import blogs from "./routes/blogs.js"


const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/eindopdracht').then( ()=>{
    console.log('Verbonden')
}  ).catch( () =>{
    console.log('Niet verbonden')
});
app.use((req,res,next)=>{
    if ( req.headers.accept !== 'application/json' && req.method !== 'OPTIONS') {
        return res.status(406).send('Illegal format');
    }else{
        next();

    }
})
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,Accept,Authorization");
    next();
})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/blogs',blogs)


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});
