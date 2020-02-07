import Project from './Project'
import * as Storage from './Storage'
import { format } from 'date-fns'

// DOM manipulation for left column where project listings are.
// Remove user text from the project input box
const clearInput = () => {
  const elementsToClear = ['new-title-input', 'color-picker']
  elementsToClear.forEach((e) => document.getElementById(e).value = '')
  updateRectangleColor('white')
}

// Empty out list of tasks on right column
const clearTaskList = () => {
  document.getElementById('task-list').textContent = ''
}

// Hide the project editor
const closeEditor = (event) => {
  event.preventDefault()
  const projectEditor = document.querySelector('.project-editor')
  projectEditor.classList.remove('project-editor-border')
  projectEditor.style.maxHeight = '0'
  document.querySelector('.project-editor-rectangle').style.maxHeight = '0'
}

// Delete the current project
const deleteCurrentProject = (event, toDoList) => {
  event.preventDefault()
  toDoList.deleteThisProject()
  document.getElementById(`project-container-${toDoList.currentProjectID}`).
    remove()
  clearInput()
  closeEditor(event)
  showSnackbar('Project deleted', 'warning')
}

// Display individual task preview on right column
const displayTask = (task) => {
  const projectID = task.projectID
  const taskID = task.taskID
  const newChild = document.createElement('div')
  newChild.className = 'task-preview'
  newChild.id = `task-preview-${projectID}${taskID}`
  const textDiv = document.createElement('div')
  const element1 = document.createElement('span')
  element1.innerText = task.title
  textDiv.appendChild(element1)
  textDiv.className = 'task-preview-text'
  const element2 = document.createElement('span')
  element2.className = 'description-preview'
  if (task.dueDate !== ''
    && task.dueDate !== undefined && task.dueDate !== null) {
    element2.innerText = formatDueDate(task.dueDate)
  } else {
    element2.innerText = task.description
  }
  textDiv.appendChild(element2)
  newChild.appendChild(textDiv)
  const iconsDiv = document.createElement('div')
  iconsDiv.className = 'task-preview-icons'
  const element3 = document.createElement('i')
  element3.classList.add('material-icons', 'done-checkbox')
  element3.id = `done-${projectID}-${taskID}`
  element3.innerText = 'check_box_outline_blank'
  iconsDiv.appendChild(element3)
  for (let i = 1; i <= 5; i += 1) {
    const elementI = document.createElement('i')
    elementI.classList.add('material-icons', 'stars', `star${i}`)
    elementI.id = `star-${projectID}-${taskID}-${i}`
    elementI.innerText = 'star_border'
    iconsDiv.appendChild(elementI)
  }
  const element4 = document.createElement('i')
  element4.classList.add('material-icons', 'edit-task-pencil')
  element4.id = `pencil-${projectID}-${taskID}`
  element4.innerText = 'edit'
  iconsDiv.appendChild(element4)
  newChild.appendChild(iconsDiv)
  if (taskID === -1) {
    document.getElementById('task-list').prepend(newChild)
  } else {
    document.getElementById('task-list').appendChild(newChild)
  }
}

// Show tasks for each project on right column
const displayTaskList = (project) => {
  clearTaskList()
  selectProject(project)
  project.tasks.map(task => {displayTask(task)})
  updatePriority(project)
  renderDoneCheckboxes(project)
  updateTaskColor(project)
  enableAddTaskButton()
}

// Edit the current project
const editProject = (project) => {
  document.getElementById('save-project-button').value = 'Save'
  document.getElementById(
    'delete-project-button').style.visibility = 'visible'
  displayTaskList(project)
  showProjectEditor()
  populateInput(project)
}

const enableAddTaskButton = () => {
  const addContainer = document.getElementById('add-task-text')
  addContainer.classList.remove('disabledGrey', 'no-pointer-events')
  const addButton = document.getElementById('add-task-button')
  addButton.classList.remove('disabledGrey', 'no-pointer-events')
}

const formatDueDate = (rawDate) => {
  let newDate = rawDate.split('-')
  const formattedDate = format(
    new Date(newDate[0], newDate[1] - 1, newDate[2]),
    'MMMM d, yyyy')
  return `Due: ${formattedDate}`
}

// Hide the color palette
const hidePalette = () => {
  const projectEditor = document.querySelector('.project-editor')
  projectEditor.style.maxHeight = '143px'
  const editorRectangle = document.querySelector('.project-editor-rectangle')
  editorRectangle.style.maxHeight = '136px'
  const buttons = document.querySelector('.buttons')
  buttons.style.marginTop = '0'
  document.getElementById('color-palette').style.display = 'none'
}

// Hide the project editor
const hideProjectEditor = () => {
  const projectEditor = document.querySelector('.project-editor')
  projectEditor.classList.remove('project-editor-border')
  projectEditor.style.maxHeight = '0'
  document.querySelector('.project-editor-rectangle').style.maxHeight = '0'
}

// Select a project on left column
const selectProject = (project) => {
  if (project) {
    document.getElementById('show-all-tasks').
      classList.
      remove('project-list-selected')
    document.querySelectorAll('.project-list').
      forEach((e) => { e.classList.remove('project-list-selected') })
    document.getElementById(`project-container-${project.projectID}`).
      classList.
      add('project-list-selected')
  } else {
    console.log('selectProject: No project found')
  }
}

// Display individual project title on left column
const showCurrentProject = (project) => {
  const projectID = project.projectID
  const newChild = document.createElement('div')
  newChild.className = 'project-list'
  newChild.id = `project-container-${projectID}`
  const element1 = document.createElement('div')
  element1.className = 'project-color-rectangle'
  element1.style.backgroundColor = project.color
  element1.id = `edit-color-${projectID}`
  newChild.appendChild(element1)
  const element2 = document.createElement('div')
  element2.className = 'project-title-container'
  newChild.appendChild(element2)
  const element3 = document.createElement('span')
  element3.className = 'project-title'
  element3.id = `project-title-${projectID}`
  element3.innerText = project.title
  element2.appendChild(element3)
  const element4 = document.createElement('i')
  element4.classList.add('material-icons', 'edit-project-pencil')
  element4.id = `edit-project-pencil-${projectID}`
  element4.innerText = 'edit'
  newChild.appendChild(element4)
  document.getElementById('project-list-container').appendChild(newChild)
}

// Fill add a project input with values from project
const populateInput = (project) => {
  document.getElementById('new-title-input').value = project.title
  document.getElementById('color-picker').value = project.color
  updateRectangleColor(project.color)
}

// Show project editor on top of left column
const showProjectEditor = () => {
  const projectEditor = document.querySelector('.project-editor')
  projectEditor.classList.add('project-editor-border')
  projectEditor.style.maxHeight = '143px'
  document.querySelector(
    '.project-editor-rectangle').style.maxHeight = '136px'
}

const renderDoneCheckboxes = (project) => {
  project.tasks.map(task => {
    if (task.done) {
      document.getElementById(
        `done-${project.projectID}-${task.taskID}`).innerText = 'check_box'
    }
  })
}

// Display projects on left column
const renderProjects = (projects) => {
  document.getElementById('project-list-container').innerHTML = ''
  projects.map((project) => {showCurrentProject(project)})
}

// Add new project or save current one
const saveProject = (event, toDoList) => {
  event.preventDefault()
  let title = document.getElementById('new-title-input')
  title.required = true
  if (title.value !== '') {
    const color = document.getElementById('color-picker').value
    const isNewProject =
      (document.getElementById('save-project-button').value === 'Add')
    if (isNewProject) {
      const newProject = Object.assign({}, { ...Project },
        JSON.parse(JSON.stringify(Project)),
      )
      newProject.setProject(title.value, color)
      toDoList.addProject(newProject)
    } else {
      toDoList.renderCurrentProject(title.value, color)
    }
    renderProjects(toDoList.projects)
    clearInput()
    closeEditor(event)
    title.required = false
    // StorageController.save(toDoList)
    showSnackbar('Project saved')
  } else {
    showSnackbar('Please enter a title', 'notice')
  }
  Storage.setLocalStorage(toDoList)
}

// Highlight the "Show All Tasks" menu item
const selectShowAllTasks = () => {
  document.querySelectorAll('.project-list').
    forEach((e) => { e.classList.remove('project-list-selected') })
  document.getElementById('show-all-tasks').
    classList.
    add('project-list-selected')
}

// Display tasks from all projects
const showAllTasks = (toDoList, closeTaskEditor, project) => {
  // Close add new task edit modal if it's open before showing all tasks
  closeTaskEditor(project)
  toDoList.currentProjectID = -1
  selectShowAllTasks()
  clearTaskList()
  toDoList.projects.map(project => {
    project.tasks.map(task => {
      displayTask(task)
    })
    updatePriority(project)
    renderDoneCheckboxes(project)
    updateTaskColor(project)
  })
}

// Display individual project title on left column
const showAProject = (project) => {
  const projectID = project.projectID
  const newChild = document.createElement('div')
  newChild.className = 'project-list'
  newChild.id = `project-container-${projectID}`
  const element1 = document.createElement('div')
  element1.className = 'project-color-rectangle'
  element1.style.backgroundColor = project.color
  element1.id = `edit-color-${projectID}`
  newChild.appendChild(element1)
  const element2 = document.createElement('div')
  element2.className = 'project-title-container'
  newChild.appendChild(element2)
  const element3 = document.createElement('span')
  element3.className = 'project-title'
  element3.id = `project-title-${projectID}`
  element3.innerText = project.title
  element2.appendChild(element3)
  const element4 = document.createElement('i')
  element4.classList.add('material-icons', 'edit-project-pencil')
  element4.id = `edit-project-pencil-${projectID}`
  element4.innerText = 'edit'
  newChild.appendChild(element4)
  document.getElementById('project-list-container').appendChild(newChild)
}

// Display color palette for picking color code
const showPalette = () => {
  const colorPalette = document.getElementById('color-palette')
  colorPalette.style.display = 'block'
  const projectEditor = document.querySelector('.project-editor')
  projectEditor.style.maxHeight = '373px'
  const editorRectangle = document.querySelector('.project-editor-rectangle')
  editorRectangle.style.maxHeight = '366px'
}

// Get projects from toDoList and display project titles on left column
const showProjects = (projects) => {
  document.getElementById('project-list-container').innerHTML = ''
  projects.map(project => {showAProject(project)})
}

// Show toast message
const showSnackbar = (message, type) => {
  const snackbar = document.querySelector('.snackbar')
  snackbar.textContent = message
  if (type === 'notice') snackbar.style.backgroundColor = '#ecd345'
  snackbar.classList.add('show-snackbar')
  if (type === 'warning') snackbar.style.backgroundColor = '#eb681c'
  snackbar.classList.add('show-snackbar')
  setTimeout(() => {snackbar.classList.remove('show-snackbar')}, 1000)
}

// Show and hide the add project modal
const toggleProjectModal = () => {
  document.getElementById('save-project-button').value = 'Add'
  document.getElementById('delete-project-button').style.visibility = 'hidden'
  const projectEditor = document.querySelector('.project-editor')
  if (projectEditor.classList.contains('project-editor-border')) {
    hideProjectEditor()
  } else {
    showProjectEditor()
  }
}

// Highlight 5-star rating scale with task priority
const updatePriority = (project) => {
  project.tasks.map(task => {
    const priority = parseInt(task.priority, 10)
    for (let i = 1; i <= 5; i += 1) {
      const star = document.getElementById(
        `star-${project.projectID}-${task.taskID}-${i}`)
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

// Update color of rectangle next to project
const updateRectangleColor = (color) => {
  document.querySelector('.project-editor-rectangle',
  ).style.backgroundColor = document.getElementById('color-picker').value
}

const updateTaskColor = (project) => {
  project.tasks.map(task => {
    document.getElementById(
      `task-preview-${project.projectID}${task.taskID}`).style.borderColor = project.color
  })
}

export {
  clearInput,
  clearTaskList,
  closeEditor,
  deleteCurrentProject,
  displayTask,
  displayTaskList,
  editProject,
  enableAddTaskButton,
  formatDueDate,
  hidePalette,
  hideProjectEditor,
  selectProject,
  showCurrentProject,
  populateInput,
  showProjectEditor,
  renderDoneCheckboxes,
  renderProjects,
  saveProject,
  selectShowAllTasks,
  showAllTasks,
  showAProject,
  showPalette,
  showProjects,
  showSnackbar,
  toggleProjectModal,
  updatePriority,
  updateRectangleColor,
  updateTaskColor,
}




















