const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://root:root@cluster0.nzcs41n.mongodb.net/GraphQL2",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log("Hubo un error");
    console.log(error);
    process.exit(1); // Detener el server en caso de error
  }
};
module.exports = conectarDB;
