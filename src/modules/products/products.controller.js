import { nanoid } from "nanoid";
import productModel from "../../../DB/models/productsModel.js";
import { asyncHandeller } from "../../utils/errorHandlig.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import categoryModel from "../../../DB/models/categoryModel.js";
import slugify from "slugify";


export const addProducts = asyncHandeller(async(req , res , next) => {
    const {name , categoryId , description} = req.body;
    if(!categoryId || !await categoryModel.findById(categoryId)){
        return next(
            new Error('enter a valid category id' , {cause:400})
        )
    }
    const category = await categoryModel.findById(categoryId);
    if(!name){
        return next(
            new Error('enter the product name' , {cause:400})
        )
    }
    if(await productModel.findOne({name})){
        return next(
            new Error('this product is already exist')
        )
    }
    const slug = slugify(name);

    if(!req.files.length){
        return next(
            new Error('you must enter at least 1 photo for product' , {cause:400})
        )
    }

    const customId = nanoid()+slug;
    const images = [];
    const publicIds = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/Products/${customId}`,
        }
      );
      images.push({ secure_url, public_id });
      publicIds.push(public_id);
    }
    req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/Products/${customId}`;

    const productObject = {
      name,
      slug,
      categoryId,
      images,
      customId,
    };
    if(description){
        productObject.description = description;
    }

    const product = await productModel.create(productObject);
    if (!product) {
      await cloudinary.api.delete_resources(publicIds);
      return next(
        new Error("product not added , try again later", { cause: 400 })
      );
    }

    return res.status(200).json({message:'success' , product});

});

export const updateProduct = asyncHandeller(async (req, res, next) => {
    const { name, description ,categoryId, productId} =req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return next(new Error("not founded product", { cause: 404 }));
    }
    const category = await categoryModel.findById(
      categoryId || product.categoryId
    );
    if (categoryId) {
      if (!category) {
        return next(new Error("not founded category", { cause: 404 }));
      }
      product.categoryId = categoryId;
    }


    if (name) {
      if (await productModel.findOne({ name }) && product.name != name) {
        return next(
          new Error(
            "please enter a different category name , it is dublicated name",
            { cause: 409 }
          )
        );
      }
      product.name = name;
      const slug = slugify(name);
      product.slug = slug;
    }

    if (req.files?.length) {
      const images = [];
      for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/Products/${product.customId}`,
          }
        );
        images.push({ secure_url, public_id });
      }
      const publicIds = [];
      for (const image of product.images) {
        publicIds.push(image.public_id);
      }
      await cloudinary.api.delete_resources(publicIds);
      product.images = images;
    }
    await product.save();
    return res.status(200).json({ message: "updated success", product });
});

export const deleteProduct = asyncHandeller(async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findByIdAndDelete(id).populate([
    {
      path:'categoryId',
    }
  ]);
  if (!product) {
    return next( 
      new Error("invalid product id or this product not found", {
        cause: 404,
      })
    );
  }

  const publicIds = [];
    for (const image of product.images) {
      publicIds.push(image.public_id);
    }
    await cloudinary.api.delete_resources(publicIds);
    await cloudinary.api.delete_folder(
      `${process.env.PROJECT_FOLDER}/Categories/${product.categoryId.customId}/Products/${product.customId}`
    );
  return res.status(200).json({ message: "deleted success", product });
});

export const getAllProducts = asyncHandeller(async(req , res , next) => {
    const products = await productModel.find();
    if(!products.length){
        return next(
            new Error('not founded products' , {cause:404})
        )
    }
    return res.status(200).json({message:'success' , products});
});