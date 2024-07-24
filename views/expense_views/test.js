let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses(currentPage);

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchExpenses(currentPage);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentPage++;
        fetchExpenses(currentPage);
    });
});

function fetchExpenses(page) {
    fetch(`http://localhost:3000/get-expenses-test?page=${page}`)
        .then(response => response.json())
        .then(data => {
            displayExpenses(data.data);
            updatePagination(data.totalPages, data.currentPage);
        })
        .catch(error => console.error('Error fetching expenses:', error));
}

function displayExpenses(expenses) {
    const tbody = document.querySelector('#expense-table tbody');
    tbody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.description}</td>
            <td>${expense.expense_cost}</td>
            <td>${expense.created_at}</td>
        `;
        tbody.appendChild(row);
    });
}

function updatePagination(totalPages, currentPage) {
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prev-btn').classList.toggle('disabled', currentPage === 1);
    document.getElementById('next-btn').classList.toggle('disabled', currentPage === totalPages);
}
