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
    
    const expense_div = document.getElementById('expense_div')
    const expensList = expense_div.querySelector('ul')
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

function buy_premium(event){
    fetch('http://localhost:3000/user/purchase-premium',{
        method: 'GET',
        contentType: 'application/json',
        headers: {'Authorization': localStorage.getItem('token')}
    }).then(response=>{
        if(response.status==201){
            return response.json()
        }
    }).then(response=>{
        let options = {
            'key': response.key_id,
            'order_id': response.order.id,
            'handler': function(response){
                axios.post('http://localhost:3000/user/update-transaction-status',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                },{headers: {'Authorization': localStorage.getItem('token')}
                })
                .then(result=>{
                    //console.log(result,'now premium')
                    alert("You are now a Premium User")
                    let premium_btn = document.getElementById('premium_btn')
                    premium_btn.remove()
                }).catch(err=>{
                    console.log(err)
                })
            }
        }

        let razor = new Razorpay(options)
        
        razor.open()
        event.preventDefault()
        razor.on('payment.failed',function(response){
            console.log("r",response)
        })
    })
    .catch(err=>{
        console.log(err)
    })
}

function show_leaderboard(event){
    event.preventDefault()
    let leaderboard_div = document.getElementById('leaderboard_div')
    let leaderboard_h = document.createElement('h4')
    leaderboard_h.innerHTML = 'Leaderboard'
    leaderboard_div.prepend(leaderboard_h)
    let leaderboard_btn = document.getElementById('leaderboard_btn')
    leaderboard_btn.remove()

    axios.get('http://localhost:3000/premium/leaderboard')
    .then(response=>{
        for(let user_expense of response.data){
            let list_item = document.createElement('li')
            list_item.innerHTML = 'Name: '+user_expense.username+', Total Expenses: '+user_expense.total
            let leaderboard_list = leaderboard_div.querySelector('ul')
            leaderboard_list.appendChild(list_item)
        }
    }).catch(err=>{
        console.log(err)
    })
}
