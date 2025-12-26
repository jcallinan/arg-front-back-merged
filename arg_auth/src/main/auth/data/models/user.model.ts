import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { UsersGroupsMappingsModel } from './user-group-mapping.model';
// import { LoginHistoryModel } from './login-histories.model';

@Table({
  tableName: 'User',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      unique: true,
      fields: ['UserId'],
      name: 'idx_user_id'
    },
    {
      unique: true,
      fields: ['Email'],
      name: 'idx_user_email'
    },
    {
      fields: ['RefreshToken'],
      name: 'idx_user_token'
    }
  ]
})

export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  UserId!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  Email!: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  UserName!: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  ExternalUserId!: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  AppId!: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  UserDisplayName!: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  UserInitails!: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  UserStatus!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  RefreshToken!: string;

  // Relations
  @HasMany(() => UsersGroupsMappingsModel, { foreignKey: 'UserId', sourceKey: 'UserId' })
  groupMappings!: UsersGroupsMappingsModel[];

  // @HasMany(() => LoginHistoryModel, { foreignKey: 'UserId', sourceKey: 'UserId' })
  // loginHistories!: LoginHistoryModel[];
}
