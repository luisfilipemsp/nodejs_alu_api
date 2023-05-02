const exp = require("express");
const fs = require("fs");
const app = exp();

app.listen("3000", () => {
  console.log(`El servidor Calculadora Express esta escuchando el puerto 3000`);
});

app.get("/api/estadisticas", (req, res) => {
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      //console.log(data);
      res.send(data);
    }
  });
});

//devuelven las estadisticas de notas
app.get("/api/estadisticas/:carrera", (req, res) => {
  const carrera = req.params.carrera;

  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let notas = [];
      for (let propiedad in datosAlumnos) {
        const car = datosAlumnos[propiedad]["Carrera"];
        if (car == carrera) {
          const nota = datosAlumnos[propiedad]["Promedio"];
          notas.push(nota);
        }
      }
      //`La media de ${carrera} es:  ${calcularMedia(notas)}`
      if (notas.length != 0) {
        res.send({
          success: true,
          message: "Media de la carrera " + carrera,
          data: calcularMedia(notas),
        });
      } else {
        res.send({
          success: false,
          message: "Inexistente datos",
        });
      }
    }
  });
});

//  devuelve los alumnos por carrera
app.get("/api/carrera/:carrera", (req, res) => {
  const carrera = req.params.carrera;

  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let alumnos = [];
      for (let propiedad in datosAlumnos) {
        const car = datosAlumnos[propiedad]["Carrera"];
        if (car == carrera) {
          let alumno = {
            nombre: datosAlumnos[propiedad]["Nombre"],
            apellido_1: datosAlumnos[propiedad]["Primer Apellido"],
            apellido_2: datosAlumnos[propiedad]["Segundo Apellido"],
          };
          alumnos.push(alumno);
        }
      }
      //`La media de ${carrera} es:  ${calcularMedia(notas)}`
      if (alumnos != 0) {
        res.send({
          success: true,
          message: "Nombre de alumnos en " + carrera,
          data: alumnos,
        });
      } else {
        res.send({
          success: false,
          message: "Inexistente datos",
        });
      }
    }
  });
});

// devuelve aquellos alumnos que están al corriente de pagos
app.get("/api/pagados", (req, res) => {
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let alumnos = [];
      for (let propiedad in datosAlumnos) {
        const pagado = datosAlumnos[propiedad]["Al Corriente"];
        if (pagado == true) {
          let alumno = {
            nombre: datosAlumnos[propiedad]["Nombre"],
            apellido_1: datosAlumnos[propiedad]["Primer Apellido"],
            apellido_2: datosAlumnos[propiedad]["Segundo Apellido"],
          };
          alumnos.push(alumno);
        }
      }
      //`La media de ${carrera} es:  ${calcularMedia(notas)}`
      if (alumnos.length != 0) {
        res.send({
          success: true,
          message: "Nombre de alumnos al corriente",
          data: alumnos,
        });
      } else {
        res.send({
          success: false,
          message: "Inexistente datos alumno por cuenta",
        });
      }
    }
  });
});

// devuelve aquellos alumnos que no están al corriente de pagos
app.get("/api/nopagados", (req, res) => {
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let alumnos = [];
      for (let propiedad in datosAlumnos) {
        const pagado = datosAlumnos[propiedad]["Al Corriente"];
        if (pagado != true) {
          let alumno = {
            nombre: datosAlumnos[propiedad]["Nombre"],
            apellido_1: datosAlumnos[propiedad]["Primer Apellido"],
            apellido_2: datosAlumnos[propiedad]["Segundo Apellido"],
          };
          alumnos.push(alumno);
        }
      }
      //`La media de ${carrera} es:  ${calcularMedia(notas)}`
      if (alumnos.length != 0) {
        res.send({
          success: true,
          message: "Nombre de alumnos no al corriente",
          data: alumnos,
        });
      } else {
        res.send({
          success: false,
          message: "Inexistente datos",
        });
      }
    }
  });
});

// devuelve los datos del alumno
app.get("/api/:cuenta", (req, res) => {
  const cuenta = req.params.cuenta;
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let alumnos = [];
      for (let propiedad in datosAlumnos) {
        const cuenta_ = datosAlumnos[propiedad]["Cuenta"];
        if (cuenta_ == cuenta) {
          let alumno = {
            nombre: datosAlumnos[propiedad]["Nombre"],
            apellido_1: datosAlumnos[propiedad]["Primer Apellido"],
            apellido_2: datosAlumnos[propiedad]["Segundo Apellido"],
          };
          alumnos.push(alumno);
        }
      }
      //`La media de ${carrera} es:  ${calcularMedia(notas)}`

      if (alumnos == 0) {
        res.send({
          success: false,
          message: "Inexistente datos alumno por cuenta",
        });
      } else {
        res.send({
          success: true,
          message: "Datos alumno por cuenta",
          data: alumnos,
        });
      }
    }
  });
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
// almacena un nuevo alumno siempre que esa cuenta no esté en el fichero
app.post("/api/:cuenta", (req, res) => {
  const cuenta = req.params.cuenta;
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let noExiste = true;
      for (let propiedad in datosAlumnos) {
        const cuenta_ = datosAlumnos[propiedad]["Cuenta"];
        if (cuenta_ == cuenta) noExiste = false;
      }

      if (noExiste) {
        const data_nuevo = req.body;
        let dataJson = JSON.parse(data);
        dataJson.push(data_nuevo);
        //console.log(req.body)
        fs.writeFileSync("alumnos.txt", JSON.stringify(dataJson));
        res.send({
          success: true,
          message: "Datos alumno por cuenta insertado",
          data: "",
        });
      } else {
        res.send({
          success: false,
          message: "Existente datos alumno por cuenta",
        });
      }
    }
  });
});

//  modifica el alumno de dicha cuenta
app.put("/api/:cuenta", (req, res) => {
  const cuenta = req.params.cuenta;
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let existe = false;
      for (let propiedad in datosAlumnos) {
        const cuenta_ = datosAlumnos[propiedad]["Cuenta"];
        if (cuenta_ == cuenta) {
          const data_nuevo = req.body;
          //console.log(data_nuevo)
          datosAlumnos[propiedad] = data_nuevo;
          existe = true;
        }
      }

      if (existe) {
        //let dataJson = JSON.parse(data);
        //console.log(req.body)
        fs.writeFileSync("alumnos.txt", JSON.stringify(datosAlumnos));
        res.send({
          success: true,
          message: "Datos alumno por cuenta modificado",
          data: "",
        });
      } else {
        res.send({
          success: false,
          message: "No existe datos alumno por cuenta",
        });
      }
    }
  });
});

app.delete("/api/:cuenta", (req, res) => {
  const cuenta = req.params.cuenta;
  fs.readFile("alumnos.txt", "utf-8", (error, data) => {
    if (error) {
      console.log(`Error ${error}`);
      res.send(error);
    } else {
      const datosAlumnos = JSON.parse(data);
      let existe = false;
      for (let propiedad in datosAlumnos) {
        const cuenta_ = datosAlumnos[propiedad]["Cuenta"];
        if (cuenta_ == cuenta) {
          const data_nuevo = req.body;
          //console.log(data_nuevo)
          delete datosAlumnos[propiedad]["Cuenta"];
          existe = true;
        }
      }

      if (existe) {
        //let dataJson = JSON.parse(data);
        //console.log(req.body)
        fs.writeFileSync("alumnos.txt", JSON.stringify(datosAlumnos));
        res.send({
          success: true,
          message: "Datos alumno por cuenta eliminado",
          data: "",
        });
      } else {
        res.send({
          success: false,
          message: "No existe datos alumno por cuenta",
        });
      }
    }
  });
});

function calcularMedia(array) {
  let suma = 0;
  for (let i = 0; i < array.length; i++) {
    suma += array[i];
  }
  return suma / array.length;
}
