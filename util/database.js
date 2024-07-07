const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('expense_db','root',process.env.db_password,{
    host:'localhost',
    dialect:'mysql'
})

module.exports = sequelize