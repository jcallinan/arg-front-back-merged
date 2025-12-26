import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'UserMetadata',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
})

export class UserMetadataModel extends Model<UserMetadataModel> {
  @PrimaryKey
  @Column({ type: DataType.STRING(100), allowNull: false })
  UserEmail!: string;

  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false })
  GroupId!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date;
}


