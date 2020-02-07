import ColorPalette from './ColorPalette'
import * as DOMProject from './DOMProject'
import * as DOMChecklist from './DOMChecklist'
import * as DOMTask from './DOMTask'
import { deleteData, resetData, setLocalStorage } from './Storage'

const extractProjectID = (elementName) => {
  const substrings = elementName.split('-')
  if (isNumber(substrings[1])) {
    return parseInt(substrings[substrings.length - 1], 10)
  }
  return parseInt(`${substrings[1]}`, 10)
}

const extractTargetID = (elementName) => {
  const substrings = elementName.split('-')
  if (substrings[0] === 'pencil'
    || substrings[0] === 'star'
    || substrings[0] === 'done'
    || substrings[0] === 'addChecklistItem'
    || substrings[0] === 'saveTaskBtn'
    || substrings[0] === 'cancelTaskBtn'
    || substrings[0] === 'deleteTaskBtn'
    || substrings[0] === 'checklistDelete'
    || substrings[0] === 'checklistDone') {
    return substrings[0]
  }
  if (isNumber(substrings[substrings.length - 1])) {
    return elementName
  }
  return substrings.slice(0, substrings.length - 1).join('-')
}

const extractTaskID = (elementName) => {
  const substrings = elementName.split('-')
  return parseInt(`${substrings[2]}`, 10)
}

const isNumber = (value) => Number.isNaN(parseInt(value, 10))

// Sets current projectID and returns the current project
const updateCurrentProject = (event, toDoList) => {
  toDoList.currentProjectID = extractProjectID(event.target.id)
  return toDoList.getCurrentProject()
}

// Sets current taskID and returns the current task
const updateCurrentTask = (toDoList, event) => {
  try {
    toDoList.getCurrentProject().currentTaskID = extractTaskID(
      event.target.id)
    return toDoList.getCurrentTask()
  } catch (e) {
    console.log('catch updateCurrentTask: Setting current task by event id: ' +
      extractTaskID(event.target.id))
    return extractTaskID(event.target.id)
  }
}

const listenForClick = (toDoList) => {
  document.addEventListener('click', event => {
    const clippedTargetID = extractTargetID(event.target.id)
    switch (clippedTargetID) {
      // --------- Click events for left column (projects) ----------
      case 'add-project-button':
      case 'add-project-text':
        DOMProject.toggleProjectModal()
        break
      case 'cancel-project-button':
        DOMProject.closeEditor(event)
        DOMProject.clearInput()
        break
      case 'close-color-palette':
        DOMProject.updateRectangleColor()
        DOMProject.hidePalette()
        break
      case 'color-option':
        DOMProject.updateRectangleColor(ColorPalette(event))
        DOMProject.hidePalette()
        break
      case 'color-picker':
        DOMProject.showPalette()
        break
      case 'delete-project-button':
        DOMProject.deleteCurrentProject(event, toDoList)
        break
      case 'edit-project-pencil':
        DOMProject.editProject(updateCurrentProject(event, toDoList))
        break
      case 'project-title':
        DOMProject.displayTaskList(updateCurrentProject(event, toDoList))
        break
      case 'save-project-button':
        DOMProject.saveProject(event, toDoList)
        break
      case 'show-all-tasks':
      case 'show-all-tasks-btn':
        DOMProject.showAllTasks(toDoList, DOMTask.closeTaskEditor,
          toDoList.getCurrentProject())
        break
      // --------- Click events for right column (tasks) ----------
      case 'add-task-text':
      case 'add-task-button':
        DOMTask.displayAddTaskList(toDoList, DOMProject.showSnackbar, event,
          DOMChecklist)
        break
      // Close out of the task edit modal
      case 'cancelTaskBtn':
        DOMTask.closeTaskEditor(
          toDoList.projects[extractProjectID(
            event.target.id)], extractTaskID(event.target.id))
        break
      // Event handler for delete button clicks
      case 'deleteTaskBtn':
        DOMTask.deleteCurrentTask(
          toDoList.projects[extractProjectID(
            event.target.id)], DOMProject.showSnackbar)
        break
      // Event handler for task done checkbox
      case 'done':
        DOMTask.toggleDoneCheckbox(toDoList.projects[extractProjectID(
          event.target.id)].tasks[extractTaskID(
          event.target.id)], event.target)
        setLocalStorage(toDoList)
        break
      // Event handler for clicks on edit pencil icon for a task
      case 'pencil':
        updateCurrentProject(event, toDoList)
        DOMTask.showTask(updateCurrentTask(toDoList, event), toDoList.projects,
          DOMChecklist)
        break
      // Remove both sample and user data
      case 'reset-to-empty-list':
        deleteData(toDoList)
        DOMProject.showProjects(toDoList.projects)
        DOMProject.clearTaskList()
        DOMProject.clearInput()
        DOMTask.showSettingsRemoveAElements()
        DOMProject.showSnackbar('All data cleared', 'warning')
        break
      // Reset toDoList data to sample data
      case 'reset-to-sample-data':
        resetData(toDoList)
        DOMProject.showProjects(toDoList.projects)
        DOMTask.showSettingsRemoveAElements()
        document.getElementById('show-all-tasks').click()
        document.getElementById('pencil-0-0').click()
        DOMProject.showSnackbar('Sample data loaded', 'warning')
        break
      // Save task when Save button is clicked
      case 'saveTaskBtn':
        DOMTask.saveTask(toDoList, DOMProject.displayTaskList,
          setLocalStorage, DOMProject.showSnackbar)
        break
      // Show settings menu
      case 'settings':
        DOMTask.showSettings()
        break
      case 'star':
        DOMTask.updateStar(toDoList.projects[extractProjectID(
          event.target.id)].tasks, event.target.id)
        setLocalStorage(toDoList)
        break
      case 'task-edit-form':
        DOMTask.showSettingsAnimation()
        break
      // --------- Click events for checklists ----------
      // Add a new check list item
      case 'addChecklistItem':
        DOMChecklist.addChecklistItem(
          toDoList.projects[extractProjectID(
            event.target.id)].getCurrentTask(), DOMProject.showSnackbar)
        setLocalStorage(toDoList)
        break
      // Delete a checklists item
      case 'checklistDelete':
        DOMChecklist.deleteChecklist(
          toDoList.projects[extractProjectID(
            event.target.id)].getCurrentTask(), event.target)
        setLocalStorage(toDoList)
        break
      // Event handler for checklists done checkbox
      case 'checklistDone':
        DOMChecklist.toggleChecklistDone(
          toDoList.projects[extractProjectID(
            event.target.id)].getCurrentTask(), event.target, setLocalStorage)
        setLocalStorage(toDoList)
        break
      default:
        console.log(`uncaught click event: ${event.target.toString()
        } Class: ${event.target.classList} ID: ${event.target.id}`)
    }
  })
}

export {
  extractProjectID,
  extractTargetID,
  extractTaskID,
  isNumber,
  updateCurrentProject,
  updateCurrentTask,
  listenForClick,
}
