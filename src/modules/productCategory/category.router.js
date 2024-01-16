import { Router } from "express";
import * as categories from './productCategory.controller.js';
import multerFunction from "../../services/multerCloudinary.js";
import allowedEstensions from "../../utils/allowedExtensions.js";
const router = Router();

router.get('/' , categories.getAllCategories);
router.post('/' , multerFunction(allowedEstensions.Images).single('image') ,categories.addCategory);
router.put('/:categoryId' , multerFunction(allowedEstensions.Images).single('image') , categories.updateCategory);
router.get('/:id'  , categories.getOneCategory);


export default router;