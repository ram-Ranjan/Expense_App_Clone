//importing controllers
const { get_expense, add_expense, delete_expense, 
    get_chart, download_csv } = require("../controllers/expense_controller")
const expense_model = require('../models/expense_model')
module.exports = function(app){
    app.get('/expense/get-expense', get_expense),
    app.post('/expense/add-expense', add_expense),
    app.delete('/expense/delete-expense/:id', delete_expense),
    app.get('/expense/get-chart', get_chart),
    app.post('/expense/download-csv', download_csv),
    app.get('/get-expenses-test', async (req, res) => {
        console.log(req.query)
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
        const limit = 2;  // Number of records per page
        const offset = (page - 1) * limit;
    
        try {
            const expenses = await expense_model.findAndCountAll({
                limit: limit,
                offset: offset
            });
            res.json({
                totalRecords: expenses.count,
                totalPages: Math.ceil(expenses.count / limit),
                currentPage: page,
                data: expenses.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
}