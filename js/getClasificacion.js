const CSV_URL_CLASIFICACION =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=2104840114&single=true&output=csv";

const escudos = {
  "C.D.Lugo": "img/equipos/lugo.png",
  "S.R. Calo": "img/equipos/calo.png",
  "Famalicao": "img/equipos/familiaçao.png",
  "Santa Mariña": "img/equipos/santamarina.png",
  "Ural C.F.": "img/equipos/ural.png",
  "Pabellón Ourense": "img/equipos/pabellon.png",
  "S.D. Villestro": "img/equipos/villestro.png",
  "Val Miñor": "img/equipos/valminor.jpg",
  "SP. Portugal Acad.": "img/equipos/spacademy.png",
  "Victoria C.F.": "img/equipos/victoria.png",
  "G.D. Chaves": "img/equipos/chaves.png",
  "Atl. Arteixo": "img/equipos/arteixo.png",
};
let gruposCompletos = {};

function obtenerClasificacionCSV(url) {
  fetch(url)
    .then((res) => res.text())
    .then((csv) => {
      const lineas = csv.trim().split(/\r?\n/);
      const grupos = {};
      let grupoActual = null;

      for (const linea of lineas) {
        const columnas = linea.split(",").map((col) => col.trim());

        if (/CLASIFICACIÓN GRUPO/i.test(columnas[0])) {
          grupoActual = columnas[0];
          grupos[grupoActual] = { headers: [], equipos: [] };
          continue;
        }

        if (!grupoActual || columnas.every((c) => c === "")) continue;

        if (columnas[0].toLowerCase() === "equipo") {
          grupos[grupoActual].headers = columnas.filter((c) => c !== "");
        } else {
          grupos[grupoActual].equipos.push(columnas.filter((c) => c !== ""));
        }
      }
      gruposCompletos = grupos;
      renderizarClasificacion(grupos);
    })
    .catch((err) => {
      console.error("Error leyendo CSV:", err);
      document.body.innerHTML += "<p>Error cargando la clasificación.</p>";
    });
}
function renderizarClasificacion(grupos) {
  const contenedor = document.getElementById("clasificacion");
  const mostrarTablaCompletaBtn = document.getElementById("mostrarTablaCompleta"); 
  if (!contenedor) {
    console.warn("No se encontró el contenedor #clasificacion");
    return;
  }

  contenedor.innerHTML = "";

  Object.entries(grupos).forEach(([nombreGrupo, datosGrupo]) => {
    const grupoDiv = document.createElement("div");
    grupoDiv.className = "grupo-clasificacion";

    grupoDiv.innerHTML += `<h1>${nombreGrupo}</h1>`;

    const tabla = document.createElement("table");
    tabla.className = "tabla-clasificacion";

    // Cabecera
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    // Filtramos solo las columnas necesarias (índices de las columnas a mostrar inicialmente)
    const columnasVisiblesIndices = [0, 1, 2, 8]; // Indices de las columnas: 'EQUIPO', 'PTS', 'J', 'DG'
    datosGrupo.headers.forEach((header, idx) => {
      if (columnasVisiblesIndices.includes(idx)) {
        const th = document.createElement("th");
        th.textContent = header;
        trHead.appendChild(th);
      }
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // Cuerpo
    const tbody = document.createElement("tbody");
    datosGrupo.equipos.forEach((fila, index) => {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("pos-1");
      else if (index === 1) tr.classList.add("pos-2");
      else if (index === 2) tr.classList.add("pos-3");
      else if (index === 3) tr.classList.add("pos-4");
      else if (index === 4) tr.classList.add("pos-5");
      else if (index === 5) tr.classList.add("pos-6");

      fila.forEach((dato, idx) => {
        if (columnasVisiblesIndices.includes(idx)) { // Solo añadir las celdas visibles
          const td = document.createElement("td");
          if (idx === 0) {
            td.innerHTML = `<img src="${escudos[dato] || "img/equipos/default.png"}" alt="Escudo ${dato}" class="escudo-clasificacion"> ${dato}`;
          } else {
            td.textContent = dato;
          }
          tr.appendChild(td);
        }
      });
      tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    grupoDiv.appendChild(tabla);
    contenedor.appendChild(grupoDiv);

    // Botón para mostrar la tabla completa
    mostrarTablaCompletaBtn.style.display = "inline-block";
  });

  document.getElementById("loading").style.display = "none";

  document.getElementById("volverClasificacionPequena").style.display = "none";


  // Agregamos el evento para mostrar la tabla completa
  mostrarTablaCompletaBtn.addEventListener("click", function () {
    mostrarTablaCompleta(gruposCompletos);
  });
}


function mostrarTablaCompleta(grupos) {
  const contenedor = document.getElementById("clasificacion");
  if (!contenedor) {
    console.warn("No se encontró el contenedor #clasificacion");
    return;
  }

  contenedor.innerHTML = "";


  Object.entries(grupos).forEach(([nombreGrupo, datosGrupo]) => {
    const grupoDiv = document.createElement("div");
    grupoDiv.className = "grupo-clasificacion";

    grupoDiv.innerHTML += `<h1>${nombreGrupo}</h1>`;

    const tabla = document.createElement("table");
    tabla.className = "tabla-clasificacion";

    // Cabecera
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    datosGrupo.headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // Cuerpo
    const tbody = document.createElement("tbody");
    datosGrupo.equipos.forEach((fila, index) => {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("pos-1");
      else if (index === 1) tr.classList.add("pos-2");
      else if (index === 2) tr.classList.add("pos-3");
      else if (index === 3) tr.classList.add("pos-4");
      else if (index === 4) tr.classList.add("pos-5");
      else if (index === 5) tr.classList.add("pos-6");
      fila.forEach((dato, idx) => {
        const td = document.createElement("td");
        if (idx === 0) {
          td.innerHTML = `<img src="${escudos[dato] || "img/equipos/default.png"}" alt="Escudo ${dato}" class="escudo-clasificacion"> ${dato}`;
        } else {
          td.textContent = dato;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    grupoDiv.appendChild(tabla);
    contenedor.appendChild(grupoDiv);
  });

  // Ocultar el botón una vez la tabla completa se haya mostrado
  document.getElementById("mostrarTablaCompleta").style.display = "none";

  document.getElementById("volverClasificacionPequena").style.display = "block";


  // Agregar evento para el botón "Volver a la Clasificación Pequeña"
  document.getElementById("volverClasificacionPequena").addEventListener("click", function () {
    renderizarClasificacion(gruposCompletos);
  });
}


// ✅ Llamada para ejecutar
obtenerClasificacionCSV(CSV_URL_CLASIFICACION);
