import { Schema, model } from "mongoose";


const productSchema = new Schema({
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        slug:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        images:[
            {
                secure_url:{
                    type:String,
                    required:true
                },
                public_id:{
                    type:String,
                    required:true
                }
            }
        ],
        description:{
            type : String,
            lowercase:true,
        },
        customId:String,
        categoryId:{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:true
        }

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


const productModel = model('Product' , productSchema);
export default productModel;