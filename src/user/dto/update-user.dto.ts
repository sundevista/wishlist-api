import {PartialType} from "@nestjs/mapped-types";
import {CreateUserDto} from "./create-user.dto";
import {IsOptional, MaxLength, MinLength} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @MinLength(5, { message: '$property should be longer than $constraint1 characters' })
  @MaxLength(20, { message: '$property should be less than $constraint1 characters' })
  city: string;

  @IsOptional()
  @MinLength(8, { message: '$property should be longer than $constraint1 characters' })
  @MaxLength(50, { message: '$property should be less than $constraint1 characters' })
  address: string;
}
