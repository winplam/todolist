// Class to hold all the projects. Only 1 instance is needed.
const ToDoList = {
  type: 'ToDoList',
  projects: [],
  currentProjectID: -1,

  addProject (project) {
    if (project.type === 'Project') {
      project.projectID = this.projects.length
      this.projects.push(project)
    } else {throw new Error('Object being passed is not of type "Project".')}
  },

  deleteThisProject () {
    delete this.projects[this.currentProjectID]
  },

  getCurrentProject () {
    return this.projects[this.currentProjectID]
  },

  getCurrentTask () { return this.getCurrentProject().getCurrentTask()},

  renderCurrentProject (title, color) {
    this.getCurrentProject().title = title
    this.getCurrentProject().color = color
  },
}

export default ToDoList