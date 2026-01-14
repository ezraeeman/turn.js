// ==========================================
// Team Project Tracker - Application Logic
// ==========================================

class ProjectTracker {
    constructor() {
        this.projects = [];
        this.currentProjectId = null;
        this.editingTaskId = null;
        this.editingMilestoneId = null;
        this.editMode = false;

        this.init();
    }

    // ==========================================
    // Initialization
    // ==========================================
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderDashboard();
    }

    // ==========================================
    // Local Storage
    // ==========================================
    loadFromStorage() {
        const stored = localStorage.getItem('projectTrackerData');
        if (stored) {
            this.projects = JSON.parse(stored);
        } else {
            // Add sample data for first time users
            this.projects = this.generateSampleData();
            this.saveToStorage();
        }
    }

    saveToStorage() {
        localStorage.setItem('projectTrackerData', JSON.stringify(this.projects));
    }

    generateSampleData() {
        return [
            {
                id: this.generateId(),
                name: 'Website Redesign',
                description: 'Complete overhaul of company website with modern design and improved UX',
                status: 'on-track',
                owner: 'Sarah Johnson',
                startDate: '2026-01-01',
                endDate: '2026-03-31',
                tasks: [
                    {
                        id: this.generateId(),
                        name: 'Design mockups',
                        description: 'Create wireframes and high-fidelity mockups',
                        status: 'completed',
                        assignee: 'Design Team',
                        dueDate: '2026-01-15'
                    },
                    {
                        id: this.generateId(),
                        name: 'Frontend development',
                        description: 'Implement responsive design',
                        status: 'in-progress',
                        assignee: 'Dev Team',
                        dueDate: '2026-02-28'
                    }
                ],
                milestones: [
                    {
                        id: this.generateId(),
                        name: 'Design Approval',
                        description: 'Final design approved by stakeholders',
                        date: '2026-01-20',
                        status: 'achieved'
                    },
                    {
                        id: this.generateId(),
                        name: 'Beta Launch',
                        description: 'Launch beta version for testing',
                        date: '2026-03-15',
                        status: 'pending'
                    }
                ]
            },
            {
                id: this.generateId(),
                name: 'Mobile App Development',
                description: 'Build native iOS and Android applications',
                status: 'at-risk',
                owner: 'Mike Chen',
                startDate: '2025-12-01',
                endDate: '2026-04-30',
                tasks: [
                    {
                        id: this.generateId(),
                        name: 'API Integration',
                        description: 'Connect mobile apps to backend API',
                        status: 'blocked',
                        assignee: 'Backend Team',
                        dueDate: '2026-02-01'
                    }
                ],
                milestones: [
                    {
                        id: this.generateId(),
                        name: 'MVP Complete',
                        description: 'Minimum viable product ready',
                        date: '2026-02-15',
                        status: 'missed'
                    }
                ]
            },
            {
                id: this.generateId(),
                name: 'Database Migration',
                description: 'Migrate legacy database to new cloud infrastructure',
                status: 'blocked',
                owner: 'David Park',
                startDate: '2026-01-10',
                endDate: '2026-02-28',
                tasks: [],
                milestones: []
            }
        ];
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    setupEventListeners() {
        // New Project Button
        document.getElementById('newProjectBtn').addEventListener('click', () => {
            this.openProjectModal();
        });

        // Project Form
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        // Task Form
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Milestone Form
        document.getElementById('milestoneForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMilestone();
        });

        // Modal Close Buttons
        document.querySelectorAll('.modal-close, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Back to Dashboard
        document.getElementById('backToDashboard').addEventListener('click', () => {
            this.showDashboard();
        });

        // Edit Project Button
        document.getElementById('editProjectBtn').addEventListener('click', () => {
            this.openProjectModal(this.currentProjectId);
        });

        // Delete Project Button
        document.getElementById('deleteProjectBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                this.deleteProject(this.currentProjectId);
                this.showDashboard();
            }
        });
    }

    // ==========================================
    // View Management
    // ==========================================
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
    }

    showDashboard() {
        this.showView('dashboardView');
        this.renderDashboard();
    }

    showProjectDetail(projectId) {
        this.currentProjectId = projectId;
        this.showView('projectDetailView');
        this.renderProjectDetail(projectId);
    }

    // ==========================================
    // Dashboard Rendering
    // ==========================================
    renderDashboard() {
        this.updateStats();
        this.renderProjectsGrid();
    }

    updateStats() {
        const stats = {
            onTrack: this.projects.filter(p => p.status === 'on-track').length,
            atRisk: this.projects.filter(p => p.status === 'at-risk').length,
            blocked: this.projects.filter(p => p.status === 'blocked').length,
            total: this.projects.length
        };

        document.getElementById('onTrackCount').textContent = stats.onTrack;
        document.getElementById('atRiskCount').textContent = stats.atRisk;
        document.getElementById('blockedCount').textContent = stats.blocked;
        document.getElementById('totalCount').textContent = stats.total;
    }

    renderProjectsGrid() {
        const grid = document.getElementById('projectsGrid');

        if (this.projects.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">No projects yet. Create your first project to get started!</div>
                    <button class="btn btn-primary" onclick="app.openProjectModal()">+ Create Project</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.projects.map(project => {
            const taskStats = this.getTaskStats(project);
            const progress = taskStats.total > 0
                ? Math.round((taskStats.completed / taskStats.total) * 100)
                : 0;

            return `
                <div class="project-card ${project.status}" onclick="app.showProjectDetail('${project.id}')">
                    <div class="project-card-header">
                        <div>
                            <div class="project-card-title">${this.escapeHtml(project.name)}</div>
                        </div>
                        <span class="project-status-badge status-${project.status}">
                            ${this.formatStatus(project.status)}
                        </span>
                    </div>

                    ${project.description ? `
                        <div class="project-card-description">${this.escapeHtml(project.description)}</div>
                    ` : ''}

                    <div class="project-card-meta">
                        ${project.owner ? `
                            <div class="project-card-meta-item">
                                <span>👤</span>
                                <span>${this.escapeHtml(project.owner)}</span>
                            </div>
                        ` : ''}
                        ${project.endDate ? `
                            <div class="project-card-meta-item">
                                <span>📅</span>
                                <span>${this.formatDate(project.endDate)}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="project-card-footer">
                        <div class="project-progress">
                            <span>Tasks Progress</span>
                            <span>${taskStats.completed}/${taskStats.total} completed</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==========================================
    // Project Detail Rendering
    // ==========================================
    renderProjectDetail(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const container = document.getElementById('projectDetail');
        const taskStats = this.getTaskStats(project);

        container.innerHTML = `
            <div class="project-detail-header">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h2 class="project-detail-title">${this.escapeHtml(project.name)}</h2>
                        <span class="project-status-badge status-${project.status}">
                            ${this.formatStatus(project.status)}
                        </span>
                    </div>
                </div>

                ${project.description ? `
                    <p style="margin-top: 1rem; color: var(--text-secondary);">${this.escapeHtml(project.description)}</p>
                ` : ''}

                <div class="project-detail-meta">
                    ${project.owner ? `
                        <div class="meta-item">
                            <span class="meta-label">Project Owner</span>
                            <span class="meta-value">${this.escapeHtml(project.owner)}</span>
                        </div>
                    ` : ''}
                    ${project.startDate ? `
                        <div class="meta-item">
                            <span class="meta-label">Start Date</span>
                            <span class="meta-value">${this.formatDate(project.startDate)}</span>
                        </div>
                    ` : ''}
                    ${project.endDate ? `
                        <div class="meta-item">
                            <span class="meta-label">Target End Date</span>
                            <span class="meta-value">${this.formatDate(project.endDate)}</span>
                        </div>
                    ` : ''}
                    <div class="meta-item">
                        <span class="meta-label">Tasks Completed</span>
                        <span class="meta-value">${taskStats.completed} / ${taskStats.total}</span>
                    </div>
                </div>
            </div>

            <div class="project-sections">
                <!-- Tasks Section -->
                <div class="section">
                    <div class="section-header">
                        <h3 class="section-title">Tasks</h3>
                        <button class="btn btn-primary btn-small" onclick="app.openTaskModal()">+ Add Task</button>
                    </div>
                    ${this.renderTasks(project.tasks)}
                </div>

                <!-- Milestones Section -->
                <div class="section">
                    <div class="section-header">
                        <h3 class="section-title">Milestones</h3>
                        <button class="btn btn-primary btn-small" onclick="app.openMilestoneModal()">+ Add Milestone</button>
                    </div>
                    ${this.renderMilestones(project.milestones)}
                </div>
            </div>
        `;
    }

    renderTasks(tasks) {
        if (!tasks || tasks.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-text">No tasks yet. Add your first task to get started!</div>
                </div>
            `;
        }

        return `
            <div class="tasks-list">
                ${tasks.map(task => `
                    <div class="task-item ${task.status}">
                        <div class="task-content">
                            <div class="task-name">${this.escapeHtml(task.name)}</div>
                            ${task.description ? `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">${this.escapeHtml(task.description)}</div>` : ''}
                            <div class="task-meta">
                                ${task.assignee ? `<span>👤 ${this.escapeHtml(task.assignee)}</span>` : ''}
                                ${task.dueDate ? `<span>📅 ${this.formatDate(task.dueDate)}</span>` : ''}
                                <span class="project-status-badge status-${task.status}">${this.formatStatus(task.status)}</span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-secondary btn-small" onclick="app.openTaskModal('${task.id}')">Edit</button>
                            <button class="btn btn-danger btn-small" onclick="app.deleteTask('${task.id}')">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderMilestones(milestones) {
        if (!milestones || milestones.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-text">No milestones yet. Add your first milestone to track progress!</div>
                </div>
            `;
        }

        return `
            <div class="milestones-list">
                ${milestones.map(milestone => `
                    <div class="milestone-item ${milestone.status}">
                        <div class="milestone-header">
                            <div class="milestone-name">${this.escapeHtml(milestone.name)}</div>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <span class="project-status-badge status-${milestone.status}">${this.formatStatus(milestone.status)}</span>
                                <div class="milestone-actions">
                                    <button class="btn btn-secondary btn-small" onclick="app.openMilestoneModal('${milestone.id}')">Edit</button>
                                    <button class="btn btn-danger btn-small" onclick="app.deleteMilestone('${milestone.id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                        ${milestone.description ? `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">${this.escapeHtml(milestone.description)}</div>` : ''}
                        <div class="milestone-date" style="margin-top: 0.5rem;">📅 ${this.formatDate(milestone.date)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==========================================
    // Modal Management
    // ==========================================
    openProjectModal(projectId = null) {
        const modal = document.getElementById('projectModal');
        const form = document.getElementById('projectForm');
        const title = document.getElementById('modalTitle');

        form.reset();
        this.editMode = !!projectId;

        if (projectId) {
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                title.textContent = 'Edit Project';
                document.getElementById('projectName').value = project.name;
                document.getElementById('projectDescription').value = project.description || '';
                document.getElementById('projectStatus').value = project.status;
                document.getElementById('projectOwner').value = project.owner || '';
                document.getElementById('projectStartDate').value = project.startDate || '';
                document.getElementById('projectEndDate').value = project.endDate || '';
            }
        } else {
            title.textContent = 'New Project';
            this.currentProjectId = null;
        }

        modal.classList.add('active');
    }

    openTaskModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('taskModalTitle');

        form.reset();
        this.editingTaskId = taskId;

        if (taskId) {
            const project = this.projects.find(p => p.id === this.currentProjectId);
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Edit Task';
                document.getElementById('taskName').value = task.name;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskStatus').value = task.status;
                document.getElementById('taskAssignee').value = task.assignee || '';
                document.getElementById('taskDueDate').value = task.dueDate || '';
            }
        } else {
            title.textContent = 'New Task';
        }

        modal.classList.add('active');
    }

    openMilestoneModal(milestoneId = null) {
        const modal = document.getElementById('milestoneModal');
        const form = document.getElementById('milestoneForm');
        const title = document.getElementById('milestoneModalTitle');

        form.reset();
        this.editingMilestoneId = milestoneId;

        if (milestoneId) {
            const project = this.projects.find(p => p.id === this.currentProjectId);
            const milestone = project.milestones.find(m => m.id === milestoneId);
            if (milestone) {
                title.textContent = 'Edit Milestone';
                document.getElementById('milestoneName').value = milestone.name;
                document.getElementById('milestoneDescription').value = milestone.description || '';
                document.getElementById('milestoneDate').value = milestone.date;
                document.getElementById('milestoneStatus').value = milestone.status;
            }
        } else {
            title.textContent = 'New Milestone';
        }

        modal.classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.editMode = false;
        this.editingTaskId = null;
        this.editingMilestoneId = null;
    }

    // ==========================================
    // CRUD Operations - Projects
    // ==========================================
    saveProject() {
        const projectData = {
            name: document.getElementById('projectName').value,
            description: document.getElementById('projectDescription').value,
            status: document.getElementById('projectStatus').value,
            owner: document.getElementById('projectOwner').value,
            startDate: document.getElementById('projectStartDate').value,
            endDate: document.getElementById('projectEndDate').value
        };

        if (this.editMode && this.currentProjectId) {
            // Update existing project
            const project = this.projects.find(p => p.id === this.currentProjectId);
            if (project) {
                Object.assign(project, projectData);
            }
        } else {
            // Create new project
            const newProject = {
                id: this.generateId(),
                ...projectData,
                tasks: [],
                milestones: []
            };
            this.projects.push(newProject);
        }

        this.saveToStorage();
        this.closeAllModals();

        if (this.editMode) {
            this.renderProjectDetail(this.currentProjectId);
        } else {
            this.renderDashboard();
        }
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.saveToStorage();
        this.renderDashboard();
    }

    // ==========================================
    // CRUD Operations - Tasks
    // ==========================================
    saveTask() {
        const taskData = {
            name: document.getElementById('taskName').value,
            description: document.getElementById('taskDescription').value,
            status: document.getElementById('taskStatus').value,
            assignee: document.getElementById('taskAssignee').value,
            dueDate: document.getElementById('taskDueDate').value
        };

        const project = this.projects.find(p => p.id === this.currentProjectId);
        if (!project) return;

        if (this.editingTaskId) {
            // Update existing task
            const task = project.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                Object.assign(task, taskData);
            }
        } else {
            // Create new task
            const newTask = {
                id: this.generateId(),
                ...taskData
            };
            project.tasks.push(newTask);
        }

        this.saveToStorage();
        this.closeAllModals();
        this.renderProjectDetail(this.currentProjectId);
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        const project = this.projects.find(p => p.id === this.currentProjectId);
        if (project) {
            project.tasks = project.tasks.filter(t => t.id !== taskId);
            this.saveToStorage();
            this.renderProjectDetail(this.currentProjectId);
        }
    }

    // ==========================================
    // CRUD Operations - Milestones
    // ==========================================
    saveMilestone() {
        const milestoneData = {
            name: document.getElementById('milestoneName').value,
            description: document.getElementById('milestoneDescription').value,
            date: document.getElementById('milestoneDate').value,
            status: document.getElementById('milestoneStatus').value
        };

        const project = this.projects.find(p => p.id === this.currentProjectId);
        if (!project) return;

        if (this.editingMilestoneId) {
            // Update existing milestone
            const milestone = project.milestones.find(m => m.id === this.editingMilestoneId);
            if (milestone) {
                Object.assign(milestone, milestoneData);
            }
        } else {
            // Create new milestone
            const newMilestone = {
                id: this.generateId(),
                ...milestoneData
            };
            project.milestones.push(newMilestone);
        }

        this.saveToStorage();
        this.closeAllModals();
        this.renderProjectDetail(this.currentProjectId);
    }

    deleteMilestone(milestoneId) {
        if (!confirm('Are you sure you want to delete this milestone?')) return;

        const project = this.projects.find(p => p.id === this.currentProjectId);
        if (project) {
            project.milestones = project.milestones.filter(m => m.id !== milestoneId);
            this.saveToStorage();
            this.renderProjectDetail(this.currentProjectId);
        }
    }

    // ==========================================
    // Utility Functions
    // ==========================================
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getTaskStats(project) {
        const total = project.tasks.length;
        const completed = project.tasks.filter(t => t.status === 'completed').length;
        return { total, completed };
    }

    formatStatus(status) {
        const statusMap = {
            'on-track': 'On Track',
            'at-risk': 'At Risk',
            'blocked': 'Blocked',
            'completed': 'Completed',
            'todo': 'To Do',
            'in-progress': 'In Progress',
            'pending': 'Pending',
            'achieved': 'Achieved',
            'missed': 'Missed'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==========================================
// Initialize Application
// ==========================================
const app = new ProjectTracker();
