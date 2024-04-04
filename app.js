const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");

/* Middleware */
app.use(express.json());


/* Ruta base */
app.get("/", (req, res) => {
    try {
      res.sendFile(`${__dirname}/public/index.html`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


/* Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON  */

app.post("/agregar", async (req, res) => {
  const { nombre, precio } = req.query;
  const deporte = {
    nombre,
    precio,
  };
  try {
    let data = { deportes: [] };
    const archivo = fs.readFileSync("deportes.json", "utf8");
    if (archivo) {
      data = JSON.parse(archivo);
    }
    const deportes = data.deportes;
    deportes.push(deporte);
    fs.writeFileSync("deportes.json", JSON.stringify(data));
    res.send("Deporte almacenado con éxito");
  } catch (error) {
    console.error("Error al guardar el deporte:", error);
    res.status(500).send("Error interno del servidor");
  }
});
/* Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados  */

app.get("/deportes", (req, res) => {
  try {
    const data = fs.readFileSync("deportes.json", "utf8");
    deportes = JSON.parse(data);
  } catch (err) {
    console.error("Error al leer el archivo:", err);
  }
  res.json(deportes);
});

/* Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros de la consulta y persista este cambio */

app.put("/editar", async (req, res) => {
    const { nombre, precio } = req.query;
    try {
        let data = { deportes: [] };
        const archivo = fs.readFileSync("deportes.json", "utf8");
        if (archivo) {
            data = JSON.parse(archivo);
      }
      let deporte = data.deportes.find((deporte) => deporte.nombre === nombre);
      if (deporte) {
          deporte.precio = precio;
          fs.writeFileSync("deportes.json", JSON.stringify(data));
          res.send(`Precio editado de forma correcta`);
      } else {
          res.status(404).send("Deporte no encontrado");
      }
  } catch (error) {
      console.error("Error al editar el precio del deporte:", error);
      res.status(500).send("Error interno del servidor");
  }
});

/* Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio */
app.delete("/eliminar", async (req, res) => {
    const { nombre } = req.query;
    try {
      let data = { deportes: [] };
      const archivo = fs.readFileSync("deportes.json", "utf8");
      if (archivo) {
        data = JSON.parse(archivo);
      }
      let deportes = data.deportes;
      const eliminarDeporte = deportes.filter((deporte) => deporte.nombre !== nombre);
      if (deportes.length !== eliminarDeporte.length) {
        data.deportes = eliminarDeporte;
        fs.writeFileSync("deportes.json", JSON.stringify(data));
        res.send("Deporte eliminado ");
      } else {
        res.status(404).send("Deporte no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar el deporte:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

/* Levantar Servidor */

app.listen(PORT, () => {
  console.log("Conetado al puerto", PORT);
});
