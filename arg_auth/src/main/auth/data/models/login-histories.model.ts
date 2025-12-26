import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
  tableName: 'LoginHistories',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['UserId'],
      name: 'idx_login_user'
    },
    {
      fields: ['IsActive'],
      name: 'idx_login_active'
    },
    {
      fields: ['LoginStatus'],
      name: 'idx_login_status'
    }
  ]
})
export class LoginHistoryModel extends Model<LoginHistoryModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  LoginHistoryId!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  UserId!: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  IPAddress!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  Token!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  RequestHeader!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  LastRequestMade!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  LogoutTime!: Date;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  IsActive!: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  LoginStatus!: boolean;


  // Relations
  @BelongsTo(() => UserModel, { foreignKey: 'UserId', targetKey: 'UserId' })
  user!: UserModel;
}
