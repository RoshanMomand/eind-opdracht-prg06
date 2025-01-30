import express from "express";
import Exercise from "../models/exercise.js";

const router = express.Router();
router.get('/', async (req, res) => {
    try {

        const totalItems = await Exercise.countDocuments()
        // const limit = parseInt(req.query.limit) || parseInt(totalItems);
        // const page = parseInt(req.query.page) || 1;
        console.log(req.query.limit)
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : parseInt(totalItems);
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const totalPages = Math.ceil(totalItems / limit)


        const exercises = await Exercise.find({})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('categories', 'id');


        const collection = {
            "items": exercises,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL + "/exercises"
                },
                "collection": {
                    "href": process.env.BASE_URL + "/exercises"
                }
            },
            "pagination": {
                "currentPage": page,
                "currentItems": exercises.length,
                "totalPages": totalPages,
                "totalItems":totalItems,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": `${process.env.BASE_URL}/?page=1&limit=${limit}`
                    },
                    "last": {
                        "page": totalPages,
                        "href": `${process.env.BASE_URL}/?page=${totalPages}&limit=${limit}`
                    },
                    "previous": page > 1 ? {
                        "page": page - 1,
                        "href": `${process.env.BASE_URL}/?page=${page - 1}&limit=${limit}`
                    } : null,
                    "next": page < totalPages ? {
                        "page": page + 1,
                        "href": `${process.env.BASE_URL}/?page=${page + 1}&limit=${limit}`
                    } : null
                }
            }
        }


        res.status(200).json(collection);
    } catch (err) {
        res.status(400).json({err: err.message})
    }
});
router.post('/', async (req, res) => {

    try {


        const {title, description, difficulty, videoUrl, categories} = req.body
        // if (!title || !description || !difficulty || !videoUrl) {
        //     return res.status(400).json({
        //         error: "Alle velden zijn verplicht. Zorg ervoor dat title, description, difficulty, videoUrl en  ingevuld zijn."
        //
        //     });
        // }
        // Informatie over wat de isArray functie
        const formattedCategories = Array.isArray(categories) ? categories : [categories];
        const createExercise = await Exercise.create({
            title: title,
            description: description,
            difficulty: difficulty,
            videoUrl: videoUrl,
            categories: formattedCategories
        })

        res.status(201).json({createExercise})
    } catch (err) {
        res.status(400).json({err: err.message + "Some extra error to check where the me"})
    }
})
router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST','OPTIONS']);
    res.setHeader('Content-Type', 'text/html');
    res.send()
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        // findById moet je geen object meegeven.
        const singleExercise = await Exercise.findById(id).populate('categories', 'name')
        if (!singleExercise) {
            return res.status(404).json({message: "De Exercise Id bestaat niet"});
        }

        res.status(200).json(singleExercise);
    } catch (err) {
        res.status(401).json(err)
    }
});
router.put('/:id', async (req, res) => {
    try {
        console.log('----------------------------')
        // if the request param id is empty or doesnt exist than throw error or return 404 OR if the json body is invalid
        const {id} = req.params;
        const {title, description, difficulty, videoUrl, categories} = req.body
        const formattedCategories = Array.isArray(categories) ? categories : [categories];
        const editExercise = await Exercise.findByIdAndUpdate(id, {
            title: title,
            description: description,
            difficulty: difficulty,
            videoUrl: videoUrl,
            categories: formattedCategories
        }, {
            new: true, runValidators: true
        });
        // in the options parameter if you pass "new" and it is true it will return the modified document rather than the original
        // By default the runvalidators are turned off by the findByIdAndUpdate and other methods. Using the runvalidator options turns it on
        res.status(200).json({editExercise})

    } catch (err) {
        console.log(err)
        res.status(400).json({err: err.message})
    }
});
router.delete('/:id', async (req, res) => {

    try {
        const {id} = req.params;
        const deleteExercise = await Exercise.findByIdAndDelete(id);
        res.status(204).send()
    } catch (err) {
        res.status(404).json({err: err.message})
    }


})
router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
    res.setHeader('Content-Type', 'text/html');

    res.send();
})

export default router