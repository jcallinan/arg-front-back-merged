import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { GroupModel } from './group.model';
import { RightsModel } from './rights.model';

@Table({
  tableName: 'GroupRights',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['GroupId'],
      name: 'idx_group_rights_group'
    },
    {
      fields: ['RightsId'],
      name: 'idx_group_rights_right'
    }
  ]
})
export class GroupRightsModel extends Model<GroupRightsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  GroupRightId!: number;

  @ForeignKey(() => GroupModel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  GroupId!: number; 

  @ForeignKey(() => RightsModel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  RightsId!: number; 

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  CreatedBy!: number; 

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  UpdatedBy!: number; 


  // Relations
  @BelongsTo(() => GroupModel, { foreignKey: 'GroupId', targetKey: 'GroupId' })
  group!: GroupModel;

  @BelongsTo(() => RightsModel, { foreignKey: 'RightsId', targetKey: 'RightsId' })
  rights!: RightsModel;
}
