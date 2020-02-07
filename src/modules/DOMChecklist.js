import Checklist from './Checklist'

// Ad a new check list item
const addChecklistItem = (task, showSnackbar) => {
  let checklistTitle =
    document.getElementsByClassName('checklist-input')[0]
  checklistTitle.required = true
  // Check if user entered data into title field
  if (checklistTitle.value !== '') {
    const newChecklist = { ...Checklist }
    newChecklist.title = checklistTitle.value
    task.addChecklist(newChecklist)
    showAllChecklistItems(task)
    checklistTitle.required = false
    checklistTitle.value = ''
  } else {
    showSnackbar('Please enter a title', 'notice')
  }
}

// Delete a checklists item
const deleteChecklist = (task, doneCheckBox) => {
  const fullIDArray = extractChecklistIDNumbers(doneCheckBox.id)
  task.deleteChecklist(task.checklists[fullIDArray[2]])
  showAllChecklistItems(task)
}

// Populate checklists items in the task edit modal
const showAllChecklistItems = (task) => {
  document.getElementsByClassName('checklist-container')[0].innerHTML = ''
  task.checklists.map(checklist => showChecklist(checklist))
}

// Helper method. Shows an individual checklists item in the task edit modal
const showChecklist = (checklistItem) => {
  const checklistContainer =
    document.getElementsByClassName('checklist-container')[0]
  const newDiv = document.createElement('div')
  newDiv.className = 'checklist-item'
  const newCheckIcon = document.createElement('i')
  newCheckIcon.className = 'material-icons done-checkbox-small'
  newCheckIcon.id = `checklistDone-${checklistItem.projectID}-${checklistItem.taskID}-${checklistItem.checklistID}`
  newCheckIcon.textContent = checklistItem.getDone()
  const newSpan = document.createElement('span')
  newSpan.textContent = checklistItem.title
  const newDeleteIcon = document.createElement('i')
  newDeleteIcon.className = 'material-icons delete-icon'
  newDeleteIcon.id = `checklistDelete-${checklistItem.projectID}-${checklistItem.taskID}-${checklistItem.checklistID}`
  newDeleteIcon.textContent = 'delete_forever'
  newDiv.appendChild(newCheckIcon)
  newDiv.appendChild(newSpan)
  newDiv.appendChild(newDeleteIcon)
  checklistContainer.appendChild(newDiv)
}

const extractChecklistIDNumbers = (checkListIDName) => {
  const substrings = checkListIDName.split('-')
  return [
    parseInt(substrings[substrings.length - 3], 10),
    parseInt(substrings[substrings.length - 2], 10),
    parseInt(substrings[substrings.length - 1], 10),
  ]
}

const returnChecklist = (task, doneCheckBox) => {
  const fullIDArray = extractChecklistIDNumbers(doneCheckBox.id)
  return task.checklists[fullIDArray[2]]
}

// Toggle done status checkbox for a task
const toggleChecklistDone = (task, doneCheckBox) => {
  const checklist = returnChecklist(task, doneCheckBox)
  if (checklist.done) {
    checklist.done = false
    doneCheckBox.innerText = 'check_box_outline_blank'
  } else {
    checklist.done = true
    doneCheckBox.innerText = 'check_box'
  }
}

export {
  addChecklistItem,
  deleteChecklist,
  showAllChecklistItems,
  showChecklist,
  extractChecklistIDNumbers,
  returnChecklist,
  toggleChecklistDone
}