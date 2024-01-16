import { Schema, model } from "mongoose";


const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        secure_url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    },
    customId:String,

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

categorySchema.virtual('Products',{
    ref:"Product",
    localField:"_id",
    foreignField : 'categoryId',
});

const categoryModel = model('Category' , categorySchema);
export default categoryModel;
