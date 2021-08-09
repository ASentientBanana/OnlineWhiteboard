const SequalizUser = require('sequelize');
import userDB from '../config/database'
// const userDB = require('../config/database');


const UserModel = userDB.define('user',{
    name:{
        type:SequalizUser.STRING 
    },
},
{
    timestamps: false,
    tableName: 'users'
}
);
export default UserModel;