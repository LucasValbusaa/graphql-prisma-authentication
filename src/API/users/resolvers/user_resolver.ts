import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { IContext } from "../../../config/context-prisma";
import { UserSchema, UserWithToke } from "../schema/user_scema";
import { v4 as uuid } from "uuid";

@InputType()
export class UserInputData {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => UserSchema, { nullable: true })
  async privateInfo(
    @Arg("token") token: string,
    @Ctx() ctx: IContext
  ): Promise<UserSchema | null> {
    const db_token = await ctx.prisma.tokens.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!db_token) return null;

    return db_token.user;
  }

  @Mutation(() => UserSchema)
  async singUp(
    @Arg("data") { email, password }: UserInputData,
    @Ctx() { prisma }: IContext
  ): Promise<UserSchema> {
    const hased_password = await hash(password, 10);

    const new_user = await prisma.users.create({
      data: { email, password: hased_password },
    });

    return new_user;
  }

  @Mutation(() => UserWithToke)
  async login(
    @Arg("data") { email, password }: UserInputData,
    @Ctx() { prisma }: IContext
  ): Promise<UserWithToke | null> {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) return null;

    const validate = await compare(password, user.password);

    if (!validate) return null;

    const token_code = uuid();

    const { token } = await prisma.tokens.create({
      data: { token: token_code, user: { connect: { email } } },
    });

    return { user, token };
  }
}
