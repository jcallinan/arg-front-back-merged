import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { GroupModel } from './group.model';

@Table({
  tableName: 'UsersGroupsMappings',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['UserId'],
      name: 'idx_user_group_user'
    },
    {
      fields: ['GroupId'],
      name: 'idx_user_group_group'
    }
  ]
})

export class UsersGroupsMappingsModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  UserGroupMappingId!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  UserId!: number;

  @ForeignKey(() => GroupModel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  GroupId!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 1 })
  CreatedBy!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  UpdatedBy!: number;


  // relations
  @BelongsTo(() => UserModel, { foreignKey: 'UserId', targetKey: 'UserId' })
  user!: UserModel;

  @BelongsTo(() => GroupModel, { foreignKey: 'GroupId', targetKey: 'GroupId' })
  group!: GroupModel;

}
