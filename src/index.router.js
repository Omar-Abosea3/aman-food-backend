import cors from 'cors';
import DBConnection from '../DB/connection.js';
import categoryRouter from './modules/productCategory/category.router.js';
import { asyncHandeller, glopalErrorHandelling } from './utils/errorHandlig.js';
import productRouter from './modules/products/product.router.js';
import pageRouter from './modules/PageAndControl/PageAndControl.router.js';
import sendEmail from './utils/email.js';
import  jwt  from 'jsonwebtoken';
const bootstrap = (app , express) => {
    app.use(express.json());
    app.use(cors());
    app.use('/category' , categoryRouter);
    app.use('/products' , productRouter);
    app.use('/page' , pageRouter);
    app.post('/sendemail' , asyncHandeller(async (req , res , next) => {
        const {email  , text} = req.body;
        await sendEmail({subject:email , text});
        return res.json({message:'message sent success'});
    }));
    app.post('/auth' , asyncHandeller(async (req , res , next) => {
        const {email , password} = req.body;
        if(email !== process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD){
            return next(
                new Error('you are not admin of this page' , {cause:401})
            )
        }
        const decoded = jwt.sign({email:email} , process.env.secretKey);
        return res.json({message:'success' , token:decoded});
    }))
    DBConnection();
    app.use(glopalErrorHandelling);
}

export default bootstrap ;