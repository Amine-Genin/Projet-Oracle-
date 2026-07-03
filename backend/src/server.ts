import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import reportRoutes from './routes/reportRoutes'
import oracleMockRoutes from './routes/oracleMockRoutes'
import { connectDb } from './config/db'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/reports', reportRoutes)
app.use('/api/oracle', oracleMockRoutes)

app.get('/', (_req, res) => res.send('Research Lab API'))

const PORT = process.env.PORT || 4000

connectDb().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
}).catch(err => {
  console.error('Failed to start server', err)
})

export default app
