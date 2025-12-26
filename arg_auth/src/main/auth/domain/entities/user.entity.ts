export class UserEntity {
    constructor(
        public readonly UserId: number,
        public readonly Email: string,
        public readonly UserName: string,
        public readonly UserDisplayName: string,
        public readonly UserInitails: string,
        public readonly RefreshToken: string,
    ) {}
}