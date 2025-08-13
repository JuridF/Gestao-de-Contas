// Initial Data
let gastosData = [
    {"id": 1, "descricao": "Cartão Nubank", "valor": 2850.00, "dataVencimento": "2025-08-15", "categoria": "cartao", "status": "pendente"},
    {"id": 2, "descricao": "Conta de Luz ENERGISA", "valor": 320.50, "dataVencimento": "2025-08-12", "categoria": "conta-fixa", "status": "pendente"},
    {"id": 3, "descricao": "Internet Vivo Fibra", "valor": 129.90, "dataVencimento": "2025-08-13", "categoria": "conta-fixa", "status": "pendente"},
    {"id": 4, "descricao": "IPVA 2025", "valor": 1850.00, "dataVencimento": "2025-08-20", "categoria": "imposto", "status": "pendente"},
    {"id": 5, "descricao": "Financiamento Casa", "valor": 2200.00, "dataVencimento": "2025-08-18", "categoria": "parcelamento", "status": "pendente"},
    {"id": 6, "descricao": "Plano de Saúde", "valor": 680.00, "dataVencimento": "2025-08-25", "categoria": "conta-fixa", "status": "pendente"},
    {"id": 7, "descricao": "iPhone 15 Pro - 12/24", "valor": 289.90, "dataVencimento": "2025-08-14", "categoria": "parcelamento", "status": "pendente"},
    {"id": 8, "descricao": "Seguro Veículo", "valor": 145.80, "dataVencimento": "2025-08-30", "categoria": "outros", "status": "pendente"},
    {"id": 9, "descricao": "Conta de Água", "valor": 78.50, "dataVencimento": "2025-09-05", "categoria": "conta-fixa", "status": "pendente"},
    {"id": 10, "descricao": "IPTU 2025 - 2ª parcela", "valor": 590.00, "dataVencimento": "2025-09-10", "categoria": "imposto", "status": "pendente"},
    {"id": 11, "descricao": "Curso Online", "valor": 197.00, "dataVencimento": "2025-08-22", "categoria": "parcelamento", "status": "pendente"},
    {"id": 12, "descricao": "Cartão Santander", "valor": 1250.75, "dataVencimento": "2025-09-08", "categoria": "cartao", "status": "pendente"},
    {"id": 13, "descricao": "Condomínio", "valor": 450.00, "dataVencimento": "2025-08-10", "categoria": "conta-fixa", "status": "atrasado"},
    {"id": 14, "descricao": "Netflix", "valor": 55.90, "dataVencimento": "2025-08-16", "categoria": "outros", "status": "pendente"},
    {"id": 15, "descricao": "Spotify", "valor": 34.90, "dataVencimento": "2025-08-28", "categoria": "outros", "status": "pendente"}
];

let categorias = [
    {"id": "cartao", "nome": "Cartão de Crédito", "cor": "#e74c3c"},
    {"id": "conta-fixa", "nome": "Conta Fixa", "cor": "#3498db"},
    {"id": "parcelamento", "nome": "Parcelamento", "cor": "#f39c12"},
    {"id": "imposto", "nome": "Imposto", "cor": "#9b59b6"},
    {"id": "outros", "nome": "Outros", "cor": "#1abc9c"}
];

// Global variables
let currentEditingExpense = null;
let categoryChart = null;
let monthChart = null;
let statusChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initializeTheme();
    initializeEventListeners();
    initializeSidebar();
    updateDashboard();
    renderExpenseTable();
    updateFileCounter();
    populateSelectors();
});

// Data Management
function saveDataToStorage() {
    localStorage.setItem('gastosData', JSON.stringify(gastosData));
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

function loadDataFromStorage() {
    const savedGastos = localStorage.getItem('gastosData');
    const savedCategorias = localStorage.getItem('categorias');
    
    if (savedGastos) {
        gastosData = JSON.parse(savedGastos);
    }
    
    if (savedCategorias) {
        categorias = JSON.parse(savedCategorias);
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    document.getElementById('themeSelect').value = savedTheme;
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.querySelector('#themeToggle i');
    
    html.removeAttribute('data-color-scheme');
    
    if (theme === 'dark') {
        html.setAttribute('data-color-scheme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else if (theme === 'light') {
        html.setAttribute('data-color-scheme', 'light');
        themeIcon.className = 'fas fa-moon';
    } else {
        // Auto theme
        themeIcon.className = 'fas fa-adjust';
    }
    
    localStorage.setItem('theme', theme);
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('themeSelect').addEventListener('change', function(e) {
        applyTheme(e.target.value);
    });
    
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Modal
    document.getElementById('addExpenseBtn').addEventListener('click', openAddExpenseModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Upload
    document.getElementById('uploadZone').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Settings
    document.getElementById('addCategoryBtn').addEventListener('click', addNewCategory);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', importData);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    
    // Drag and drop
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('drop', handleDrop);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'auto';
    let newTheme;
    
    if (currentTheme === 'auto') {
        newTheme = 'light';
    } else if (currentTheme === 'light') {
        newTheme = 'dark';
    } else {
        newTheme = 'auto';
    }
    
    document.getElementById('themeSelect').value = newTheme;
    applyTheme(newTheme);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar--open');
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('sidebar__link--active'));
            this.classList.add('sidebar__link--active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('sidebar--open');
            }
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('section--active'));
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('section--active');
        
        // Initialize section-specific content
        if (sectionName === 'reports') {
            initializeReports();
        } else if (sectionName === 'settings') {
            initializeSettings();
        }
    }
}

// Dashboard Functions
function updateDashboard() {
    updateMetrics();
    updateCharts();
}

function updateMetrics() {
    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let overdueAmount = 0;
    let pendingAmount = 0;
    let totalAmount = 0;
    let weekAmount = 0;
    
    gastosData.forEach(gasto => {
        const dueDate = new Date(gasto.dataVencimento);
        
        totalAmount += gasto.valor;
        
        if (gasto.status === 'atrasado') {
            overdueAmount += gasto.valor;
        } else if (gasto.status === 'pendente') {
            pendingAmount += gasto.valor;
            
            // Check if due this week
            if (dueDate <= oneWeekFromNow && dueDate >= today) {
                weekAmount += gasto.valor;
            }
        }
    });
    
    document.getElementById('overdueAmount').textContent = formatCurrency(overdueAmount);
    document.getElementById('pendingAmount').textContent = formatCurrency(pendingAmount);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('weekAmount').textContent = formatCurrency(weekAmount);
}

function updateCharts() {
    updateCategoryChart();
    updateMonthChart();
}

function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const categoryTotals = {};
    categorias.forEach(cat => {
        categoryTotals[cat.id] = 0;
    });
    
    gastosData.forEach(gasto => {
        if (categoryTotals.hasOwnProperty(gasto.categoria)) {
            categoryTotals[gasto.categoria] += gasto.valor;
        }
    });
    
    const labels = [];
    const data = [];
    const colors = [];
    
    categorias.forEach(cat => {
        if (categoryTotals[cat.id] > 0) {
            labels.push(cat.nome);
            data.push(categoryTotals[cat.id]);
            colors.push(cat.cor);
        }
    });
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = formatCurrency(context.raw);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateMonthChart() {
    const ctx = document.getElementById('monthChart').getContext('2d');
    
    if (monthChart) {
        monthChart.destroy();
    }
    
    const monthTotals = {};
    
    gastosData.forEach(gasto => {
        const date = new Date(gasto.dataVencimento);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthTotals[monthKey]) {
            monthTotals[monthKey] = 0;
        }
        monthTotals[monthKey] += gasto.valor;
    });
    
    const sortedMonths = Object.keys(monthTotals).sort();
    const labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1);
        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    });
    const data = sortedMonths.map(month => monthTotals[month]);
    
    monthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos',
                data: data,
                backgroundColor: '#1FB8CD',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Table Functions
function renderExpenseTable() {
    const tableBody = document.getElementById('expenseTableBody');
    const filteredData = getFilteredExpenses();
    
    tableBody.innerHTML = '';
    
    filteredData.forEach(gasto => {
        const row = document.createElement('tr');
        const categoria = categorias.find(cat => cat.id === gasto.categoria);
        
        row.innerHTML = `
            <td>${gasto.descricao}</td>
            <td>${formatCurrency(gasto.valor)}</td>
            <td>${formatDate(gasto.dataVencimento)}</td>
            <td>
                <span class="category-badge" style="background-color: ${categoria ? categoria.cor : '#666'}">
                    ${categoria ? categoria.nome : 'Outros'}
                </span>
            </td>
            <td>
                <span class="status-badge status-badge--${gasto.status}">
                    ${gasto.status}
                </span>
            </td>
            <td class="table-actions">
                <button class="btn btn--sm btn--secondary" onclick="editExpense(${gasto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn--sm btn--outline" onclick="deleteExpense(${gasto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getFilteredExpenses() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    return gastosData.filter(gasto => {
        const matchesCategory = !categoryFilter || gasto.categoria === categoryFilter;
        const matchesStatus = !statusFilter || gasto.status === statusFilter;
        const matchesSearch = !searchTerm || gasto.descricao.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesStatus && matchesSearch;
    });
}

function applyFilters() {
    renderExpenseTable();
}

// Modal Functions
function openAddExpenseModal() {
    currentEditingExpense = null;
    document.getElementById('modalTitle').textContent = 'Adicionar Gasto';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseModal').classList.remove('hidden');
}

function editExpense(id) {
    const expense = gastosData.find(g => g.id === id);
    if (!expense) return;
    
    currentEditingExpense = expense;
    document.getElementById('modalTitle').textContent = 'Editar Gasto';
    
    document.getElementById('expenseDescription').value = expense.descricao;
    document.getElementById('expenseValue').value = expense.valor;
    document.getElementById('expenseDueDate').value = expense.dataVencimento;
    document.getElementById('expenseCategory').value = expense.categoria;
    document.getElementById('expenseStatus').value = expense.status;
    
    document.getElementById('expenseModal').classList.remove('hidden');
}

function deleteExpense(id) {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
        gastosData = gastosData.filter(g => g.id !== id);
        saveDataToStorage();
        updateDashboard();
        renderExpenseTable();
        updateFileCounter();
        showToast('Gasto excluído com sucesso!', 'success');
    }
}

function closeModal() {
    document.getElementById('expenseModal').classList.add('hidden');
    currentEditingExpense = null;
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const formData = {
        descricao: document.getElementById('expenseDescription').value,
        valor: parseFloat(document.getElementById('expenseValue').value),
        dataVencimento: document.getElementById('expenseDueDate').value,
        categoria: document.getElementById('expenseCategory').value,
        status: document.getElementById('expenseStatus').value
    };
    
    if (currentEditingExpense) {
        // Edit existing expense
        Object.assign(currentEditingExpense, formData);
        showToast('Gasto atualizado com sucesso!', 'success');
    } else {
        // Add new expense
        const newId = Math.max(...gastosData.map(g => g.id), 0) + 1;
        gastosData.push({ id: newId, ...formData });
        showToast('Gasto adicionado com sucesso!', 'success');
    }
    
    saveDataToStorage();
    updateDashboard();
    renderExpenseTable();
    updateFileCounter();
    closeModal();
}

// Upload Functions
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    const queue = document.getElementById('uploadQueue');
    
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'card';
        item.innerHTML = `
            <div class="card__body">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${file.name}</span>
                    <span class="status-badge status-badge--pendente">Processando...</span>
                </div>
                <div style="margin-top: 8px; background: var(--color-bg-1); height: 4px; border-radius: 2px;">
                    <div style="height: 100%; background: var(--color-primary); width: 0%; border-radius: 2px; transition: width 2s;"></div>
                </div>
            </div>
        `;
        
        queue.appendChild(item);
        
        // Simulate upload progress
        const progressBar = item.querySelector('div[style*="width: 0%"]');
        const statusBadge = item.querySelector('.status-badge');
        
        setTimeout(() => {
            progressBar.style.width = '100%';
            setTimeout(() => {
                statusBadge.textContent = 'Concluído';
                statusBadge.className = 'status-badge status-badge--pago';
                showToast(`Arquivo ${file.name} processado com sucesso!`, 'success');
            }, 2000);
        }, 500);
    });
}

// Reports Functions
function initializeReports() {
    updateStatusChart();
    updateMonthlySummary();
}

function updateStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (statusChart) {
        statusChart.destroy();
    }
    
    const statusTotals = {
        pendente: 0,
        pago: 0,
        atrasado: 0
    };
    
    gastosData.forEach(gasto => {
        statusTotals[gasto.status] += gasto.valor;
    });
    
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendente', 'Pago', 'Atrasado'],
            datasets: [{
                data: [statusTotals.pendente, statusTotals.pago, statusTotals.atrasado],
                backgroundColor: ['#f39c12', '#1abc9c', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

function updateMonthlySummary() {
    const summaryContainer = document.getElementById('monthlySummary');
    const monthTotals = {};
    
    gastosData.forEach(gasto => {
        const date = new Date(gasto.dataVencimento);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthTotals[monthKey]) {
            monthTotals[monthKey] = 0;
        }
        monthTotals[monthKey] += gasto.valor;
    });
    
    const sortedMonths = Object.keys(monthTotals).sort().reverse();
    
    summaryContainer.innerHTML = '';
    
    sortedMonths.slice(0, 6).forEach(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        const item = document.createElement('div');
        item.className = 'summary-item';
        item.innerHTML = `
            <span class="summary-item__label">${monthName}</span>
            <span class="summary-item__value">${formatCurrency(monthTotals[month])}</span>
        `;
        
        summaryContainer.appendChild(item);
    });
}

// Settings Functions
function initializeSettings() {
    renderCategoryList();
}

function renderCategoryList() {
    const container = document.getElementById('categoryList');
    container.innerHTML = '';
    
    categorias.forEach(categoria => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <div class="category-item__info">
                <div class="category-color" style="background-color: ${categoria.cor}"></div>
                <span>${categoria.nome}</span>
            </div>
            <div class="category-item__actions">
                <button class="btn btn--sm btn--secondary" onclick="editCategory('${categoria.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn--sm btn--outline" onclick="deleteCategory('${categoria.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function addNewCategory() {
    const nome = prompt('Nome da nova categoria:');
    if (!nome) return;
    
    const cores = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    const cor = cores[Math.floor(Math.random() * cores.length)];
    
    const newId = 'categoria-' + Date.now();
    categorias.push({ id: newId, nome, cor });
    
    saveDataToStorage();
    renderCategoryList();
    populateSelectors();
    showToast('Categoria adicionada com sucesso!', 'success');
}

function editCategory(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    const newName = prompt('Novo nome da categoria:', categoria.nome);
    if (newName && newName !== categoria.nome) {
        categoria.nome = newName;
        saveDataToStorage();
        renderCategoryList();
        populateSelectors();
        updateDashboard();
        renderExpenseTable();
        showToast('Categoria atualizada com sucesso!', 'success');
    }
}

function deleteCategory(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        // Check if category is in use
        const inUse = gastosData.some(g => g.categoria === id);
        if (inUse) {
            alert('Esta categoria está sendo usada por alguns gastos e não pode ser excluída.');
            return;
        }
        
        categorias = categorias.filter(c => c.id !== id);
        saveDataToStorage();
        renderCategoryList();
        populateSelectors();
        showToast('Categoria excluída com sucesso!', 'success');
    }
}

function exportData() {
    const data = {
        gastos: gastosData,
        categorias: categorias,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-financeiro-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Dados exportados com sucesso!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.gastos && data.categorias) {
                    gastosData = data.gastos;
                    categorias = data.categorias;
                    saveDataToStorage();
                    
                    updateDashboard();
                    renderExpenseTable();
                    updateFileCounter();
                    populateSelectors();
                    renderCategoryList();
                    
                    showToast('Dados importados com sucesso!', 'success');
                } else {
                    throw new Error('Formato inválido');
                }
            } catch (error) {
                showToast('Erro ao importar dados: arquivo inválido', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function clearAllData() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('gastosData');
        localStorage.removeItem('categorias');
        location.reload();
    }
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function updateFileCounter() {
    document.getElementById('fileCounter').textContent = gastosData.length;
}

function populateSelectors() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    const currentCategoryValue = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nome;
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = currentCategoryValue;
    
    // Modal category selector
    const expenseCategory = document.getElementById('expenseCategory');
    const currentExpenseCategoryValue = expenseCategory.value;
    expenseCategory.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nome;
        expenseCategory.appendChild(option);
    });
    
    expenseCategory.value = currentExpenseCategoryValue;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}