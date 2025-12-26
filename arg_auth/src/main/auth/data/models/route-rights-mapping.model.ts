import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo
} from 'sequelize-typescript';
import { RouteMasterModel } from './route-master.model';
import { RightsModel } from './rights.model'; 

@Table({
  tableName: 'RouteRightsMapping',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['RouteId'],
      name: 'idx_route_rights_route'
    },
    {
      fields: ['RightsId'],
      name: 'idx_route_rights_right'
    }
  ]
})

export class RouteRightsMappingModel extends Model<RouteRightsMappingModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  Id!: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  RouteId!: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  RightsId!: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 1 })
  Status!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  CreatedBy!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  UpdatedBy!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date;

  // Relations
  @BelongsTo(() => RouteMasterModel, { foreignKey: 'RouteId', targetKey: 'RouteId' })
  routeMaster!: RouteMasterModel;

  @BelongsTo(() => RightsModel, { foreignKey: 'RightsId', targetKey: 'RightsId' })
  rights!: RightsModel;
}
