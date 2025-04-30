const CSV_URL_CLASIFICACION =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdxnuyx7os2-KOzHq8YjIY2HxfFuPhCTZ11MLNRMfImX7rj2tYG71uave1_cfO3g/pub?gid=778009378&single=true&output=csv";

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

function obtenerResultados(CSV_URL){
  fetch(CSV_URL)
  .then((response) => response.text())
  .then((csv) => {
    const rows = csv
      .trim()
      .split("\n")
      .map((row) => row.split(","));
    const table = document.getElementById("tabla-resultados");

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

obtenerClasificacion(CSV_URL_CLASIFICACION)
obtenerResultados(CSV_URL_RESULTADOS)
