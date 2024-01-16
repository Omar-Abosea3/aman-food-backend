import cors from 'cors';
import DBConnection from '../DB/connection.js';
import categoryRouter from './modules/productCategory/category.router.js';
import { glopalErrorHandelling } from './utils/errorHandlig.js';
import productRouter from './modules/products/product.router.js';
import pageRouter from './modules/PageAndControl/PageAndControl.router.js';
import sendEmail from './utils/email.js';
const bootstrap = (app , express) => {
    app.use(express.json());
    app.use(cors());
    app.use('/category' , categoryRouter);
    app.use('/products' , productRouter);
    app.use('/page' , pageRouter);
    app.post('/sendemail' , async (req , res , next) => {
        const {email  , text} = req.body;
        await sendEmail({subject:email , text});
        return res.json({message:'message sent success'});
    });
    DBConnection();
    app.use(glopalErrorHandelling);
}

export default bootstrap ;