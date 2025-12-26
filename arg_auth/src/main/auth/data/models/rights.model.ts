import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { GroupRightsModel } from './group-rights.model';

@Table({
  tableName: 'Rights',
  timestamps: true,
  createdAt: 'CreatedOn',
  updatedAt: 'UpdatedOn',
  indexes: [
    {
      fields: ['ParentRightsId'],
      name: 'idx_rights_parent'
    },
    {
      fields: ['Status'],
      name: 'idx_rights_status'
    },
    {
      fields: ['IsNavigationItem'],
      name: 'idx_rights_nav'
    }
  ]
})


export class RightsModel extends Model<RightsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  RightsId!: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  ParentRightsId!: number | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  IsNavigationItem!: boolean;

  @Column({ type: DataType.TEXT, allowNull: false })
  Name!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  DisplayName!: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  DisplayOrder!: number | null;

  @Column({ type: DataType.STRING(250), allowNull: true })
  Description!: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  Url!: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  IsVisible!: boolean;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  Status!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  CreatedOn!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  UpdatedOn!: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  CreatedBy!: number;

  @Column({ type: DataType.STRING(100), allowNull: true })
  Module!: string | null

  // Relations
  @HasMany(() => GroupRightsModel, { foreignKey: 'RightsId', sourceKey: 'RightsId' })
  groupRights!: GroupRightsModel[];
}
