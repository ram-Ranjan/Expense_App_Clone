const user_model = require('../models/user_model')
const order_model = require('../models/order_model')
const sequelize = require('../util/database')
const Razorpay = require('razorpay')
require('dotenv').config()

async function get_leaderboard_service(){
    try{
        const results = await user_model.findAll({
            attributes: [
                'username',
                'total_expenses'
            ],
            order: [['total_expenses', 'DESC']],
            raw: true
        })
        return results
    }catch(err){
        console.error(err)
        return {error: err}
    }
}

async function upgrade_to_premium_service(userId){
    const amount = 19900//it will consider it as 199.00

    try{
        let razor = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })

        let order = await razor.orders.create({amount, currency: "INR"})
        
        let db_res = await order_model.create({
            order_id: order.id,
            status: "PENDING",
            userId: userId
        })
        
        return {order, key_id: razor.key_id}
    }catch(err){
        console.log(err)
        return {error: err}
    }
}

async function check_premium_service(userId){
    try{
        let db_res = await user_model.findOne({where:{
            id: userId
        }})

        return {
            username: db_res.dataValues.username,
            is_premium: db_res.dataValues.is_premium
        }
    }catch(err){
        console.log(err)
        return {error: err}
    }
}

async function update_tsc_status_service(userId, payment_id, order_id){
    try{
        // Start a transaction
        await sequelize.transaction(async (t) => {
            //update user table
            await user_model.update(
                {is_premium: true},
                {where: {id: userId}, transaction: t}
            )
            //update order table
            await order_model.update(
                {payment_id: payment_id, status: "SUCCESSFUL"},
                {where: {order_id: order_id}, transaction: t}
            )
        })
        return {message:"User Upgraded To Premium"}
        
    }catch(err){
        console.log(err)
        return {error: err}
    }
}

module.exports = {
    get_leaderboard_service, upgrade_to_premium_service,
    check_premium_service, update_tsc_status_service
}