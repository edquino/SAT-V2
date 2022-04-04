const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres://postgres:PDDHbase2021$@localhost:5432/SAT')

sequelize

.authenticate()

.then(() => {

console.log('Connection has been established successfully.');

})

.catch(err => {

console.error('Unable to connect to the database:', err);

});

module.exports = sequelize;