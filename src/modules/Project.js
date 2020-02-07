const Project = {
  type: 'Project',
  projectID: -1,
  taskID: -1,
  title: '',
  color: 'white',
  tasks: [],
  currentTaskID: -1,
  editingTask: false,

  setProject (title, color) {
    this.title = title
    this.color = color
  },

  addTask (task) {
    if (task.type === 'Task') {
      task.projectID = this.projectID
      task.taskID = this.tasks.length
      this.tasks.push(task)
    } else {
      throw new Error('Object being passed is not of type "Task".')
    }
  },

  getCurrentTask () {return this.tasks[this.currentTaskID]},

  updateCurrentTask (title, description, dueDate, priority, done, notes) {
    this.getCurrentTask().title = title
    this.getCurrentTask().description = description
    this.getCurrentTask().dueDate = dueDate
    this.getCurrentTask().priority = priority
    this.getCurrentTask().done = done
    this.getCurrentTask().notes = notes
  },

  deleteTask (taskID) {delete this.tasks[taskID]},
}

export default Project
