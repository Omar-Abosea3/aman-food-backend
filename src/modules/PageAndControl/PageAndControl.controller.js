import { nanoid } from "nanoid";
import { asyncHandeller } from "../../utils/errorHandlig.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import pageModel from "../../../DB/models/pageModel.js";


export const createHomePageSlider = asyncHandeller(async(req , res , next) => {
    if(!req.files.length){
        return next(
            new Error('you must add a photos for sliders' , {cause:400})
        )
    };

    const customId = nanoid();
    const images = [];
    const publicIds = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/slider/${customId}`,
        }
      );
      images.push({ secure_url, public_id });
      publicIds.push(public_id);
    }
    req.imagePath = `${process.env.PROJECT_FOLDER}/slider/${customId}`;

    const slider = await pageModel.create({images , customId});
    if(!slider){
        await cloudinary.api.delete_resources(publicIds);
        return next(
            new Error("slider not added , try again later", { cause: 400 })
        );
    }
    console.log(req.files);
    return res.status(200).json({message:'success' , slider});
});

export const updateProductpdateHomePageSlider = asyncHandeller(async(req , res , next) => {
    const {id} = req.params;
    const slider = await pageModel.findById(id);
    if(!slider){
        return next(
            new Error("this slider not found" , {cause:404})
        )
    };
    if(!req.files.length){
        return next(
            new Error('you must add a photos for sliders' , {cause:400})
        )
    };

    const images = [];
    const publicIds = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/slider/${slider.customId}`,
        }
      );
      images.push({secure_url, public_id});
    }
    req.imagePath = `${process.env.PROJECT_FOLDER}/slider/${slider.customId}`;
    for (const image of slider.images) {
        publicIds.push(image.public_id);
    }
    await cloudinary.api.delete_resources(publicIds);
    slider.images = images;
    

    await slider.save();
    return res.status(200).json({message:'updated success' , slider});
});

export const getHomeSlider = asyncHandeller(async(req , res , next) => {
    const sliders = await pageModel.find();
    if(!sliders.length){
      return next(
        new Error("slider is empty" , {cause:404})
      )
    }

    return res.status(200).json({message:'success' , sliders});
});