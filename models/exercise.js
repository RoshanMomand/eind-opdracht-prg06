import mongoose from "mongoose";


const exerciseSchema = new mongoose.Schema({
        title: {type: String, required: true},
        description: {type: String, required: true},
        difficulty: {type: String, required: true},
        videoUrl: {type:String,required:true},
        categories: [{type: mongoose.Types.ObjectId, ref: "Category"}],
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: process.env.BASE_URL + `/exercises/${ret.id}`
                    },
                    collection: {
                        href: process.env.BASE_URL + `/exercises`
                    }
                };
                delete ret._id;
                delete ret.__v;
            }
        }
    })

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise