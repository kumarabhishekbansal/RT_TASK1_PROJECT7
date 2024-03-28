import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";

let cart = {
  count: 0,
  products: [],
  complete: false,
};

const typeDefs = /* GraphQL */ `
  type Cart {
    count: Int
    products: [Product]
    complete: Boolean
  }
  type Product {
    id: Int!
    title: String!
    thumbnail: String!
    price: Float
    category: Category
  }
  type Category {
    id: Int!
    title: String!
  }
  type Query {
    product: Product
    products(limit: Int): [Product]
    categories: [Category]
    cart: Cart
  }
`;

const mocks = {
  Int: () => Math.floor(Math.random() * 99) + 1,
  Float: () => (Math.random() * 99.0 + 1.0).toFixed(2),
  Product: () => ({
    thumbnail: () => "https://picsum.photos/400/400",
  }),
};

const executableSchema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs }),
  mocks,
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
