import { Router } from 'express'
import auth from './auth.js'
import problems from './problems.js'
import submissions from './submissions.js'
import users from './users.js'

const router = Router()

router.use('/auth', auth);
router.use('/problems', problems);
router.use('/submissions', submissions);
router.use('/users', users);

export default router
