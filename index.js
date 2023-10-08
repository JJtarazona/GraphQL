const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolver = require("./db/resolver");
const conectarDB = require("./config/db");

//conectarDB

conectarDB();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers: resolver,
});

//arrancar server
server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
