//importing controllers
const { get_expense, add_expense, delete_expense } = require("../controllers/expense_controller")

module.exports = function(app){
    app.get('/expense/get-expense',get_expense),
    app.post('/expense/add-expense',add_expense),
    app.delete('/expense/delete-expense/:id',delete_expense)
}