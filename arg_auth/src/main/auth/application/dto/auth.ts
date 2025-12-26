import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class MsCallbackDto {
    @ApiProperty({ description: "Code", example: 'abc', required: true })
    @IsString()
    @IsNotEmpty()
    code!: string;
}


export class userResponseDto {
    @ApiProperty({ description: "Email", example: 'abc', required: true })
    email!: string;

    @ApiProperty({ description: "userDisplayName", example: 'abc', required: true })
    userDisplayName!: string;

    @ApiProperty({ description: "UserInitails", example: 'abc', required: true })
    userInitials!: string;
}

export class AuthDataDto {

    @IsNotEmpty()
    @IsBoolean()
    restApi!: boolean

    @IsOptional()
    @IsString()
    route?: string;

    @IsOptional()
    @IsString()
    method?: string;

}

export class ValidateUserDto {
    @ValidateNested()
    @Type(() => AuthDataDto)
    authData!: AuthDataDto;
}