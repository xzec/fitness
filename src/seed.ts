import { models, sequelize } from '~/db'
import { EXERCISE_DIFFICULTY, USER_ROLE } from '~/utils/enums'
import bcrypt from 'bcrypt'

const { CompletedExercise, Exercise, Program, User } = models

const seedDB = async () => {
  await sequelize.sync({ force: true })

  await Program.bulkCreate([
    {
      name: 'Program 1',
    },
    {
      name: 'Program 2',
    },
    {
      name: 'Program 3',
    },
  ])

  await Exercise.bulkCreate([
    {
      name: 'Exercise 1',
      difficulty: EXERCISE_DIFFICULTY.EASY,
      programID: 1,
    },
    {
      name: 'Exercise 2',
      difficulty: EXERCISE_DIFFICULTY.EASY,
      programID: 2,
    },
    {
      name: 'Exercise 3',
      difficulty: EXERCISE_DIFFICULTY.MEDIUM,
      programID: 1,
    },
    {
      name: 'Exercise 4',
      difficulty: EXERCISE_DIFFICULTY.MEDIUM,
      programID: 2,
    },
    {
      name: 'Exercise 5',
      difficulty: EXERCISE_DIFFICULTY.HARD,
      programID: 1,
    },
    {
      name: 'Exercise 6',
      difficulty: EXERCISE_DIFFICULTY.HARD,
      programID: 2,
    },
  ])

  const pass = await bcrypt.hash('password', 10)
  await User.bulkCreate([
    {
      email: 'john@a.co',
      password: pass,
      role: USER_ROLE.ADMIN,
    },
    {
      email: 'karl@a.co',
      password: pass,
      role: USER_ROLE.USER,
    },
    {
      email: 'luke@a.co',
      password: pass,
      role: USER_ROLE.USER,
    },
    {
      email: 'mary@a.co',
      password: pass,
      role: USER_ROLE.USER,
    },
  ])

  await CompletedExercise.bulkCreate([
    {
      userID: 2,
      exerciseID: 1,
      startedAt: new Date('2026-04-18T08:25:00Z'),
      completedAt: new Date('2026-04-18T08:30:00Z'),
      durationSeconds: 300,
    },
    {
      userID: 2,
      exerciseID: 3,
      startedAt: new Date('2026-04-19T17:01:00Z'),
      completedAt: new Date('2026-04-19T17:10:00Z'),
      durationSeconds: 540,
    },
    {
      userID: 3,
      exerciseID: 2,
      startedAt: new Date('2026-04-20T11:53:00Z'),
      completedAt: new Date('2026-04-20T12:00:00Z'),
      durationSeconds: 420,
    },
  ])
}

seedDB()
  .then(() => {
    console.log('DB seed done')
    process.exit(0)
  })
  .catch((err) => {
    console.error('error in seed, check your data and model \n \n', err)
    process.exit(1)
  })
