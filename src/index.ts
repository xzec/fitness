import express from 'express'
import passport from 'passport'
import { apiReference } from '@scalar/express-api-reference'

import env from '~/env'
import { sequelize } from '~/db'
import configurePassport from '~/passport'
import { generateOpenApiSpec } from '~/openapi/registry'
import { errorHandler } from '~/utils/error-handler'
import { requestLogger } from '~/utils/request-logger'
import { responseWrapper } from '~/utils/response-wrapper'
import ProgramRouter from '~/routes/programs'
import ExerciseRouter from '~/routes/exercises'
import UsersRouter from '~/routes/users'
import ProfileRouter from '~/routes/profile'
import AuthRouter from '~/routes/auth'
import AdminUserRouter from '~/routes/admin/users'
import AdminExerciseRouter from '~/routes/admin/exercises'

import '~/routes/auth/openapi'
import '~/routes/admin/users/openapi'
import '~/routes/admin/exercises/openapi'
import '~/routes/programs/openapi'
import '~/routes/exercises/openapi'
import '~/routes/users/openapi'
import '~/routes/profile/openapi'

const app = express()

configurePassport()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(requestLogger)

app.get('/openapi.json', (_req, res) => {
  res.json(generateOpenApiSpec())
})
app.use('/docs', apiReference({ url: '/openapi.json' }))

app.use(responseWrapper)
app.use('/auth', AuthRouter())
app.use('/admin/users', AdminUserRouter())
app.use('/admin/exercises', AdminExerciseRouter())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/users', UsersRouter())
app.use('/profile', ProfileRouter())

app.use(errorHandler)

try {
  void sequelize.sync()
} catch (error) {
  console.log('Sequelize sync error', error)
}

app.listen(env.PORT).on('listening', () => console.log(`Server started at port ${env.PORT}`))
