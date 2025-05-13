const CSV_URL_CLASIFICACION =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=2104840114&single=true&output=csv";

const escudos = {
  "C.D.Lugo": "img/equipos/lugo.png",
  "S.R. Calo": "img/equipos/calo.jpeg",
  "Familaçao": "img/equipos/familiaçao.png",
  "F.C. Famalicão": "img/equipos/familiaçao.png",
  "Ural C.F.": "img/equipos/ural.jpg",
  "Santa Mariña": "img/equipos/santamarina.png",
  "Pabellón Ourense": "img/equipos/pabellon.png",
  "Racing Ferrol": "img/equipos/ferrol.png",
  "Val Miñor": "img/equipos/valminor.jpg",
  "SP. Portugal Acad.": "img/equipos/spacademy.jpg",
  "Victoria C.F.": "img/equipos/victoria.png",
  "G.D. Chaves": "img/equipos/chaves.png",
  "Atl. Arteixo": "img/equipos/arteixo.png",
};

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

      renderizarClasificacion(grupos);
    })
    .catch((err) => {
      console.error("Error leyendo CSV:", err);
      document.body.innerHTML += "<p>Error cargando la clasificación.</p>";
    });
}

function renderizarClasificacion(grupos) {
  const contenedor = document.getElementById("clasificacion");
  if (!contenedor) {
    console.warn("No se encontró el contenedor #clasificacion");
    return;
  }

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
  document.getElementById("loading").style.display = "none";
}

// ✅ Llamada para ejecutar
obtenerClasificacionCSV(CSV_URL_CLASIFICACION);
