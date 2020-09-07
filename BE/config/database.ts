const Sequalize = require('sequelize');

module.exports = new Sequalize('whiteboardDB','postgres','lazy',{
  host:'192.168.0.201',
  // port:9465,
  dialect:'postgres',
  operatorsAliases:'false',
  pool:{
    max:5,
    min:4,
    acure:30000,
    idle:10000
  }
});
