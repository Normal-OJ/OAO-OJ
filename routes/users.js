import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import models from '../models/index.js'
import { isLoggedIn } from '../middlewares/auth.js'

const router = Router()

/**
 * @swagger
 * paths:
 *  /users/{username}:
 *    get:
 *      summary: 拿某個使用者的資訊
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: username
 *          description: 你要拿的使用者的 username
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: 成功
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  nickname:
 *                    type: string
 *                  role:
 *                    type: number
 *        400:
 *          description: 你帶的參數怪怪的哦
 *        401:
 *          description: 請先登入
 *        404:
 *          description: 找不到有使用者是這個 username 欸
 */
router.get(
  '/:username',
  isLoggedIn,
  param('username').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }
    const u = models.users.findUser(req.params.username)
    if (!u) {
      res.status(404).send('no such User QQ')
    }
    const { username, nickname, role } = u
    res.status(200).json({ username, nickname, role })
  }
)

/**
 * @swagger
 * paths:
 *  /users/change-nickname:
 *    post:
 *      summary: 更換暱稱
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newNickname:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功
 *        400:
 *          description: 你帶的資料怪怪的哦，確保兩者皆是非空的字串
 *        403:
 *          description: 密碼錯誤
 */
router.post(
  '/change-nickname',
  isLoggedIn,
  body('newNickname').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const u = models.users.findUser(req.session.user.username)
    models.users.changeNickname(u, req.body.newNickname)
    req.session.user.nickname = req.body.newNickname
    res.status(200).send('nice')
  },
)

export default router
