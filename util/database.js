const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('expense_db','root',process.env.db_password,{
    host:'localhost',
    dialect:'mysql',
    timezone: '+05:30', // Indian Standard Time (IST)
    dialectOptions: {
        timezone: 'local',
    },
})

module.exports = sequelize