import crypto from 'crypto'
import { db } from './index.js'

function hashing(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

function validatePassword(password, salt, hash) {
  return hashing(password, salt) === hash
}

function changePassword(user, password) {
  user.hash = hashing(password, user.salt)
  db.write()
}

export default {
  validatePassword,
  changePassword,
}
