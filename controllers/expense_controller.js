const expense_model = require('../models/expense_model')
const user_model = require('../models/user_model')
const Sequelize = require('sequelize')
const sequelize = require('../util/database')
const { verify_jwt_token } = require('../util/jwt')

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
    try {
        // Start a transaction
        await sequelize.transaction(async (t) => {
            // Create the new expense
            expense = await expense_model.create(req.body,{ transaction: t })

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

function delete_expense(req,res){
    let expense_id = req.params.id
    expense_model.findByPk(expense_id)
    .then(expense=>{
        if(expense){
            expense.destroy()
            res.status(204).send()
        }
    }).catch(err=>{
        res.status(500).json({ error: err })
    })
}

module.exports = {get_expense, add_expense, delete_expense}