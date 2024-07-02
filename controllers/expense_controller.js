const expense_model = require('../models/expense_model')

function get_expense(req,res){
    expense_model.findAll()
    .then(db_res=>{
        res.status(200).send(db_res)
    }).catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error:err}))
    })
}

function add_expense(req,res){
    expense_model.create(req.body)
    .then(db_res=>{
        res.status(201).send(db_res)
    }).catch(err=>{
        res.status(500).send({error: err})
    })
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