import { Field, ObjectType, ID } from "type-graphql";
import { IsEmail, IsString } from "class-validator";

@ObjectType()
export class UserSchema {
  @Field((type) => ID)
  @IsString()
  id: string;

  @Field()
  email: string;

  @Field((type) => String)
  password: string;

  @Field((type) => Date)
  created_at: Date;
}

@ObjectType()
export class UserWithToke {
  @Field()
  user: UserSchema;

  @Field()
  token: string;
}
