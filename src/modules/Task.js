const Task = {
  type: 'Task',
  projectID: -1,
  taskID: -1,
  title: '',
  description: '',
  dueDate: '',
  priority: 0,
  done: false,
  notes: '',
  checklists: [],

  setTask (title, description, dueDate, priority, done, notes) {
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.priority = priority
    this.done = done
    this.notes = notes
  },

  addChecklist (checklist) {
    if (checklist.type === 'Checklist') {
      checklist.projectID = this.projectID
      checklist.taskID = this.taskID
      checklist.checklistID = this.checklists.length
      this.checklists.push(checklist)
    } else {
      throw new Error('Object being passed is not of type "CheckListItem".')
    }
  },

  deleteChecklist (checklist) {
    this.checklists = this.checklists.filter((value, index) => {
      return index !== this.checklists.indexOf(checklist)
    })
  },

  getCurrentChecklist () {return this.checklists[this.currentChecklistID]},

  updateChecklist (checklist) {
    if (checklist.type === 'Checklist') {
      this.checklists[checklist.checklistID] = checklist
    } else {
      throw new Error('Object being passed is not of type "Task".')
    }
  },
}

export default Task