import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'RouteMaster',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['Route'],
      name: 'idx_route_path'
    },
    {
      fields: ['Method'],
      name: 'idx_route_method'
    },
    {
      fields: ['Status'],
      name: 'idx_route_status'
    }
  ]
})

export class RouteMasterModel extends Model<RouteMasterModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  RouteId!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  Route!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  Method!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  Description!: string; // distance (assuming it's numeric; change to STRING if text-based)

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
}
