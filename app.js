// Gym Management System - JavaScript
class GymManagement {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('gymStudents')) || [];
        this.config = JSON.parse(localStorage.getItem('gymConfig')) || {
            gymName: 'Mi Gimnasio',
            currency: '$',
            reminderDays: 3,
            prices: {
                personalizado: 50000,
                clasico: 30000
            }
        };
        this.searchTerm = '';
        this.showOnlyOverdue = false;
        this.showOnlyCritical = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderStudents();
        this.loadConfig();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add student form
        document.getElementById('addStudentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent();
        });

        // Configuration modal
        document.getElementById('configBtn').addEventListener('click', () => {
            this.openConfigModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeConfigModal();
        });

        document.getElementById('cancelConfig').addEventListener('click', () => {
            this.closeConfigModal();
        });

        document.getElementById('saveConfig').addEventListener('click', () => {
            this.saveConfig();
        });

        // Close modal on backdrop click
        document.getElementById('configModal').addEventListener('click', (e) => {
            if (e.target.id === 'configModal') {
                this.closeConfigModal();
            }
        });

        // Overdue filter toggle
        document.getElementById('overdueFilter').addEventListener('click', () => {
            this.showOnlyOverdue = !this.showOnlyOverdue;
            this.showOnlyCritical = false; // Reset critical filter
            document.getElementById('overdueFilter').textContent = 
                this.showOnlyOverdue ? 'Mostrar Todos' : 'Solo Vencidos';
            document.getElementById('criticalFilter').textContent = 'Muy Vencidos';
            this.renderStudents();
        });

        // Critical overdue filter toggle (>1 month)
        document.getElementById('criticalFilter').addEventListener('click', () => {
            this.showOnlyCritical = !this.showOnlyCritical;
            this.showOnlyOverdue = false; // Reset overdue filter
            document.getElementById('criticalFilter').textContent = 
                this.showOnlyCritical ? 'Mostrar Todos' : 'Muy Vencidos';
            document.getElementById('overdueFilter').textContent = 'Solo Vencidos';
            this.renderStudents();
        });

        // Membership type change event
        document.getElementById('membershipType').addEventListener('change', (e) => {
            const selectedType = e.target.value;
            const price = this.config.prices[selectedType];
            document.getElementById('monthlyFee').value = price;
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    addStudent() {
        const form = document.getElementById('addStudentForm');
        const formData = new FormData(form);
        
        const student = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            membershipType: formData.get('membershipType'),
            monthlyFee: parseFloat(formData.get('monthlyFee')),
            monthsOwed: formData.get('monthsOwed') || '',
            startDate: formData.get('startDate'),
            lastPayment: null,
            status: 'pending'
        };

        this.students.push(student);
        this.saveData();
        this.updateStats();
        this.renderStudents();
        
        // Reset form and switch to students tab
        form.reset();
        this.switchTab('students');
        
        // Show success message
        this.showNotification('Alumno agregado exitosamente', 'success');
    }

    updateStats() {
        const total = this.students.length;
        const personalizado = this.students.filter(s => s.membershipType === 'personalizado').length;
        const clasico = this.students.filter(s => s.membershipType === 'clasico').length;
        
        // Calculate payment status
        const currentDate = new Date();
        const paidStudents = this.students.filter(student => {
            if (!student.lastPayment) return false;
            const lastPayment = new Date(student.lastPayment);
            const daysDiff = Math.floor((currentDate - lastPayment) / (1000 * 60 * 60 * 24));
            return daysDiff <= 30;
        });

        const overdueStudents = this.students.filter(student => {
            if (!student.lastPayment) return true;
            const lastPayment = new Date(student.lastPayment);
            const daysDiff = Math.floor((currentDate - lastPayment) / (1000 * 60 * 60 * 24));
            return daysDiff > 30 && daysDiff <= 60;
        });

        const criticalStudents = this.students.filter(student => {
            if (!student.lastPayment) {
                const startDate = new Date(student.startDate);
                const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
                return daysSinceStart > 60;
            }
            const lastPayment = new Date(student.lastPayment);
            const daysDiff = Math.floor((currentDate - lastPayment) / (1000 * 60 * 60 * 24));
            return daysDiff > 60;
        });

        const totalIncome = paidStudents.reduce((sum, student) => sum + student.monthlyFee, 0);
        const pendingIncome = (overdueStudents.length + criticalStudents.length) > 0 ? 
            [...overdueStudents, ...criticalStudents].reduce((sum, student) => sum + student.monthlyFee, 0) : 0;

        // Update DOM
        document.getElementById('totalStudents').textContent = total;
        document.getElementById('studentTypes').textContent = `${personalizado} personalizado, ${clasico} clásico`;
        document.getElementById('paidStudents').textContent = paidStudents.length;
        document.getElementById('paidPercentage').textContent = total > 0 ? `${((paidStudents.length / total) * 100).toFixed(1)}% del total` : '0.0% del total';
        document.getElementById('overdueStudents').textContent = overdueStudents.length + criticalStudents.length;
        document.getElementById('overduePercentage').textContent = total > 0 ? `${(((overdueStudents.length + criticalStudents.length) / total) * 100).toFixed(1)}% del total` : '0.0% del total';
        document.getElementById('totalIncome').textContent = `${this.config.currency} ${totalIncome.toFixed(2)}`;
        document.getElementById('pendingIncome').textContent = `${this.config.currency}${pendingIncome.toFixed(2)} pendiente`;
        document.getElementById('studentsBadge').textContent = total;

        // Update progress bars
        const paidProgress = total > 0 ? (paidStudents.length / total) * 100 : 0;
        const overdueProgress = total > 0 ? ((overdueStudents.length + criticalStudents.length) / total) * 100 : 0;
        
        document.getElementById('paidProgress').style.width = `${paidProgress}%`;
        document.getElementById('overdueProgress').style.width = `${overdueProgress}%`;

        // Update filter button badges
        const overdueBtn = document.getElementById('overdueFilter');
        const criticalBtn = document.getElementById('criticalFilter');
        
        if (overdueStudents.length > 0) {
            overdueBtn.setAttribute('data-count', overdueStudents.length);
        } else {
            overdueBtn.removeAttribute('data-count');
        }
        
        if (criticalStudents.length > 0) {
            criticalBtn.setAttribute('data-count', criticalStudents.length);
        } else {
            criticalBtn.removeAttribute('data-count');
        }
    }

    renderStudents() {
        const container = document.getElementById('studentsContent');
        
        // Filter students based on search and overdue filter
        let filteredStudents = this.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(this.searchTerm);
            const status = this.getStudentStatus(student);
            
            if (this.showOnlyOverdue) {
                return matchesSearch && status === 'overdue';
            }
            if (this.showOnlyCritical) {
                return matchesSearch && status === 'critical';
            }
            return matchesSearch;
        });

        // Sort alphabetically by name
        filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
        
        if (filteredStudents.length === 0) {
            let message = 'No hay alumnos registrados';
            if (this.searchTerm) {
                message = 'No se encontraron alumnos que coincidan con la búsqueda';
            } else if (this.showOnlyOverdue) {
                message = 'No hay pagos vencidos (1-2 meses)';
            } else if (this.showOnlyCritical) {
                message = 'No hay pagos muy vencidos (+2 meses)';
            }
            
            container.innerHTML = `
                <div class="text-center space-y-2">
                    <h3 class="text-lg font-semibold">${message}</h3>
                    <p class="text-muted-foreground">${this.searchTerm || this.showOnlyOverdue || this.showOnlyCritical ? 'Intenta cambiar los filtros' : 'Comienza agregando tu primer alumno al sistema'}</p>
                </div>
            `;
            container.className = 'card-content empty-state';
            return;
        }

        container.className = 'card-content';
        container.innerHTML = filteredStudents.map(student => {
            const status = this.getStudentStatus(student);
            const daysSincePayment = this.getDaysSinceLastPayment(student);
            
            let statusClass, statusText;
            if (status === 'paid') {
                statusClass = 'status-paid';
                statusText = 'Al día';
            } else {
                // Both overdue and critical show as "Vencido" but with days
                statusClass = 'status-overdue';
                statusText = `Vencido (${daysSincePayment} días)`;
            }
            
            return `
                <div class="student-item ${status === 'paid' ? 'paid' : 'overdue'}">
                    <div class="student-info">
                        <h4>${student.name}</h4>
                        <p>Membresía: ${student.membershipType} - ${this.config.currency}${student.monthlyFee}/mes</p>
                        ${student.monthsOwed ? `<p><strong>Meses adeudados:</strong> ${student.monthsOwed}</p>` : ''}
                        <p>Email: ${student.email || 'No especificado'}</p>
                        <p>Teléfono: ${student.phone || 'No especificado'}</p>
                        <p>Inicio: ${new Date(student.startDate).toLocaleDateString()}</p>
                        ${student.lastPayment ? `<p>Último pago: ${new Date(student.lastPayment).toLocaleDateString()}</p>` : '<p>Sin pagos registrados</p>'}
                    </div>
                    <div class="student-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <div class="student-actions">
                            <button class="btn btn-primary btn-sm" onclick="gymApp.markPayment(${student.id})">
                                Marcar Pago
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="gymApp.editStudent(${student.id})">
                                Editar
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="gymApp.deleteStudent(${student.id})">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getStudentStatus(student) {
        const daysSincePayment = this.getDaysSinceLastPayment(student);
        
        if (daysSincePayment <= 30) return 'paid';
        if (daysSincePayment <= 60) return 'overdue';
        return 'critical';
    }

    getDaysSinceLastPayment(student) {
        const currentDate = new Date();
        
        if (!student.lastPayment) {
            // If no payment recorded, calculate from start date
            const startDate = new Date(student.startDate);
            return Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        }
        
        const lastPayment = new Date(student.lastPayment);
        return Math.floor((currentDate - lastPayment) / (1000 * 60 * 60 * 24));
    }

    markPayment(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            student.lastPayment = new Date().toISOString().split('T')[0];
            student.status = 'paid';
            this.saveData();
            this.updateStats();
            this.renderStudents();
            this.showNotification('Pago registrado exitosamente', 'success');
        }
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            // Fill form with student data
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email || '';
            document.getElementById('studentPhone').value = student.phone || '';
            document.getElementById('membershipType').value = student.membershipType;
            document.getElementById('monthlyFee').value = student.monthlyFee;
            document.getElementById('monthsOwed').value = student.monthsOwed || '';
            document.getElementById('startDate').value = student.startDate;
            
            // Remove student and switch to add tab
            this.deleteStudent(studentId, false);
            this.switchTab('add');
        }
    }

    deleteStudent(studentId, showNotification = true) {
        this.students = this.students.filter(s => s.id !== studentId);
        this.saveData();
        this.updateStats();
        this.renderStudents();
        
        if (showNotification) {
            this.showNotification('Alumno eliminado', 'success');
        }
    }

    openConfigModal() {
        document.getElementById('configModal').classList.add('active');
        this.loadConfig();
    }

    closeConfigModal() {
        document.getElementById('configModal').classList.remove('active');
    }

    loadConfig() {
        document.getElementById('gymName').value = this.config.gymName;
        document.getElementById('currency').value = this.config.currency;
        document.getElementById('reminderDays').value = this.config.reminderDays;
    }

    saveConfig() {
        this.config = {
            gymName: document.getElementById('gymName').value,
            currency: document.getElementById('currency').value,
            reminderDays: parseInt(document.getElementById('reminderDays').value)
        };
        
        localStorage.setItem('gymConfig', JSON.stringify(this.config));
        this.updateStats();
        this.closeConfigModal();
        this.showNotification('Configuración guardada', 'success');
        
        // Update page title
        document.title = `${this.config.gymName} - Gestión de Cuotas`;
        document.querySelector('h1').textContent = this.config.gymName;
    }

    saveData() {
        localStorage.setItem('gymStudents', JSON.stringify(this.students));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data
    exportData() {
        const data = {
            students: this.students,
            config: this.config,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gym-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.students && data.config) {
                    this.students = data.students;
                    this.config = data.config;
                    this.saveData();
                    localStorage.setItem('gymConfig', JSON.stringify(this.config));
                    this.updateStats();
                    this.renderStudents();
                    this.loadConfig();
                    this.showNotification('Datos importados exitosamente', 'success');
                } else {
                    throw new Error('Formato de archivo inválido');
                }
            } catch (error) {
                this.showNotification('Error al importar datos: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app
let gymApp;
document.addEventListener('DOMContentLoaded', () => {
    gymApp = new GymManagement();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                gymApp.switchTab('students');
                break;
            case '2':
                e.preventDefault();
                gymApp.switchTab('reminders');
                break;
            case '3':
                e.preventDefault();
                gymApp.switchTab('add');
                break;
            case ',':
                e.preventDefault();
                gymApp.openConfigModal();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        gymApp.closeConfigModal();
    }
});

