import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import bootstrap from './src/index.router.js';
dotenv.config({path:path.resolve('./configs/.env')});
const app = express();
const port = parseInt(process.env.PORT) || 5000;
 
bootstrap(app , express);
app.listen(port , () => {console.log(`running on ...... ${port}`)})