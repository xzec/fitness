import type { Sequelize, Model } from 'sequelize'
import { DataTypes } from 'sequelize'

import type { ExerciseModel } from '~/db/exercise'
import type { UserModel } from '~/db/user'

export interface CompletedExerciseModel extends Model {
  id: number
  userID: number
  exerciseID: number
  completedAt: Date
  durationSeconds: number

  user?: UserModel
  exercise?: ExerciseModel
}

export default (sequelize: Sequelize, modelName: string) => {
  const CompletedExerciseModelCtor = sequelize.define<CompletedExerciseModel>(
    modelName,
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      durationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
    },
    {
      paranoid: true,
      timestamps: true,
      tableName: 'completed_exercises',
    }
  )

  CompletedExerciseModelCtor.associate = (models) => {
    CompletedExerciseModelCtor.belongsTo(models.User, {
      foreignKey: { name: 'userID', allowNull: false },
    })
    CompletedExerciseModelCtor.belongsTo(models.Exercise, {
      foreignKey: { name: 'exerciseID', allowNull: false },
    })
  }

  return CompletedExerciseModelCtor
}
