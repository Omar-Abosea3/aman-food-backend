import { Router } from "express";
import * as page from './PageAndControl.controller.js'
import multerFunction from "../../services/multerCloudinary.js";
import allowedEstensions from "../../utils/allowedExtensions.js";
const router = Router();

router.post('/' , multerFunction(allowedEstensions.Images).array('slider' , 5) , page.createHomePageSlider);
router.patch('/:id' , multerFunction(allowedEstensions.Images).array('slider' , 5) , page.updateProductpdateHomePageSlider);
router.get('/' , page.getHomeSlider);


export default router;