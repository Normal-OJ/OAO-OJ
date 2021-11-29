import express from 'express'
import http from 'http'
import session from 'express-session'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { requestLogger, errorLogger } from './middlewares/logger.js'
import router from './routes/index.js'

const app = express()
const port = 3000

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OAO OJ mock server API',
      version: '1.0.0',
      description: 'Example API for you to know what API is provided in this mock server, and how to use them.',
      contact: {
        name: 'NOJ',
        email: 'service-learning@noj.tw',
        url: 'https://www.facebook.com/noj.tw'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'local environment'
      }
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: '7h15154v3ry57r0n653cr37',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 86400 * 1000 },
  // only turn off secure when you're testing
  // cookie: { secure: true },
}))

app.use(requestLogger)

app.use('/api', router)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(errorLogger)

http.createServer(app).listen(port, '0.0.0.0', () => {
  console.log('server start')
})

export default app
