async function setBudget() {
    const budget = document.getElementById('budget').value;
    
    if (!budget || isNaN(parseFloat(budget))) {
        alert('Please enter a valid budget amount');
        return;
    }

    localStorage.setItem('budget', parseFloat(budget));
    initializeUserData();
    displayBudgetStatus();
    displayTransactions();
}

function initializeUserData() {
    const user = JSON.parse(localStorage.getItem('user')) || { transactions: [] };
    localStorage.setItem('user', JSON.stringify(user));
}

function addTransaction() {
    const transactionType = document.getElementById('transactionType').value;
    const amount = document.getElementById('amount').value;
    const remark = document.getElementById('remark').value;
    const timestamp = new Date().toLocaleString();

    if (!amount || isNaN(parseFloat(amount))) {
        alert('Please enter a valid amount');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || { transactions: [] };

    const transaction = {
        type: transactionType,
        amount: parseFloat(amount),
        remark,
        timestamp,
    };

    user.transactions.push(transaction);
    localStorage.setItem('user', JSON.stringify(user));

    displayTransactions();
    displayBudgetStatus();
}

function displayTransactions() {
    const user = JSON.parse(localStorage.getItem('user'));
    const transactionList = document.getElementById('transactionList');

    if (!user || !user.transactions || user.transactions.length === 0) {
        transactionList.innerHTML = '<li>No transactions yet</li>';
        return;
    }

    const budget = parseFloat(localStorage.getItem('budget')) || 0;
    const totalExpenses = user.transactions.reduce((total, transaction) => {
        return transaction.type === 'expense' ? total + transaction.amount : total;
    }, 0);

    const remainingBudget = budget - totalExpenses;

    const transactionsHTML = user.transactions.map(transaction => {
        const transactionClass = transaction.type === 'expense' ? 'expense' : 'income';
        const isWarning = (transaction.type === 'expense' && remainingBudget < 0) ? 'warning' : '';
        return `<li class="${transactionClass} ${isWarning}"> ₹${transaction.amount.toFixed(2)} : ${transaction.remark} <br> (${transaction.timestamp})</li>`;
    }).join('');

    if (remainingBudget < 0) {
        transactionList.innerHTML = `<li class="warning">Insufficient Budget! You have exceeded your budget by ₹${Math.abs(remainingBudget).toFixed(2)}</li>` + transactionsHTML;
    } else {
        transactionList.innerHTML = transactionsHTML;
    }
}

function displayBudgetStatus() {
    const budget = localStorage.getItem('budget');
    if (!budget || isNaN(parseFloat(budget))) {
        document.getElementById('budgetStatus').innerHTML = 'Budget not set';
        document.getElementById('budgetStatus').style.color = '#87ea6c'; // Green for positive
        return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || { transactions: [] };

    const totalExpenses = user.transactions.reduce((total, transaction) => {
        return transaction.type === 'expense' ? total + transaction.amount : total;
    }, 0);

    const totalIncome = user.transactions.reduce((total, transaction) => {
        return transaction.type === 'income' ? total + transaction.amount : total;
    }, 0);

    const remainingBudget = parseFloat(budget) + totalIncome - totalExpenses;

    const budgetStatusElement = document.getElementById('budgetStatus');
    budgetStatusElement.innerHTML = `Remaining Budget: ₹${remainingBudget.toFixed(2)}`;
    
    if (remainingBudget >= 0) {
        budgetStatusElement.style.color = '#87ea6c'; // Green for positive
    } else {
        budgetStatusElement.style.color = '#d32f2f'; // Red for negative
    }
}

function resetData() {
    localStorage.removeItem('budget');
    localStorage.removeItem('user');
    displayTransactions();
    displayBudgetStatus();
}

function downloadTransactions() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.transactions || user.transactions.length === 0) {
        alert('No transactions to download');
        return;
    }

    const transactionsCSV = user.transactions.map(transaction => {
        return `${transaction.type},${transaction.amount},${transaction.remark},${transaction.timestamp}`;
    }).join('\n');

    const blob = new Blob([transactionsCSV], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
}

// Initialize user data and display initial state
initializeUserData();
displayTransactions();
displayBudgetStatus();
