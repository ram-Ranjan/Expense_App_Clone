const user_model = require('../models/user_model')
const order_model = require('../models/order_model')
const expense_model = require('../models/expense_model')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const { generate_jwt_token,verify_jwt_token } = require('../util/jwt')
const Razorpay = require('razorpay')
require('dotenv').config()

function signup(req,res){
    req.body.password = bcrypt.hashSync(req.body.password,8)
    user_model.create(req.body)
    .then(db_res=>{
        res.status(201).send(JSON.stringify({message:"User Registered Successfully"}))
    }).catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error:err}))
    })
}

function login(req,res){
    user_model.findOne({where:{
        email: req.body.email
    }}).then(db_res=>{
        //user found
        if(db_res){
            //checking password
            if(bcrypt.compareSync(req.body.password, db_res.dataValues.password)){
                let token = generate_jwt_token(db_res.dataValues.id)
                res.status(200).send(JSON.stringify({message: "Logged In Successfullly",token:token}))
            }else{
                res.status(401).send(JSON.stringify({error: "Bad Credentials"}))
            }
        }else{
            res.status(404).send(JSON.stringify({error: "User Not Found"}))
        }
    })
}

function upgrade_to_premium(req,res){
    let userId = verify_jwt_token(req.headers.authorization)
    let razor = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret
    })
    const amount = 19900//it will consider it as 199.00

    razor.orders.create({amount,currency: "INR"}, (err, order)=>{
        if(err){
            res.status(500).send(JSON.stringify({error: err}))
        }
        order_model.create({
            order_id: order.id,
            status: "PENDING",
            userId: userId
        }).then(db_res=>{
            res.status(201).send(JSON.stringify({order, key_id: razor.key_id}))
        }).catch(err=>{
            console.log(err)
            res.status(500).send(JSON.stringify({error: err}))
        })
    })
    //res.status(200).send({message: "Upgraded To Premium Successfully"})
}

function update_tsc_status(req,res){
    try{
        user_model.update(
            {is_premium: true},
            {where: {id: verify_jwt_token(req.headers.authorization)}}
        )
        order_model.update(
            {payment_id: req.body.payment_id, status: "SUCCESSFUL"},
            {where: {order_id: req.body.order_id}}
        )
        res.status(200).send(JSON.stringify({message:"User Upgraded To Premium"}))
    }catch(err){
        console.log(err)
        res.status(500).send(JSON.stringify({error: err}))
    }
}

function check_premium(req,res){
    user_model.findOne({where:{
        id: verify_jwt_token(req.headers.authorization)
    }})
    .then(db_res=>{
        res.status(200).send(JSON.stringify({
            username: db_res.dataValues.username,
            is_premium: db_res.dataValues.is_premium
        }))
    })
    .catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error: err}))
    })
}

async function get_leaderboard(req,res){
    try{
        const results = await user_model.findAll({
            attributes: [
                'username',
                [Sequelize.fn('SUM', Sequelize.col('expenses.expense_cost')), 'total']
            ],
            include: [{
                model: expense_model,
                attributes: []
            }],
            group: ['userId'],
            order: [[Sequelize.literal('total'), 'DESC']],
            raw: true
        })
        //console.log(results)
        res.status(200).send(results)
    }catch(err){
        console.error(err)
        res.status(500).send(JSON.stringify({error: err}))
    }
}

module.exports={signup, login, upgrade_to_premium, update_tsc_status, check_premium, get_leaderboard}