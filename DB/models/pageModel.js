import { Schema, model } from "mongoose";


const pageSchema = new Schema({
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
    customId:String, 
});

const pageModel = model('Page' , pageSchema);
export default pageModel;