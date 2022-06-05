import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { context } from "./config/context-prisma";
import { UserResolver } from "./API/users/resolvers/user_resolver";

const app = async () => {
  const schema = await buildSchema({ resolvers: [UserResolver] });

  new ApolloServer({ schema, context }).listen({ port: 4001 }),
    () => {
      console.log("Server is runnig in port 4000");
    };
};

app();
