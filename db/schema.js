const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Int
    creado: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  type Query {
    obtenerUsuario(token: String!): Usuario

    obtenerProductos: [Producto]
  }

  input AutenticarIpunt {
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Int!
  }

  type Mutation {
    #Usuario
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarIpunt): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
  }
`;

module.exports = typeDefs;
