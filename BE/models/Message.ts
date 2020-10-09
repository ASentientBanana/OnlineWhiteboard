const SequalizeMsg = require('sequelize');
const database = require('../config/database');


const Message = database.define('message',{
    id: {
        type: SequalizeMsg.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    body:{
        type:SequalizeMsg.STRING 
    },
    user_name:{
        type:SequalizeMsg.STRING 
    }
},
{
    timestamps: false,
    tableName: 'messages'
    }
);
module.exports = Message; 