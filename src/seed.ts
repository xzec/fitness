import { models, sequelize } from '~/db'
import { EXERCISE_DIFFICULTY, USER_ROLE } from '~/utils/enums'
import bcrypt from 'bcrypt'

const { Exercise, Program, User } = models

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
