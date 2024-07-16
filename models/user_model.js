const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const user_model = sequelize.define('users',{
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    is_premium:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},{timestamps: false})

module.exports = user_model