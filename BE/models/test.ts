const seqTst= require('sequelize');
const dbtst = require('../config/database');


const testModel = dbtst.define('test',{

    name:{
        type:seqTst.STRING
    }
},
{
    timestamps: false,
    tableName: 'users'
    }
);
module.exports = testModel; 