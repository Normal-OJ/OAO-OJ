import { db } from './index.js'

function getSubmissionList() {
  return db.data.submissions
}

function getSubmission(id) {
  return db.data.submissions.find(s => s.id === id)
}

const results = ['Accepted', 'Wrong Answer', 'Time Limit Exceed', 'Memory Limit Exceed', 'Compile Error', 'Runtime Error']
function generateSubmission() {
  const result = results[Math.floor(Math.random() * results.length)]
  const runtime = Math.floor(Math.random() * 1500)
  const memory = Math.floor(Math.random() * 15000)
  return { result, runtime, memory }
}

function createSubmission(pid, code, username) {
  const id = (db.data.submissions[db.data.submissions.length - 1]?.id || 0) + 1
  const { result, runtime, memory } = generateSubmission()
  db.data.submissions.push({
    id,
    pid,
    code,
    username,
    result,
    runtime,
    memory,
    timestamp: (new Date()).toISOString(),
  })
  db.write()
  return id
}

export default {
  getSubmissionList,
  getSubmission,
  createSubmission,
}
