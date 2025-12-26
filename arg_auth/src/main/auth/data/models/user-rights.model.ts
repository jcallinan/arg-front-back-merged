import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
    tableName: 'UsersRights',
    timestamps: true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    indexes: [
        {
            fields: ['UserId'],
            name: 'idx_user_rights_user'
        },
        {
            fields: ['RightsId'],
            name: 'idx_user_rights_right'
        }
    ]
})

export class UsersRightsModel extends Model<UsersRightsModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.BIGINT, allowNull: false })
    UserRightId!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    UserId!: number;

    @Column({ type: DataType.BIGINT, allowNull: false })
    RightsId!: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    IsPermission!: boolean;

    @CreatedAt
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    CreatedOn!: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
    UpdatedOn!: Date | null;

    @Column({ type: DataType.INTEGER, allowNull: false })
    CreatedBy!: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    UpdatedBy!: number | null;

    // Relations
    @BelongsTo(() => UserModel, { foreignKey: 'UserId', targetKey: 'UserId' })
    user!: UserModel;

}