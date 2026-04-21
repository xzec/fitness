import express from 'express'
import passport from 'passport'

import env from '~/env'
import { sequelize } from '~/db'
import configurePassport from '~/passport'
import ProgramRouter from '~/routes/programs'
import ExerciseRouter from '~/routes/exercises'
import AuthRouter from '~/routes/auth/register'

const app = express()

configurePassport()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use('/auth', AuthRouter())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())

try {
  void sequelize.sync()
} catch (error) {
  console.log('Sequelize sync error', error)
}

app.listen(env.PORT).on('listening', () => console.log(`Server started at port ${env.PORT}`))
