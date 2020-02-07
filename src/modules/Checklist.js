const Checklist = {
  type: 'Checklist',
  projectID: -1,
  taskID: -1,
  checklistID: -1,
  title: '',
  done: false,

  getDone () {
    if (this.done) {
      return 'check_box'
    } else {
      return 'check_box_outline_blank'
    }
  },
}

export default Checklist