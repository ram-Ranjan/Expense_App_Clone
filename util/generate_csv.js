const fs = require('fs')

function generate_csv(expenses,filePath){
    const header = 'Date,Category,Description,Expense\n'
    const rows = expenses.map(expense => 
        `${expense.created_at},${expense.category},${expense.description},${expense.expense_cost}`
    ).join('\n')
    
    save_csv(filePath, header + rows)
}

function save_csv(filePath,csv_file){
    try{
        fs.writeFile(filePath, csv_file, 'utf8', (err)=>{
            if (err) {
                throw new Error({error: err})
            } else {
                console.log('CSV file has been saved');
            }
        })
    }catch(err){
        console.error('Error writing file:', err);
    }
}

module.exports = generate_csv