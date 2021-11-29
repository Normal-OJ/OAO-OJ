import { db } from './index.js'

function getProblemList() {
  return db.data.problems.data
}

function getProblem(id) {
  return db.data.problems.data.find(p => p.id === id)
}

function createProblem(title, content) {
  const id = db.data.problems.counter + 1
  db.data.problems.counter += 1
  db.data.problems.data.push({ id, title, content })
  db.write()
  return id
}

function modifyProblem(problem, title, content) {
  problem.title = title
  problem.content = content
  db.write()
}

function deleteProblem(id) {
  const i = db.data.problems.data.findIndex(p => p.id === id)
  if (i === -1) return false
  db.data.problems.data.splice(i, 1)
  db.write()
  return true;
}

export default {
  getProblemList,
  getProblem,
  createProblem,
  modifyProblem,
  deleteProblem,
}
