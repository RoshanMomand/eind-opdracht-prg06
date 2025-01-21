import express from "express";
import Blog from "../models/blog.js";

const router = express.Router();
router.get('/', async (req, res) => {
    try{
        const blogs = await Blog.find({})
        const collection = {
            "items": blogs,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL+"/blogs"
                },
                "collection": {
                    "href": process.env.BASE_URL+"/blogs"
                }
            }
        }

        res.status(200).json(collection);
    }catch (err){
        res.status(400).json({err:err.message})
    }
});
router.post('/', async(req,res)=>{

    try{
        const { title, description, review, author, categories } = req.body;
        const createBlog = await Blog.create({
            title,
            description,
            review,
            author,
            categories
        })
        res.status(201).json(createBlog)
    }catch (err){
        res.status(401).json({err:err.message})
    }
})
router.options('/', (req,res)=>{
    res.setHeader('Allow', 'GET, POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET','POST,OPTIONS']);
    res.send()
});

router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params
        // findById moet je geen object meegeven.
        const singleBlog = await Blog.findById(id);
        res.status(200).json(singleBlog);
    }catch (err){
        res.status(401).json(err)
    }
});
router.put('/:id',async(req,res)=>{
    try{
        console.log('----------------------------')
        // if the request param id is empty or doesnt exist than throw error or return 404 OR if the json body is invalid
        const{title,description,review} = req.body

        const editBlog = await Blog.findByIdAndUpdate(req.params.id, {
            title:title,
            description:description,
            review:review
        });
        console.log(req.body);
        res.status(200).json(editBlog)

    }catch (err){
        console.log(err)
        res.status(500).json({err:err.message})
    }
});
router.delete('/:id',async (req,res)=>{

    try{
        const{id} = req.params;
        const deleteBlog = await Blog.findByIdAndDelete({_id: id});
        res.status(200).json(deleteBlog);
    }catch (err){
        res.status(400).json({err:err.message})
    }


})
router.options('/:id', (req,res)=>{
    res.setHeader('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET','PUT','DELETE','OPTIONS']);
    res.send();
})

export default router