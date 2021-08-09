const SequalizeImg= require('sequelize');
// const dbImage = require('../config/database');
import dbImage from "../config/database";

const ImageModel = dbImage.define('images',{
    image_id :{
        type: SequalizeImg.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    path :{
        type:SequalizeImg.STRING 
    },
    user:{
        type:SequalizeImg.STRING
    },
},
{
    timestamps: false,
    tableName: 'images'
    }
);
export default ImageModel;