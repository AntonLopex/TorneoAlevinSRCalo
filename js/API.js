const CSV_URL_CLASIFICACION =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=2104840114&single=true&output=csv";
const CSV_URL_RESULTADOS = 
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=597302420&single=true&output=csv"

  function obtenerClasificacion(CSV_URL) {
  fetch(CSV_URL)
    .then((response) => response.text())
    .then((csv) => {
      const rows = csv
        .trim()
        .split("\n")
        .map((row) => row.split(","));
      const table = document.getElementById("tabla-clasificacion");

      const headerRow = document.createElement("tr");
      rows[0].forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      for (let i = 1; i < rows.length; i++) {
        const row = document.createElement("tr");
        rows[i].forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          row.appendChild(td);
        });
        table.appendChild(row);
      }
    })
    .catch((err) => {
      document.body.innerHTML += "<p>Error al cargar los datos.</p>";
      console.error("Error leyendo el CSV:", err);
    });
    

}

// function obtenerResultados(CSV_URL){
//   fetch(CSV_URL)
//   .then((response) => response.text())
//   .then((csv) => {
//     const rows = csv
//       .trim()
//       .split("\n")
//       .map((row) => row.split(","));
//     const table = document.getElementById("tabla-resultados");

//     const headerRow = document.createElement("tr");
//     rows[0].forEach((header) => {
//       const th = document.createElement("th");
//       th.textContent = header;
//       headerRow.appendChild(th);
//     });
//     table.appendChild(headerRow);

//     for (let i = 1; i < rows.length; i++) {
//       const row = document.createElement("tr");
//       rows[i].forEach((cell) => {
//         const td = document.createElement("td");
//         td.textContent = cell;
//         row.appendChild(td);
//       });
//       table.appendChild(row);
//     }
//   })
//   .catch((err) => {
//     document.body.innerHTML += "<p>Error al cargar los datos.</p>";
//     console.error("Error leyendo el CSV:", err);
//   });
// }

function obtenerDatosBruto(CSV_URL){
  fetch(CSV_URL)
  .then(response => response.text())
  .then(csv => {
    
    const pre = document.createElement('pre'); // crea un bloque de texto preformateado
    pre.textContent = csv;
    document.body.appendChild(pre);
  })
  .catch(err => {
    document.body.innerHTML += "<p>Error al cargar los datos.</p>";
    console.error("Error leyendo el CSV:", err);
  });
}

// obtenerResultados(CSV_URL_RESULTADOS)

// obtenerDatosBruto(CSV_URL_RESULTADOS)

const escudos = {
  "Club A": "https://via.placeholder.com/60?text=A",
  "Club B": "https://via.placeholder.com/60?text=B",
  "Club C": "https://via.placeholder.com/60?text=C",
  "Club D": "https://via.placeholder.com/60?text=D"
};

function obtenerResultadosPartidos(url) {
  fetch(url)
    .then(res => res.text())
    .then(csv => {
      const lineas = csv.split(/\r?\n/).slice(4); // Omitir encabezados

      const resultados = [];

      for (const linea of lineas) {
        if (!linea.trim()) continue;

        const columnas = linea.split(",");

        const hora = columnas[0]?.trim();

        const partido1 = columnas[1]?.trim();
        const resultado1 = columnas[4]?.trim();

        const partes = partido1.split(" vs ");
        const local = partes[0]?.trim();
        const visitante = partes[1]?.trim();

        if (partido1 && resultado1) {
          resultados.push({
            hora,
            grupo: 1,
            campo: 'Campo 1',
            partido: partido1,
            local: local,
            visitante: visitante,
            resultado: resultado1
          });
        }

        const partido2 = columnas[5]?.trim();
        const resultado2 = columnas[8]?.trim();

        const partes2 = partido1.split(" vs ");
        const local2 = partes[0]?.trim();
        const visitante2 = partes[1]?.trim();

        if (partido2 && resultado2) {
          resultados.push({
            hora,
            grupo: 2,
            campo: 'Campo 2',
            partido: partido2,
            local: local2,
            visitante: visitante2,
            resultado: resultado2
          });
        }
      }

      console.log(resultados);
      renderizarTarjetas(resultados);
    })
    .catch(err => {
      document.body.innerHTML += "<p>Error al cargar los datos.</p>";
      console.error("Error leyendo el CSV:", err);
    });
}

function renderizarTarjetas(resultados) {
  const contenedor = document.getElementById("contenedor-tarjetas");
  resultados.forEach(res => {

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
      <div class="equipos">
        <div class="equipo">
          <strong>${res.local}</strong>
          <img src="img/equipos/${res.local}.jpeg" alt="Escudo ${res.local}">
        </div>
        <div class="equipo">
          <strong>${res.visitante}</strong>
          <img src="img/equipos/${res.visitante}.jpeg" alt="Escudo ${res.visitante}">
        </div>
      </div>

      <div class="resultado">${res.resultado}</div>

      <div class="info-extra">
        <p>Hora: ${res.hora}</p>
        <p>Grupo: ${res.grupo}</p>
        <p>Campo: ${res.campo}</p>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

obtenerResultadosPartidos(CSV_URL_RESULTADOS);


obtenerResultadosPartidos(CSV_URL_RESULTADOS)
obtenerClasificacion(CSV_URL_CLASIFICACION)