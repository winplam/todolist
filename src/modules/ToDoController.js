import * as EventListener from './EventListener'
import ToDoList from './ToDoList'
import { loadData } from './Storage'
import * as DOMProject from './DOMProject'

// Initialize the To Do List
const ToDoController = () => {
  const toDoList = ToDoList
  // Load data from sample or from local storage
  loadData(toDoList)
  // Listen for click events and pass on exports
  // EventListener.listenForClick(toDoList, DOMProject, DOMTask, DOMChecklist, deleteData, resetData, setLocalStorage)
  EventListener.listenForClick(toDoList, DOMProject)
  // Show projects on left column
  DOMProject.showProjects(toDoList.projects)
}

export default ToDoController