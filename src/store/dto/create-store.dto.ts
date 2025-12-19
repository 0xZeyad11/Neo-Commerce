import { IsOptional, IsString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Electronics Store' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the store about info' })
  @IsString()
  @IsOptional()
  about: string;

  @ApiProperty({ example: 'electronics@store.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  store_email: string;

  @ApiProperty({ description: 'The id corresponds to the store owner' })
  @IsUUID()
  owner_id: string;
}
