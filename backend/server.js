require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema");
const resolvers = require("./graphql/resolvers");
const { attachUserFromHeader } = require("./auth/auth");

const PORT = process.env.PORT || 4000;

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // custom middleware to parse auth header and attach req.user
  app.use(attachUserFromHeader);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // pass user and helpers into resolvers
      return {
        user: req.user,
        services: {
          employeeService: require("./services/employeeService"),
          userService: require("./users"),
        },
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.get("/", (req, res) => res.send("Employee GraphQL Backend (modular)"));

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

start();
