function handle_submit(event){
    event.preventDefault()
    
    const expense_details={
        expense_cost: event.target.expense_cost.value,
        description: event.target.description.value,
        category: event.target.category.value,
        userId: localStorage.getItem('token')
    }

    fetch('http://localhost:3000/expense/add-expense',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(expense_details),
    }).then((response) => {
        if(response.ok){
            return response.json()
        }else{
            throw new Error('Error submitting the form')
        }
    })
    .then((result) => display_expense(result))
    .catch((err) => console.log(err))
    
    // Clearing the input fields
    document.getElementById('expense_cost').value = ''
    document.getElementById('description').value = ''
    document.getElementById('category').value = ''
    }
    
function display_expense(expense_details) {
    const expenseItem = document.createElement('li')
    expenseItem.appendChild(
        document.createTextNode(
            `${expense_details.expense_cost} - ${expense_details.description} - ${expense_details.category}`
        )
    )
    //adding delete button
    const deleteBtn = document.createElement("button")
    deleteBtn.appendChild(document.createTextNode("Delete"))
    expenseItem.appendChild(deleteBtn)        
    
    const expensList = document.querySelector('ul')
    expensList.appendChild(expenseItem)
    deleteBtn.addEventListener('click', function (event) {
        fetch(`http://localhost:3000/expense/delete-expense/${expense_details.id}`, {
            method: 'DELETE',
        })
        .then(() => {
            expensList.removeChild(event.target.parentElement);
        })
        .catch((error) => console.log(error));
    })
}

