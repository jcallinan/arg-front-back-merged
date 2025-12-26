export class UserGroupMappingEntity {
  constructor(
    public readonly UserGroupMappingId: number,
    public readonly UserId: number,
    public readonly GroupId: number,
    public readonly CreatedOn: Date,
    public readonly UpdatedOn: Date,
    public readonly CreatedBy: number,
    public readonly UpdatedBy: number,
  ) {}
  
}
