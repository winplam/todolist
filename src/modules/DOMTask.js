import Task from './Task'

// DOM manipulation for the right/main section of the page. Mainly tasks listings.
// HTML fragment for the drop down edit task modal
const createFragment = (task) => {
  return document.createRange().createContextualFragment(`
            <div class="task-edit-form" id="task-edit-form-${task.projectID}${task.taskID}">
                <form class="task-form">
                    <label id="project-label" for="project-menu" style="grid-row-start: 1">Project</label>
                    <div class="simulate-underline" style="grid-row-start: 1;grid-column-start: 3">
                        <select id="project-menu" name="project-menu"></select>
                    </div>
                    <label for="title-input" style="grid-row-start: 2">Title</label>
                    <input class="task-edit-input" type="text" id="title-input" name="title-name" placeholder="Title"
                           maxlength="35" style="grid-row-start: 2; grid-column-start: 3" required>
                    <label for="description-input" style="grid-row-start: 3">Description</label>
                    <input class="task-edit-input" type="text" id="description-input" name="description-name"
                           placeholder="Description" maxlength="50" style="grid-row-start: 3; grid-column-start: 3">
                    <label for="due-date-input" style="grid-row-start: 4">Due Date</label>
                    <input class="task-edit-input" type="date" id="due-date-input" name="due-date-name"
                           placeholder="mm/dd/yy" style="grid-row-start: 4; grid-column-start: 3">
                    <label for="notes-input" style="grid-row-start: 5">Notes</label>
                    <textarea id="notes-input" name="notes-name" placeholder="Notes"></textarea>
                    <div class="task-edit-buttons">
                        <input type="submit" class="buttons" id="saveTaskBtn-${task.projectID}-${task.taskID}" value="Save">
                        <button class="buttons" id="cancelTaskBtn-${task.projectID}-${task.taskID}">Cancel</button>
                        <button class="buttons" data-button="delete" id="deleteTaskBtn-${task.projectID}-${task.taskID}">Delete</button>
                    </div>
                </form>
                <div class="checklist-form">
                    <label type="checklist-input">Checklist</label>
                    <div class="add-checklist-container">
                        <input class="checklist-input" placeholder="Add checklist item" required>
                        <input type="submit" class="add-checklist"
                               id="addChecklistItem-${task.projectID}-${task.taskID}" value="&#43;">
                    </div>
                    <div class="checklist-container">
                    </div>
                </div>
            </div>
`)
}

// Populate the project drop down selector in task edit modal with project titles
const addProjectsToSelector = (project, currentProjectID) => {
  const selectMenu = document.getElementById('project-menu')
  const newChild = document.createElement('option')
  newChild.value = project.projectID
  newChild.innerText = project.title
  if (currentProjectID === project.projectID) {
    newChild.selected = true
  }
  if (selectMenu) selectMenu.appendChild(newChild)
}

// Remove the task edit drop down modal
const closeTaskEditor = (project) => {
  const taskEditor = document.querySelector('.task-edit-form')
  // parentNode and classList not found when clicking on show all tasks list
  try {
    taskEditor.parentNode.removeChild(taskEditor)
    document.querySelector('.task-edit').classList.remove('task-edit')
  } catch (e) {}
  enableAddTaskButton(project)
  const checkTaskIDToEdit = project.currentTaskID
  if (checkTaskIDToEdit === project.tasks.length) {
    deleteStaleTaskPreview(project.projectID, project.tasks.length)
  }
  try {
    enableTaskEditPencil(project.getCurrentTask())
  } catch (e) {}
}

// Delete a task item
const deleteCurrentTask = (project, showSnackbar) => {
  const task = project.getCurrentTask()
  document.getElementById(`task-edit-form-${task.projectID}${task.taskID}`).
    remove()
  deleteUnsavedTaskPreview(task)
  project.deleteTask(task.taskID)
  enableAddTaskButton(project)
  showSnackbar('Task deleted', 'warning')
}

// Remove task preview that are no longer valid
const deleteStaleTaskPreview = (projectID, tasksLength) => {
  try {
    document.getElementById(`task-preview-${projectID}${tasksLength}`).remove()
  } catch (e) {}
}

// Remove task preview modal for new unsaved task
const deleteUnsavedTaskPreview = (task) => {
  document.getElementById(`task-preview-${task.projectID}${task.taskID}`).
    remove()
}

// Disable the add task button
const disableAddTaskButton = () => {
  const addContainer = document.getElementById('add-task-text')
  addContainer.classList.add('disabledGrey', 'no-pointer-events')
  const addButton = document.getElementById('add-task-button')
  addButton.classList.add('disabledGrey', 'no-pointer-events')
}

// Gray out task edit pencil icon when not needed
const disableTaskEditPencil = (task) => {
  const pencil = document.getElementById(
    `pencil-${task.projectID}-${task.taskID}`)
  pencil.classList.remove('edit-task-pencil')
  pencil.classList.add('edit-task-pencil-disabled')
}

// Show the add new task modal
const displayAddTaskList = (toDoList, showSnackbar, event, DOMChecklist) => {
  const currentProject = toDoList.getCurrentProject()
  if (currentProject) {
    currentProject.editingTask = true
    const projects = toDoList.projects
    const newTask = Object.assign({}, { ...Task },
      JSON.parse(JSON.stringify(Task)))
    newTask.setTask('Add New Task', '')
    newTask.projectID = currentProject.projectID
    newTask.taskID = currentProject.tasks.length
    currentProject.currentTaskID = currentProject.tasks.length
    disableAddTaskButton()
    displayIndividualTask(toDoList, newTask)
    showTask(newTask, projects, DOMChecklist)
  } else {
    showSnackbar('Please select a project first', 'notice')
  }
}

// Show a task
const displayIndividualTask = (toDoList, task) => {
  const projectID = task.projectID
  const taskID = task.taskID
  const newChild = document.createElement('div')
  newChild.className = 'task-preview'
  newChild.id = `task-preview-${projectID}${taskID}`
  const textDiv = document.createElement('div')
  const element1 = document.createElement('span')
  element1.innerText = task.title
  textDiv.appendChild(element1)
  const element2 = document.createElement('span')
  element2.className = 'description-preview'
  element2.innerText = task.description
  textDiv.appendChild(element2)
  newChild.appendChild(textDiv)
  // Run if adding new task
  if (taskID === toDoList.getCurrentProject().tasks.length) {
    document.getElementById('task-list').prepend(newChild)
  } else {
    const element3 = document.createElement('i')
    element3.classList.add('material-icons', 'done-checkbox')
    element3.id = `done-${projectID}-${taskID}`
    element3.innerText = 'check_box_outline_blank'
    newChild.appendChild(element3)
    for (let i = 1; i <= 5; i += 1) {
      const elementI = document.createElement('i')
      elementI.classList.add('material-icons', 'stars', `star${i}`)
      elementI.id = `star-${projectID}-${taskID}-${i}`
      elementI.innerText = 'star_border'
      newChild.appendChild(elementI)
    }
    const element4 = document.createElement('i')
    element4.classList.add('material-icons', 'edit-task-pencil')
    element4.id = `pencil-${projectID}-${taskID}`
    element4.innerText = 'edit'
    newChild.appendChild(element4)
    document.getElementById('task-list').appendChild(newChild)
  }
}

// Enable the task edit pencil icon when needed again
const enableAddTaskButton = (currentProject) => {
  const addContainer = document.getElementById('add-task-text')
  addContainer.classList.remove('disabledGrey', 'no-pointer-events')
  const addButton = document.getElementById('add-task-button')
  addButton.classList.remove('disabledGrey', 'no-pointer-events')
  try {
    currentProject.editingTask = false
  } catch (e) {}
}

// Enabled pencil icon for editing a task
const enableTaskEditPencil = (task) => {
  const pencil = document.getElementById(
    `pencil-${task.projectID}-${task.taskID}`)
  pencil.classList.remove('edit-task-pencil-disabled')
  pencil.classList.add('edit-task-pencil')
}

// Populate the task edit modal with values for the current task
const fillTaskEditPane = (task) => {
  if (task.title) document.getElementById('title-input').value = task.title
  if (task.description) document.getElementById(
    'description-input').value = task.description
  if (task.dueDate) {
    let date = new Date(task.dueDate).toISOString().substring(0, 10)
    document.getElementById('due-date-input').value = date
  }
  if (task.notes) document.getElementById('notes-input').value = task.notes
}

// Save a task
const saveTask = (toDoList, displayTaskList, setLocalStorage, showSnackbar) => {
  const project = toDoList.getCurrentProject()
  const projectID = project.projectID
  const task = project.getCurrentTask()
  const projectSelected = parseInt(
    document.getElementById('project-menu').value)
  let title = document.getElementById('title-input').value
  if (title !== '') {
    const description = document.getElementById('description-input').value
    const dueDate = document.getElementById('due-date-input').value
    let priority = 0
    try {
      if (task.priority) priority = task.priority
    } catch (e) {}
    let done = false
    try {
      if (task.done) done = task.done
    } catch (e) {}
    const notes = document.getElementById('notes-input').value
    if ((projectSelected === projectID) && project.getCurrentTask()) {
      // Add new task (or move current task)
      project.updateCurrentTask(title, description, dueDate, priority, done,
        notes)
    } else {
      // Move task (add "new task" and delete current one)
      let movingTask
      if (project.getCurrentTask()) movingTask = true
      const newTask = Object.assign({}, { ...Task },
        JSON.parse(JSON.stringify(Task)))
      newTask.setTask(title, description, dueDate, priority, done, notes)
      toDoList.projects[projectSelected].addTask(newTask)
      // Delete current task if moving to new project
      if (movingTask) project.deleteTask(task.taskID)
    }
    closeTaskEditor(project)
    displayTaskList(project)
    showSnackbar('Task saved')
  } else {
    showSnackbar('Please enter a title', 'notice')
  }
  setLocalStorage(toDoList)
}

// Show the settings menu
const showSettings = () => {
  showSettingsCreateAElements()
  const menu = document.getElementsByClassName('settings-dropdown')[0]
  menu.classList.toggle('show-dropdown')
  showSettingsAddLogoFix()
  // Close the dropdown menu if the user clicks outside of it
  const removeDropDown = (event) => {
    if (!event.target.matches('.banner-settings')) {
      menu.classList.remove('show-dropdown')
      window.removeEventListener('click', removeDropDown)
      showSettingsRemoveAElements()
      showSettingsRemoveLogoFix()
    }
  }
  window.addEventListener('click', removeDropDown)
}

// Add CSS adjustment to top left banner logo to keep it centered vertically
const showSettingsAddLogoFix = () => {
  document.getElementsByClassName('top-banner-left')[0].
    classList.add('top-banner-left-adjust')
}

// Remove CSS adjustment to top left banner logo to keep it centered vertically
const showSettingsRemoveLogoFix = () => {
  document.getElementsByClassName('top-banner-left')[0].
    classList.remove('top-banner-left-adjust')
}

// Create the A elements dynamically after clicking on settings
// To prevent "Add task" click events from being hidden
const showSettingsCreateAElements = () => {
  const settingsDropdown = document.getElementsByClassName(
    'settings-dropdown')[0]
  // Only create A tags if settingsDropdown doesn't have them
  if (settingsDropdown.childNodes.length < 2) {
    const newChild1 = document.createElement('a')
    newChild1.href = '#'
    newChild1.id = 'reset-to-sample-data'
    newChild1.textContent = 'Reset to sample data'
    settingsDropdown.appendChild(newChild1)
    const newChild2 = document.createElement('a')
    newChild2.href = '#'
    newChild2.id = 'reset-to-empty-list'
    newChild2.textContent = 'Reset to empty list'
    settingsDropdown.appendChild(newChild2)
  }
}

const showSettingsRemoveAElements = () => {
  const settingsDropdown = document.getElementsByClassName(
    'settings-dropdown')[0]
  while (settingsDropdown.hasChildNodes()) {
    settingsDropdown.removeChild(settingsDropdown.firstChild)
  }
}

// Display the task edit modal
const showTask = (task, projects, DOMChecklist) => {
  const projectID = task.projectID
  const taskID = task.taskID
  showTaskRemovePreviousForm()
  showTaskDisplayEditTaskModal(projects, task, projectID, taskID)
  showTaskAddingTask(projects, task, projectID, taskID)
  showTaskEditingTask(projects, task, projectID, taskID, DOMChecklist)
  // Simulate click on form to animate modal opening
  document.getElementsByClassName('task-edit-form')[0].click()
}

const showTaskRemovePreviousForm = () => {
  // anyEditForm is the edit modal that is currently being displayed
  const anyEditForm = document.querySelector('.task-edit-form')
  // Remove the old modal if edit pencil for another modal is selected
  if (anyEditForm !== null) {
    // Remove white background from task preview making it gray again
    document.querySelector('.task-edit').classList.remove('task-edit')
    try {
      // Make edit pencil active again after it's deselected
      document.querySelector('.edit-task-pencil-disabled').
        classList.
        add('edit-task-pencil')
      document.querySelector('.edit-task-pencil-disabled').
        classList.
        remove('edit-task-pencil-disabled')
    } catch (e) {}
    anyEditForm.parentNode.removeChild(anyEditForm)
    // removeTaskEditModal(anyEditForm)
  }
}

const showTaskDisplayEditTaskModal = (projects, task, projectID, taskID) => {
  // Display the edit task modal under the correct task preview bar
  let currentEditForm = document.getElementById(
    `task-edit-form-${projectID}${taskID}`)
  if (currentEditForm === null) {
    const taskPreview = document.getElementById(
      `task-preview-${projectID}${taskID}`)
    if (taskPreview) {
      taskPreview.classList.add('task-edit')
      const fragment = createFragment(task)
      taskPreview.parentNode.insertBefore(fragment, taskPreview.nextSibling)
    }
    projects.map(
      project => {
        addProjectsToSelector(project, task.projectID)
      })
  }
}

const showTaskAddingTask = (projects, task, projectID, taskID) => {
  // Check if adding a new task (or editing a current one)
  let currentEditForm = document.getElementById(
    `task-edit-form-${projectID}${taskID}`)
  const tasksLength = projects[task.projectID].tasks.length
  // Check if taskID matches taskID of new task or current one
  if (taskID === tasksLength) {
    // Hide project select and checklists input when adding new task
    document.getElementsByClassName('checklist-form')[0].style.display = 'none'
    document.getElementById('project-label').style.display = 'none'
    document.getElementsByClassName(
      'simulate-underline')[0].style.display = 'none'
    // Remove project selection when adding new task
    const taskEditForm = document.getElementsByClassName('task-edit-form')[0]
    taskEditForm.setAttribute('style', 'grid-template-rows: 240px 1fr')
    const taskForm = document.getElementsByClassName('task-form')[0]
    taskForm.setAttribute('style',
      'grid-template-rows: 1px repeat(3, 28px) 107px 45px')
    // Hide delete button
    document.querySelectorAll(
      '[data-button="delete"]')[0].style.display = 'none'
  }
}

const showTaskEditingTask = (
  projects, task, projectID, taskID, DOMChecklist) => {

  // Check if adding a new task (or editing a current one)
  let currentEditForm = document.getElementById(
    `task-edit-form-${projectID}${taskID}`)
  const tasksLength = projects[task.projectID].tasks.length
  // Check if taskID matches taskID of new task or current one
  if (taskID !== tasksLength) {
    // Run methods that only apply when opening the edit task modal
    currentEditForm = document.getElementById(
      `task-edit-form-${projectID}${taskID}`)
    currentEditForm.style.borderColor = projects[task.projectID].color
    fillTaskEditPane(task)
    DOMChecklist.showAllChecklistItems(task)
    disableTaskEditPencil(task)
    enableAddTaskButton(projects[projectID])
    deleteStaleTaskPreview(projectID, tasksLength)
  }
}

const removeTaskEditModal = (elementToRemove) => {
  //* 1. This section is executed first first
  const idToRemove = elementToRemove.id
  document.getElementById(idToRemove).style.maxHeight = '0'
  removeTaskEditModalCallback(() => {
    //* 3. This section is executed first third
  }, idToRemove)
}

const removeTaskEditModalCallback = (callback, idToRemove) => {
  //* 2. This section is executed first second
  setTimeout(function () {
    //* 4. This section is executed fourth
    const elementToRemove = document.getElementById(idToRemove)
    elementToRemove.parentNode.removeChild(elementToRemove)
    showSettingsAnimation()
  }, 500)
  callback()
}

// Animate modal opening with help of CSS transition
const showSettingsAnimation = () => {
  document.querySelector('.task-edit-form').style.maxHeight = '5000px'
}

// Toggle done status checkbox for a task
const toggleDoneCheckbox = (task, doneCheckBox) => {
  if (task.done) {
    task.done = false
    doneCheckBox.innerText = 'check_box_outline_blank'
  } else {
    task.done = true
    doneCheckBox.innerText = 'check_box'
  }
}

// Refresh display of priority start icons for a project
const updatePriorityStars = (tasks) => {
  tasks.map(task => {
    const priority = parseInt(task.priority, 10)
    for (let i = 1; i <= 5; i += 1) {
      const star = document.getElementById(
        `star-${task.projectID}-${task.taskID}-${i}`)
      star.innerText = 'star_border'
      if (priority / 2 >= i) {
        star.innerText = 'star'
      } else if (priority % 2 === 1 && priority / 2 < i) {
        star.innerText = 'star_half'
        break
      }
    }
  })
}

// Update the priority start icons when clicked on
const updateStar = (tasks, eventID) => {
  const starLocation = eventID.split('-')
  const taskID = parseInt(starLocation[2], 10)
  const starID = parseInt(starLocation[3], 10)
  const currentStar = document.getElementById(eventID)
  let newPriority
  switch (currentStar.innerText) {
    case 'star_half':
      newPriority = 2 * starID
      break
    case 'star_border':
      newPriority = 2 * starID - 1
      break
    case 'star':
      newPriority = 2 * starID - 2
      break
    default:
  }
  tasks[taskID].priority = newPriority
  updatePriorityStars(tasks)
}

export {
  createFragment,
  addProjectsToSelector,
  closeTaskEditor,
  deleteCurrentTask,
  deleteStaleTaskPreview,
  deleteUnsavedTaskPreview,
  disableAddTaskButton,
  disableTaskEditPencil,
  displayAddTaskList,
  displayIndividualTask,
  enableAddTaskButton,
  enableTaskEditPencil,
  fillTaskEditPane,
  saveTask,
  showSettings,
  showTask,
  showTaskRemovePreviousForm,
  showTaskDisplayEditTaskModal,
  showTaskAddingTask,
  removeTaskEditModal,
  showSettingsAnimation,
  showSettingsRemoveAElements,
  toggleDoneCheckbox,
  updatePriorityStars,
  updateStar,
}