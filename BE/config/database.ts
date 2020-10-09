const Sequalize = require('sequelize');

module.exports = new Sequalize('whiteboard','postgres','lazy',{
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
