import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import models from '../models/index.js'
import { isLoggedIn } from '../middlewares/auth.js'

const router = Router()

/**
 * @swagger
 * paths:
 *  /submissions:
 *    get:
 *      summary: 拿提交紀錄列表
 *      tags: [Submissions]
 *      responses:
 *        200:
 *          description: 成功
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                    pid:
 *                      type: number
 *                    username:
 *                      type: string
 *                    code:
 *                      type: string
 *                    result:
 *                      type: string
 *                    runtime:
 *                      type: number
 *                    memory:
 *                      type: number
 *                    timestamp:
 *                      type: string
 *        401:
 *          description: 請先登入
 */
router.get(
  '/',
  isLoggedIn,
  (req, res) => {
    const s = models.submissions.getSubmissionList()
    res.status(200).json(s)
  },
)

/**
 * @swagger
 * paths:
 *  /submissions/{id}:
 *    get:
 *      summary: 拿某 id 的提交紀錄
 *      tags: [Submissions]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: 你要拿的提交紀錄的 id
 *          required: true
 *          schema:
 *            type: number  
 *      responses:
 *        200:
 *          description: 成功
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                  pid:
 *                    type: number
 *                  username:
 *                    type: string
 *                  code:
 *                    type: string
 *                  result:
 *                    type: string
 *                  runtime:
 *                    type: number
 *                  memory:
 *                    type: number
 *                  timestamp:
 *                    type: string
 *        400:
 *          description: 你帶的參數怪怪的哦
 *        401:
 *          description: 請先登入
 *        403:
 *          description: 提交者或老師才能看哦
 *        404:
 *          description: 找不到有提交紀錄是這個 id 欸
 */
router.get(
  '/:id',
  isLoggedIn,
  param('id').isNumeric(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }
    const s = models.submissions.getSubmission(Number(req.params.id))
    if (!s) {
      res.status(404).send('no such Submission QQ')
    }
    if (s.username !== req.session.user.username && req.session.user.role !== 'teacher') {
      res.status(403).send('only submitter and teacher can see this submission!')
    }
    res.status(200).json(s)
  }
)

/**
 * @swagger
 * paths:
 *  /submissions:
 *    post:
 *      summary: 提交程式碼到某題目（新增提交紀錄）
 *      tags: [Submissions]
 *      requestBody:
 *        required: true
 *        description: id 為欲提交的題目 id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                code:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功，回傳新提交紀錄的 id
 *        400:
 *          description: 你帶的資料怪怪的哦
 *        401:
 *          description: 請先登入
 *        404:
 *          description: 找不到這個 id 的題目欸
 */
router.post(
  '/',
  isLoggedIn,
  body('id').isNumeric(),
  body('code').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }
    const p = models.problems.getProblem(Number(req.body.id))
    if (!p) {
      res.status(404).send('no such problem QQ')
    }
    const id = models.submissions.createSubmission(Number(req.body.id), req.body.code, req.session.user.username)
    res.status(200).json(id)
  },
)

export default router
