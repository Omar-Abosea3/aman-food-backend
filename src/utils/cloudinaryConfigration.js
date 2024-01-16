import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  api_key: process.env.CLOUDINARYapi_key || "732672237124891", 
  api_secret: process.env.CLOUDINARYapi_secret || "nLgFfFd4wsy4EgHuYFNK-qI-xms" ,
  cloud_name: process.env.CLOUDINARYcloud_name || "dsmn9rpvm", 
});

export default cloudinary;