const Sequalize = require('sequelize');

const sequalize =  new Sequalize('whiteboard','type','password',{
  host:'localhost',
  dialect:'postgres',
  operatorsAliases:'false',
  pool:{
    max:5,
    min:4,
    acure:30000,
    idle:10000
  }
});
export default sequalize;