import mongoose from "mongoose";
const blogsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    review: {type: String, required: true},
    author: {type: String, required: true},
    categories: [{type: String}],
    // publish_date: {type: Date, default: Date.now},
    // image: {type: String},
},
{
    toJSON: {
        virtuals: true,
            versionKey: false,
        transform: (doc, ret) => {
            ret._links = {
                self: {
                    href: process.env.BASE_URL + `/blogs/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL + `/blogs`
                }
            };
            delete ret._id;
            delete ret.__v;
        }
    }
})

const Blog = mongoose.model('Blog',blogsSchema);
export default Blog