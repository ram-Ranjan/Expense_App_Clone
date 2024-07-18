const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const expense_model = sequelize.define('expenses',{
    expense_cost:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false
    },
    created_at:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{timestamps: false})

module.exports = expense_model