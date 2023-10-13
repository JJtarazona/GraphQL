const Usuario = require("../models/usuario");
const Producto = require("../models/productos");
const Cliente = require("../models/cliente");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;

  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

//Ressolver
const resolver = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRETA);

      return usuarioId;
    },

    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      const producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("El producto no existe");
      }

      return producto;
    },

    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerClienteVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerCliente: async (_, { id }, ctx) => {
      //Revisaer si el cliente existe
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error("El cliente no existe");
      }

      // Quien lo creo puede verlo
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes los permisos para ver esta informacion");
      }

      return cliente;
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      // revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error("El usuario ya existe");
      }

      // hashear su password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // Guardarlo en la BD
        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },

    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      // Si el usuarios existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      // Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("Password Incorrecto");
      }

      // Crear token
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"),
      };
    },

    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);

        // Guardarlo en la BD
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    actualizarProducto: async (_, { id, input }) => {
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("El producto no existe");
      }
      producto = await Producto.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return producto;
    },

    eliminarProducto: async (_, { id }) => {
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("El producto no existe");
      }

      await Producto.findOneAndDelete({ _id: id });

      return "El producto fue eliminado";
    },

    nuevoCliente: async (_, { input }, ctx) => {
      const { email } = input;
      //Verificar si el cliente ya existe

      const cliente = await Cliente.findOne({ email });
      if (cliente) {
        throw new Error("El cliente ya existe");
      }
      const nuevoCliente = new Cliente(input);

      // Asignar Vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      // Guardarlo en la BD
      try {
        const resultado = await nuevoCliente.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      // verificar si el cliente existe
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("El cliente no existe");
      }

      //Verificar vendedor
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes los permisos para ver esta informacion");
      }

      //guardar los cambios
      cliente = await Cliente.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return cliente;
    },

    eliminarCliente: async (_, { id }, ctx) => {
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("El cliente no existe");
      }

      //Verificar vendedor
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes los permisos para ver esta informacion");
      }

      await Cliente.findOneAndDelete({ _id: id });

      return "El cliente fue eliminado";
    },
  },
};

module.exports = resolver;
