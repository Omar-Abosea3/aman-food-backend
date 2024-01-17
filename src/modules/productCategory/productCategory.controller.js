import { asyncHandeller } from "../../utils/errorHandlig.js";
import categoryModel from '../../../DB/models/categoryModel.js';
import slugify from "slugify";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import { nanoid } from "nanoid";
import translate from "translate";


export const addCategory = asyncHandeller(async(req , res , next) => {
    const {name} = req.body;
    const slug = slugify(name);
    console.log('hello');
    if(!name){
        return next(
            new Error("please enter the category name", { cause: 400 })
        );
    }

    if(await categoryModel.findOne({name})){
        return next(
            new Error('this category is already exist' , {cause:409})
        )
    }

    if (!req.file) {
        return next(
          new Error("please upload the category image", { cause: 400 })
        );
    }
    console.log('hello');
      const customId = nanoid() + slug;
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`,
        }
      );
      console.log('hello');
      req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${customId}`;
  
      const categoryObject = {
        name,
        slug,
        image: {
          secure_url,
          public_id,
        },
        customId,
      };
      console.log('reached');
      const category = await categoryModel.create(categoryObject);
        if (!category) {
            await cloudinary.uploader.destroy(public_id);
            return next(
                new Error("try again later , fail to add your category", { cause: 400 })
            );
        }
      return res.status(200).json({message:'success' , category});
});

export const updateCategory = asyncHandeller(async (req, res, next) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return next( 
        new Error("invalid category id or this category not found", {
          cause: 404,
        })
      );
    }
    if (name) {
      if (category.name == name) {
        return next(
          new Error("please enter different name for this category", {
            cause: 400,
          })
        );
      }
      if (await categoryModel.findOne({ name })) {
        return next(
          new Error(
            "please enter a different category name , it is dublicated name",
            { cause: 409 }
          )
        );
      }
      category.name = name;
      category.slug = slugify(name);
    }

    if (req.file) {
      await cloudinary.uploader.destroy(category.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
        }
      );
      category.image = { secure_url, public_id };
    }
    await category.save();
    return res.status(200).json({ message: "updated done", category });
});

export const getAllCategories = asyncHandeller(async (req , res , next) => {
    const {lang} = req.query;
    const ctegories = await categoryModel.find();
    if(ctegories.length == 0){
        return next(new Error('not found categories' , {cause:404}));
    }
    if(lang){
      const dataAfterTranslate=[];
      for (const category of ctegories) {
        const _id = category._id;
        let name;
        if(await translate(category.name , lang) == 'بلح'){
          name = 'تمور'
        }else{
          name = await translate(category.name , lang);
        }
        const slug = await translate(category.slug , lang);
        const image = category.image;
        const customId = category.customId;
        dataAfterTranslate.push({_id , name , slug , customId , image});
      }
      
      return res.status(200).json({message:'success', ctegories:dataAfterTranslate});
    }
    return res.status(200).json({message:'success' , ctegories});
});

export const getOneCategory = asyncHandeller(async(req , res , next) => {
    const {id} = req.params;
    const {lang} = req.query;
    const category = await categoryModel.findById(id).populate([
        {
            path:'Products',
        }
    ]);

    if(!category){
        return next(
            new Error('this category is not found' , {cause:404})
        )
    }

    if(lang){
      const dataAfterTranslate={};
      const Products = [];
        dataAfterTranslate._id = category._id;
        dataAfterTranslate.name = await translate(category.name , lang);
        dataAfterTranslate.slug = await translate(category.slug , lang);
        dataAfterTranslate.image = category.image;
        dataAfterTranslate.customId = category.customId;
        if(category.Products.length){
          for (const product of category.Products) {
            const _id = product._id;
            const name = await translate(product.name , lang);
            const description = await translate(product.description , lang);
            const slug = await translate(product.slug , lang);
            const images = product.images;
            const customId = product.customId;
            const categoryId = product.categoryId;
            Products.push({_id , name , slug , description , customId , images , categoryId});
          }
          dataAfterTranslate.Products = Products;
        }
        if(dataAfterTranslate.name == 'بلح'){
          dataAfterTranslate.name= 'تمور';
        }
      return res.status(200).json({message:'success', category:dataAfterTranslate});
    }

    return res.status(200).json({message:'success' , category});
});

