import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import models from '../models/index.js'
import { isLoggedIn } from '../middlewares/auth.js'

const router = Router()

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: 登入
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功
 *        401:
 *          description: 密碼錯誤，登入失敗
 *        404:
 *          description: 找不到有人叫這個 username 欸
 */
router.post(
  '/login',
  body('username').isString().isLength({ min: 1 }),
  body('password').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const u = models.users.findUser(req.body.username)
    if (!u) {
      res.status(404).send(`can not find user: ${req.body.username}`)
    }
    const f = models.auth.validatePassword(req.body.password, u.salt, u.hash)
    if (!f) {
      res.status(401).send('wrong password')
    }
    const { username, nickname, role } = u
    req.session.user = { username, nickname, role }
    res.status(200).send('nice')
  },
)

/**
 * @swagger
 * paths:
 *  /auth/logout:
 *    post:
 *      summary: 登出
 *      tags: [Auth]
 *      responses:
 *        200:
 *          description: 成功
 *        401:
 *          description: 沒登入你要登出啥
 */
router.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy()
  res.status(200).send('byebye')
})

/**
 * @swagger
 * paths:
 *  /auth/change-password:
 *    post:
 *      summary: 更換密碼
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                oldPassword:
 *                  type: string
 *                newPassword:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功
 *        400:
 *          description: 你帶的資料怪怪的哦，確保兩者皆是非空的字串
 *        401:
 *          description: 請先登入
 */
router.post(
  '/change-password',
  isLoggedIn,
  body('oldPassword').isString().isLength({ min: 1 }),
  body('newPassword').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const u = models.users.findUser(req.session.user.username)
    const f = models.auth.validatePassword(req.body.oldPassword, u.salt, u.hash)
    if (!f) {
      res.status(403).send('wrong password')
    }
    models.auth.changePassword(u, req.body.newPassword)
    res.status(200).send('nice')
  },
)

export default router
