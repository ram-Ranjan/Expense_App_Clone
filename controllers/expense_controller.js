const expense_model = require('../models/expense_model')
const user_model = require('../models/user_model')
const Sequelize = require('sequelize')
const sequelize = require('../util/database')
const { verify_jwt_token } = require('../util/jwt')
const get_date_time = require('../util/date_time_now')

function get_expense(req,res){
    let userId = verify_jwt_token(req.headers.authorization)
    expense_model.findAll({where:{
        userId: userId
    }})
    .then(db_res=>{
        res.status(200).send(db_res)
    }).catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error:err}))
    })
}

async function add_expense(req,res){
    let expense
    req.body.userId = verify_jwt_token(req.body.userId)
    let date_time = get_date_time()
    let data_to_insert = {
        expense_cost: req.body.expense_cost,
        description: req.body.description,
        category: req.body.category,
        created_at: date_time,
        userId: req.body.userId
    }
    try {
        // Start a transaction
        await sequelize.transaction(async (t) => {
            // Create the new expense
            expense = await expense_model.create(data_to_insert,{ transaction: t })

            // Update the user's total expenses
            await user_model.update(
                { total_expenses: Sequelize.literal(`total_expenses + ${req.body.expense_cost}`)},
                { where: { id: req.body.userId }, transaction: t }
            )
        })
        //console.log('Expense added successfully');
        res.status(200).send(expense)
    }
    catch(err){
        res.status(500).send(JSON.stringify({error:err}))
    }
}

async function delete_expense(req,res){
    let expense_id = req.params.id
    let userId = verify_jwt_token(req.headers.authorization)
    try{
        await sequelize.transaction(async (t) => {
            //update expense table
            let expense = await expense_model.findByPk(expense_id)

            //update user table
            await user_model.update(
                { total_expenses: Sequelize.literal(`total_expenses - ${expense.dataValues.expense_cost}`)},
                { where: { id: userId }, transaction: t }
            )
            expense.destroy()
            res.status(204).send()
        })
    }catch(err){
        res.status(500).json({ error: err })
    }
}

module.exports = {get_expense, add_expense, delete_expense}