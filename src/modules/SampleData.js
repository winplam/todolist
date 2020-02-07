import Project from './Project'
import Task from './Task'
import Checklist from './Checklist'

const SampleData = (toDoList) => {
  // Pre-fill add new project input with sample text
  const fillProjectBox = () => {
    // Fill add project box with sample "pre-typed" data
    document.getElementById('new-title-input').value = 'Swim with manatees'
    document.getElementById('color-picker').value = '#00ffff'
    document.querySelector(
      '.project-editor-rectangle').style.backgroundColor = '#00ffff'
  }
  fillProjectBox()

  // Add projects on left column
  const project01 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))
  const project02 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))
  const project03 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))
  const project04 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))
  const project05 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))
  const project06 = Object.assign({},
    { ...Project }, JSON.parse(JSON.stringify(Project)))

  project01.setProject('Sing karaoke with friends', '#ffff00')
  project02.setProject('Get a full-body massage', '#cd0000')
  project03.setProject('Pick fresh fruit and make a pie', '#0000ff')
  project04.setProject('Go to movie at a drive-in theater', '#ff944b')
  project05.setProject('Walk barefoot in the rain', '#00e600')
  project06.setProject('Donate toys at the holidays', '#ac39ac')

  toDoList.addProject(project01)
  toDoList.addProject(project02)
  toDoList.addProject(project03)
  toDoList.addProject(project04)
  toDoList.addProject(project05)
  toDoList.addProject(project06)

  // Add sample tasks to the projects
  const task0_0 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task0_1 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task0_2 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task0_3 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task0_4 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task1_0 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task1_1 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task1_2 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task1_3 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task2_0 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task2_1 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task2_2 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))
  const task2_3 = Object.assign({}, { ...Task },
    JSON.parse(JSON.stringify(Task)))

  task0_0.setTask('Slide down a firehouse pole', '', '2022-1-8', 5, true,
    '')
  task0_1.setTask('Learn how to cross-stitch', '', '2022-7-17', 10, false)
  task0_2.setTask('Visit Canada’s Niagara Falls', '', '2022-8-22', 3, true)
  task0_3.setTask('Take a Ferrari for a test drive', '', '2022-2-18', 7,
    false)
  task0_4.setTask('Compete in a frog jumping contest', '', '2022-9-10', 0, true)
  task1_0.setTask('Watch a meteor shower', '', '', 1, false)
  task1_1.setTask('Go whitewater rafting', '', '', 6, true)
  task1_2.setTask('Watch the sunset from my roof', '', '', 2, false)
  task1_3.setTask('Make a full Thanksgiving dinner', '', '', 5,
    true)
  task2_0.setTask('Learn how to play the guitar', '', '', 9, false)
  task2_1.setTask('Learn more cool new skills', '', '', 5,
    true)
  task2_2.setTask('Go bungee jumping', '', '', 0, false)
  task2_3.setTask('Have dinner in the Sky', '', '', 9, true)

  toDoList.projects[0].addTask(task0_0)
  toDoList.projects[0].addTask(task0_1)
  toDoList.projects[0].addTask(task0_2)
  toDoList.projects[0].addTask(task0_3)
  toDoList.projects[0].addTask(task0_4)
  toDoList.projects[1].addTask(task1_0)
  toDoList.projects[1].addTask(task1_1)
  toDoList.projects[1].addTask(task1_2)
  toDoList.projects[1].addTask(task1_3)
  toDoList.projects[2].addTask(task2_0)
  toDoList.projects[2].addTask(task2_1)
  toDoList.projects[2].addTask(task2_2)
  toDoList.projects[2].addTask(task2_3)

  // Add sample Checklist to the projects
  const checklist0_0 = { ...Checklist }
  const checklist0_1 = { ...Checklist }
  const checklist0_2 = { ...Checklist }
  checklist0_0.title = 'My checklist item #1'
  checklist0_0.done = true
  checklist0_1.title = 'My checklist item #2'
  checklist0_2.title = 'My checklist item #3'
  toDoList.projects[0].tasks[0].addChecklist(checklist0_0)
  toDoList.projects[0].tasks[0].addChecklist(checklist0_1)
  toDoList.projects[0].tasks[0].addChecklist(checklist0_2)
}

export default SampleData
