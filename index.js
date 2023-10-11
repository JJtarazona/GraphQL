const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolver = require("./db/resolver");
const conectarDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

//conectarDB

conectarDB();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers: resolver,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const usuario = jwt.verify(token, process.env.SECRETA);

        return {
          usuario,
        };
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    }
  },
});

//arrancar server
server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
