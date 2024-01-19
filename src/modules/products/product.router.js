import { Router } from "express";
import multerFunction from "../../services/multerCloudinary.js";
import allowedEstensions from "../../utils/allowedExtensions.js";
import * as products from './products.controller.js'
const router = Router();

router.post('/' , multerFunction(allowedEstensions.Images).array('image' , 3) ,products.addProducts);
router.put('/' , multerFunction(allowedEstensions.Images).array('image' , 3) ,products.updateProduct);
router.get('/',products.getAllProducts);
router.delete('/:id',products.deleteProduct);

export default router;