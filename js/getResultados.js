
const CSV_URL_RESULTADOS =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=597302420&single=true&output=csv";


// function obtenerDatosBruto(CSV_URL) {
//   fetch(CSV_URL)
//     .then((response) => response.text())
//     .then((csv) => {
//       const pre = document.createElement("pre"); // crea un bloque de texto preformateado
//       pre.textContent = csv;
//       document.body.appendChild(pre);
//     })
//     .catch((err) => {
//       document.body.innerHTML += "<p>Error al cargar los datos.</p>";
//       console.error("Error leyendo el CSV:", err);
//     });
// }

const escudos = {
  "C.D. Lugo": "/img/equipos/Lugo.png",
  "S.R. Calo": "/img/equipos/Calo.jpeg",
  "Familaçao": "/img/equipos/Familiaçao.png",
  "Santa Mariña": "/img/equipos/Santa mariña.png",
  "Ural C.F.": "/img/equipos/Ural.jpg",
  "Pabellón Ourense": "/img/equipos/Pabellon.png",
  "Racing Ferrol": "/img/equipos/Ferrol.png",
  "Val Miñor": "/img/equipos/Val miñor.jpg",
  "Sp. Portugal": "/img/equipos/Sp Academy.jpg",
  "Victoria C.F.": "/img/equipos/Victoria.png",
  "G.D. Chaves": "/img/equipos/chaves.png",
  "Atl. Arteixo": "/img/equipos/Arteixo.jpg",
};

function obtenerResultadosPartidos(url) {
  fetch(url)
    .then((res) => res.text())
    .then((csv) => {
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
            campo: "Campo 1",
            partido: partido1,
            local: local,
            visitante: visitante,
            resultado: resultado1,
          });
        }

        const partido2 = columnas[5]?.trim();
        const resultado2 = columnas[8]?.trim();

        const partes2 = partido2.split(" vs ");
        const local2 = partes2[0]?.trim();
        const visitante2 = partes2[1]?.trim();

        if (partido2 && resultado2) {
          resultados.push({
            hora,
            grupo: 2,
            campo: "Campo 2",
            partido: partido2,
            local: local2,
            visitante: visitante2,
            resultado: resultado2,
          });
        }
      }

      console.log(resultados);
      renderizarTarjetas(resultados);
    })
    .catch((err) => {
      document.body.innerHTML += "<p>Error al cargar los datos.</p>";
      console.error("Error leyendo el CSV:", err);
    });
}

function renderizarTarjetas(resultados) {
  const contenedor = document.getElementById("contenedor-tarjetas");
  resultados.forEach((res) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
      <div class="equipos">
        <div class="equipo">
          <strong>${res.local}</strong>
          <img src="${
            escudos[res.local] || "/img/equipos/default.png"
          }" alt="Escudo ${res.local}">
        </div>
        <div class="equipo">
          <strong>${res.visitante}</strong>
          <img src="${
            escudos[res.visitante] || "/img/equipos/default.png"
          }" alt="Escudo ${res.visitante}">
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
  document.getElementById("loading").style.display = "none";
}

obtenerResultadosPartidos(CSV_URL_RESULTADOS);

