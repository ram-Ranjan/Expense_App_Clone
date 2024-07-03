const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const order_model = sequelize.define('orders',{
    payment_id: Sequelize.STRING,
    order_id: Sequelize.STRING,
    status: Sequelize.STRING
},{timestamps: false})

module.exports = order_model