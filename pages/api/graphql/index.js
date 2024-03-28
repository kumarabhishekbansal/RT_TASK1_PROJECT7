import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
const typeDefs = /* GraphQL */ `
  type Product {
    id: Int!
    title: String!
    thumbnail: String!
    price: Float
  }
  type Query {
    product: Product
    products(limit: Int): [Product]
  }
`;

const executableSchema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs }),
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
async function handler(req, res) {
  const result = await runMiddleware(
    req,
    res,
    graphqlHTTP({
      schema: executableSchema,
      graphiql: true,
    })
  );
  res.json(result);
}
export default handler;
