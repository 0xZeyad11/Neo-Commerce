import { IsOptional, IsString, IsEmail, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  store_email: string;

  @IsUUID()
  owner_id: string;
}
