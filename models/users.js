import { db } from './index.js'

function findUser(username) {
  return db.data.users.find(u => u.username === username)
}

function changeNickname(user, nickname) {
  user.nickname = nickname
}

export default {
  findUser,
  changeNickname,
}
