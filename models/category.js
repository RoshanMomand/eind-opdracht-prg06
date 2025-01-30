import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
        name: {type: String},

    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: process.env.BASE_URL + `/categories/${ret.id}`
                    },
                    collection: {
                        href: process.env.BASE_URL + `/categories`
                    }
                };
                delete ret._id;
                delete ret.__v;
            }
        }
    }
)
const Category = mongoose.model("Category", categoriesSchema);
export default Category;