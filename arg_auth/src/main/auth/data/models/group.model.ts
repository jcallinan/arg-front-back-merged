import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { UsersGroupsMappingsModel } from './user-group-mapping.model';
import { GroupRightsModel } from './group-rights.model';

@Table({
  tableName: 'Group',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['Name'],
      name: 'idx_group_name'
    },
    {
      fields: ['Status'],
      name: 'idx_group_status'
    }
  ]
})
export class GroupModel extends Model<GroupModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  GroupId!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  Description!: string;

  // You mentioned appid (prefix), assuming it's a string field (adjust if it's another type)
  @Column({ type: DataType.INTEGER, allowNull: true })
  AppId!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  Name!: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  Status!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  CreatedBy!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  UpdatedBy!: number;

  // relations
  @HasMany(() => UsersGroupsMappingsModel, { foreignKey: 'GroupId', sourceKey: 'GroupId' })
  userMappings!: UsersGroupsMappingsModel[];

  @HasMany(() => GroupRightsModel, { foreignKey: 'GroupId', sourceKey: 'GroupId' })
  groupRights!: GroupRightsModel[];

}
