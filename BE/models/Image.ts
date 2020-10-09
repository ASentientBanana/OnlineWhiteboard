const SequalizeImg= require('sequelize');
const dbImage = require('../config/database');


const ImageModel = dbImage.define('image',{
    // id: {
    //     type: SequalizeImg.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    //   },
    image:{
        type:SequalizeImg.STRING 
    },
    user_id:{
        type:SequalizeImg.INTEGER
    }
},
{
    timestamps: false,
    tableName: 'images'
    }
);
module.exports = ImageModel; 