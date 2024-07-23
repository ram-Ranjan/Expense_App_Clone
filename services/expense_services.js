const expense_model = require('../models/expense_model')
const user_model = require('../models/user_model')
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

async function get_expense_service(userId){
    try{
        let db_res = await expense_model.findAll({where:{
            userId: userId
        }})
        return db_res
    }catch(err){
        console.log(err)
        return {'error': err}
    }
}

async function add_expense_service(data_to_insert){
    let expense
    try {
        // Start a transaction
        await sequelize.transaction(async (t) => {
            // Create the new expense
            expense = await expense_model.create(data_to_insert,{ transaction: t })

            // Update the user's total expenses
            await user_model.update(
                { total_expenses: Sequelize.literal(`total_expenses + ${data_to_insert.expense_cost}`)},
                { where: { id: data_to_insert.userId }, transaction: t }
            )
        })
        //console.log('Expense added successfully');
        return expense
    }
    catch(err){
        console.log(err)
        return {'error': err}
    }
}

async function delete_expense_service(expense_id,userId){
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
        })
        return {'message': 'Expense Deleted Successfully'}
    }catch(err){
        return {'error': err}
    }
}

module.exports = {
                get_expense_service, 
                add_expense_service,
                delete_expense_service
            }