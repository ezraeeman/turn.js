# Team Project Tracker

A modern, intuitive web application for tracking team projects, tasks, milestones, and project health status.

## Features

### Dashboard Overview
- **Quick Stats**: Visual summary of all projects with color-coded status indicators
  - 🟢 On Track (green) - Projects progressing well
  - 🟡 At Risk (yellow) - Projects with potential issues
  - 🔴 Blocked (red) - Projects that need immediate attention
  - 🟣 Completed (purple) - Finished projects
- **Project Cards**: Grid view of all projects with progress indicators
- **Real-time Updates**: Dashboard updates automatically as you make changes

### Project Management
- **Create Projects**: Define project name, description, owner, dates, and status
- **Edit Projects**: Update project details at any time
- **Delete Projects**: Remove projects when no longer needed
- **Project Details**: Comprehensive view of each project including:
  - Project metadata (owner, dates, status)
  - Task list with completion tracking
  - Milestone tracking with achievement status

### Task Management
- **Add Tasks**: Create tasks with:
  - Name and description
  - Status (To Do, In Progress, Completed, Blocked)
  - Assignee
  - Due date
- **Edit Tasks**: Update task details as work progresses
- **Delete Tasks**: Remove completed or cancelled tasks
- **Visual Indicators**: Color-coded borders show task status at a glance

### Milestone Tracking
- **Define Milestones**: Set key project milestones with:
  - Name and description
  - Target date
  - Status (Pending, Achieved, Missed)
- **Track Progress**: Monitor milestone achievement
- **Visual Status**: Clear indicators for milestone completion

### Data Persistence
- **Local Storage**: All data is automatically saved to your browser
- **No Backend Required**: Works completely offline
- **Sample Data**: Includes example projects to get you started

## Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. The app loads with sample projects to demonstrate features
3. Start creating your own projects by clicking "+ New Project"

### Usage

#### Creating a New Project
1. Click the "+ New Project" button in the header
2. Fill in the project details:
   - **Project Name** (required)
   - **Description** (optional)
   - **Status** (required) - Select current health status
   - **Project Owner** (optional)
   - **Start Date** (optional)
   - **Target End Date** (optional)
3. Click "Save Project"

#### Managing Tasks
1. Click on a project card to view details
2. In the Tasks section, click "+ Add Task"
3. Fill in task details and save
4. Edit or delete tasks using the action buttons
5. Change task status to track progress

#### Setting Milestones
1. From the project detail view, go to the Milestones section
2. Click "+ Add Milestone"
3. Set the milestone name, date, and status
4. Track achievement as you progress

#### Understanding Project Status

**On Track (Green)**
- Project is progressing as planned
- No significant blockers
- Team is meeting deadlines

**At Risk (Yellow)**
- Potential issues identified
- May miss deadlines without intervention
- Requires manager attention

**Blocked (Red)**
- Critical blockers preventing progress
- Immediate action required
- Escalation needed

**Completed (Purple)**
- Project successfully finished
- All tasks completed
- Archived for reference

## Technical Details

### Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Local Storage API**: Browser-based data persistence

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser with ES6 support

### File Structure
```
webapp/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # Application logic
└── README.md           # This file
```

### Data Model

**Project Structure:**
```javascript
{
  id: "unique_id",
  name: "Project Name",
  description: "Project description",
  status: "on-track|at-risk|blocked|completed",
  owner: "Project Owner",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD",
  tasks: [...],
  milestones: [...]
}
```

**Task Structure:**
```javascript
{
  id: "unique_id",
  name: "Task Name",
  description: "Task description",
  status: "todo|in-progress|completed|blocked",
  assignee: "Person Name",
  dueDate: "YYYY-MM-DD"
}
```

**Milestone Structure:**
```javascript
{
  id: "unique_id",
  name: "Milestone Name",
  description: "Milestone description",
  date: "YYYY-MM-DD",
  status: "pending|achieved|missed"
}
```

## Features Highlights

### Intuitive Interface
- Clean, modern design
- Color-coded status indicators
- Easy navigation between views
- Responsive layout for all screen sizes

### Quick Overview
- Dashboard provides instant project health visibility
- Stats cards show at-a-glance metrics
- Progress bars on project cards
- Visual differentiation of project status

### Risk Management
- Clear identification of at-risk projects
- Blocked project highlighting
- Task-level status tracking
- Milestone achievement monitoring

## Tips for Best Use

1. **Update Status Regularly**: Keep project status current for accurate overview
2. **Use Descriptions**: Add context to help team members understand work
3. **Set Realistic Dates**: Target dates help track progress
4. **Assign Tasks**: Clear ownership improves accountability
5. **Track Milestones**: Break projects into measurable achievements
6. **Review Dashboard**: Regular checks help identify risks early

## Data Management

### Exporting Data
Your data is stored in browser Local Storage. To backup:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Find key: `projectTrackerData`
4. Copy the JSON value

### Importing Data
To restore or import data:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Set key `projectTrackerData` with your JSON data
4. Refresh the page

### Clearing Data
To start fresh:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Delete key: `projectTrackerData`
4. Refresh the page

## Customization

The app uses CSS variables for easy theming. Edit `css/styles.css`:

```css
:root {
    --primary-color: #4f46e5;     /* Main accent color */
    --on-track: #10b981;          /* Success/on-track color */
    --at-risk: #f59e0b;           /* Warning/at-risk color */
    --blocked: #ef4444;           /* Error/blocked color */
    /* ... more variables */
}
```

## Future Enhancements

Possible additions:
- Export to PDF/Excel
- Team member management
- Email notifications
- Calendar integration
- File attachments
- Comments and activity log
- Backend API integration
- User authentication
- Gantt chart view
- Time tracking

## Support

For issues or questions about the Turn.js library, visit:
- [Turn.js GitHub Repository](https://github.com/blasten/turn.js)

## License

This webapp is part of the Turn.js project. See the main repository for license information.
