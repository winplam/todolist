import Checklist from './Checklist'
import Project from './Project'
import SampleData from './SampleData'
import Task from './Task'

// Erase both user data and remove sample data
function deleteData (projectsIn) {
  projectsIn.projects = []
  localStorage.clear()
  setLocalStorage(projectsIn)
}

// Load data from sample or from local storage
function loadData (projectsIn) {
  if (localStorage.getItem('to-do-list') !== null) {
    loadLocalStorage(projectsIn)
    console.log('Loaded data from local storage')
  } else {
    // Load sample data from JS file and add project box with "pre-typed" info
    SampleData(projectsIn)
    console.log('Sample data loaded')
  }
}

// Erase user data and reset to sample!!!
function resetData (projectsIn) {
  projectsIn.projects = []
  localStorage.clear()
  loadData(projectsIn)
}

// Convert data to text and save to local storage
function setLocalStorage (projectsIn) {
  const projects = []
  //*** ---------- BEGIN: Project Loop --------- ***//
  for (let i = 0; i < projectsIn.projects.length; i += 1) {
    const project = {
      title: projectsIn.projects[i].title,
      color: projectsIn.projects[i].color,
      tasks: [],
    }
    //** ---------- BEGIN: Task Loop --------- **//
    for (let j = 0; j < projectsIn.projects[i].tasks.length; j += 1) {
      const currentTask = projectsIn.projects[i].tasks[j]
      const task = {
        title: currentTask.title,
        description: currentTask.description,
        dueDate: currentTask.dueDate,
        priority: currentTask.priority,
        done: currentTask.done,
        notes: currentTask.notes,
        checklists: [],
      }
      //* ---------- BEGIN: Checklist Loop --------- *//
      for (let k = 0; k <
      projectsIn.projects[i].tasks[j].checklists.length; k += 1) {
        const checklist = projectsIn.projects[i].tasks[j].checklists[k]
        task.checklists.push(checklist)
      }
      //* ------------ END: Checklist Loop --------- *//
      project.tasks.push(task)
    }
    //** ------------ END: Task Loop --------- **//
    projects.push(project)
  }
  //*** ------------ END: Project Loop --------- ***//
  localStorage.setItem('to-do-list', JSON.stringify(projects))
}

// Extract data from local storage and load to memory
function loadLocalStorage (projectsIn) {
  //*** ---------- BEGIN: Project Loop --------- ***//
  if (localStorage.getItem('to-do-list') !== null) {
    projectsIn.projects = []
    const loadedProjects = JSON.parse(localStorage.getItem('to-do-list'))

    for (let i = 0; i < loadedProjects.length; i += 1) {
      const currentProject = loadedProjects[i]
      const project = Object.assign({}, { ...Project },
        JSON.parse(JSON.stringify(Project)))
      project.setProject(currentProject.title, currentProject.color)
      project.projectID = i
      //** ---------- BEGIN: Task Loop --------- **//
      for (let j = 0; j < loadedProjects[i].tasks.length; j += 1) {
        const currentTask = loadedProjects[i].tasks[j]
        const task = Object.assign({}, { ...Task },
          JSON.parse(JSON.stringify(Task)))
        task.setTask(
          currentTask.title,
          currentTask.description,
          currentTask.dueDate,
          currentTask.priority,
          currentTask.done,
          currentTask.notes)
        task.projectID = i
        task.taskID = j
        //* ---------- BEGIN: Checklist Loop --------- *//
        for (let k = 0; k <
        loadedProjects[i].tasks[j].checklists.length; k += 1) {
          const checklist = Object.assign({},
            { ...Checklist },
            loadedProjects[i].tasks[j].checklists[k],
          )
          task.addChecklist(checklist)
        }
        //* ------------ END: Checklist Loop --------- *//
        project.addTask(task)
      }
      //** ------------ END: Task Loop --------- **//
      projectsIn.projects.push(project)
    }
  }
  //*** ------------ END: Project Loop --------- ***//
}

export { deleteData, loadData, resetData, setLocalStorage }
