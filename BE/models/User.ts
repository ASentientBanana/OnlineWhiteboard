const SequalizUser = require('sequelize');
const userDB = require('../config/database');


const UserModel = userDB.define('user',{

    user_name:{
        type:SequalizUser.STRING 
    },
},
{
    timestamps: false,
    tableName: 'users'
}
);
module.exports = UserModel; 