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

  type Cliente {
    id: ID
    nombre: String
    apellido: String
    empresa: String
    email: String
    telefono: String
    vendedor: ID
    creado: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input ClienteInput {
    nombre: String!
    apellido: String!
    empresa: String!
    email: String!
    telefono: String
  }

  type Query {
    #Usuario
    obtenerUsuario(token: String!): Usuario

    # Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto

    # Clientes
    obtenerClientes: [Cliente]
    obtenerClienteVendedor: [Cliente]
    obtenerCliente(id: ID!): Cliente
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
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String

    # Clientes
    nuevoCliente(input: ClienteInput): Cliente
    actualizarCliente(id: ID!, input: ClienteInput): Cliente
    eliminarCliente(id: ID!): String
  }
`;

module.exports = typeDefs;
