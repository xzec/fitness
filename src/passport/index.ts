import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import { models } from '~/db'
import env from '~/env'

const { User } = models

interface JwtPayload {
  id: number
}

export default () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET,
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (payload: JwtPayload, done) => {
        try {
          const user = await User.findByPk(payload.id)
          if (!user) return done(null, false)
          return done(null, user)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )
}
