const Usuario = require("../models/usuario");
const Producto = require("../models/productos");

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
  },
};

module.exports = resolver;
