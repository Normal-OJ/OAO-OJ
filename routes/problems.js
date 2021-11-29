import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import models from '../models/index.js'
import { isLoggedIn, isTeacher } from '../middlewares/auth.js'

const router = Router()

/**
 * @swagger
 * paths:
 *  /problems:
 *    get:
 *      summary: 拿題目列表
 *      tags: [Problems]
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
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *        401:
 *          description: 請先登入
 */
router.get(
  '/',
  isLoggedIn,
  (req, res) => {
    const p = models.problems.getProblemList()
    res.status(200).json(p)
  },
)

/**
 * @swagger
 * paths:
 *  /problems/{id}:
 *    get:
 *      summary: 拿某 id 的題目
 *      tags: [Problems]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: 你要拿的題目的 id
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
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *        400:
 *          description: 你帶的參數怪怪的哦
 *        401:
 *          description: 請先登入
 *        404:
 *          description: 找不到有題目是這個 id 欸
 */
router.get(
  '/:id',
  isLoggedIn,
  param('id').isNumeric(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const p = models.problems.getProblem(Number(req.params.id))
    if (!p) {
      res.status(404).send('no such problem QQ')
    }
    res.status(200).json(p)
  }
)

/**
 * @swagger
 * paths:
 *  /problems:
 *    post:
 *      summary: 新增題目
 *      tags: [Problems]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object  
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功，回傳新題目的 id
 *        400:
 *          description: 你帶的資料怪怪的哦，確保兩者皆是非空的字串
 *        401:
 *          description: 請先登入
 *        403:
 *          description: 老師才能新增
 */
router.post(
  '/',
  isTeacher,
  body('title').isString().isLength({ min: 1 }),
  body('content').isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const id = models.problems.createProblem(req.body.title, req.body.content)
    res.status(200).json(id)
  },
)

/**
 * @swagger
 * paths:
 *  /problems/{id}:
 *    put:
 *      summary: 編輯某 id 的題目
 *      tags: [Problems]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: 你要改的題目的 id
 *          required: true
 *          schema:
 *            type: number
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object  
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        200:
 *          description: 成功
 *        400:
 *          description: 你帶的參數或資料怪怪的哦，'title' 與 'content' 至少要帶一個
 *        401:
 *          description: 請先登入
 *        403:
 *          description: 老師才能改
 *        404:
 *          description: 找不到有題目是這個 id 欸
 */
router.put(
  '/:id',
  isTeacher,
  param('id').isNumeric(),
  body('title').optional().isString().isLength({ min: 1 }),
  body('content').optional().isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.title && !req.body.title) {
      res.status(400).send('make sure at least one is provided (title or content)')
    }
    const p = models.problems.getProblem(Number(req.params.id))
    if (!p) {
      res.status(404).send('no such problem QQ')
    }
    models.problems.modifyProblem(p, req.body.title || p.title, req.body.content || p.content)
    res.status(200).send('nice')
  },
)

/**
 * @swagger
 * paths:
 *  /problems/{id}:
 *    delete:
 *      summary: 刪除某 id 的題目
 *      tags: [Problems]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: 你要刪的題目的 id
 *          required: true
 *          schema:
 *            type: number
 *      responses:
 *        200:
 *          description: 成功
 *        400:
 *          description: 你帶的參數怪怪的哦
 *        401:
 *          description: 請先登入
 *        403:
 *          description: 老師才能刪
 *        404:
 *          description: 找不到有題目是這個 id 欸
 */
router.delete(
  '/:id',
  isTeacher,
  param('id').isNumeric(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const result = models.problems.deleteProblem(Number(req.params.id))
    if (!result) {
      res.status(404).send('no such problem QQ')
    }
    res.status(200).send('nice')
  },
)

export default router
