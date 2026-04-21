import express from 'express'

import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())

const httpServer = http.createServer(app)

try {
  void sequelize.sync()
} catch (error) {
  console.log('Sequelize sync error', error)
}

app.listen(env.PORT).on('listening', () => console.log(`Server started at port ${env.PORT}`))
