
const CSV_URL_RESULTADOS =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=597302420&single=true&output=csv";


const escudos = {
  "C.D. Lugo": "img/equipos/lugo.png",
  "S.R. Calo": "img/equipos/calo.jpeg",
  "F.C. Famalicão": "img/equipos/familiaçao.png",
  "Santa Mariña": "img/equipos/santamarina.png",
  "Ural C.F.": "img/equipos/ural.jpg",
  "Pabellón Ourense": "img/equipos/pabellon.png",
  "Racing Ferrol": "img/equipos/ferrol.png",
  "Val Miñor": "img/equipos/valminor.jpg",
  "Sp. Portugal": "img/equipos/spacademy.jpg",
  "Victoria C.F.": "img/equipos/victoria.png",
  "G.D. Chaves": "img/equipos/chaves.png",
  "Atl. Arteixo": "img/equipos/arteixo.png",
};

function obtenerResultadosDeEquipo(equipoNombre) {
    fetch(CSV_URL_RESULTADOS)
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
  
          if (partido1 && resultado1) {
            const [local, visitante] = partido1.split(" vs ").map((e) => e.trim());
            if (local === equipoNombre || visitante === equipoNombre) {
              resultados.push({
                hora,
                grupo: 1,
                campo: " 1",
                partido: partido1,
                local,
                visitante,
                resultado: resultado1,
              });
            }
          }
  
          const partido2 = columnas[5]?.trim();
          const resultado2 = columnas[8]?.trim();
  
          if (partido2 && resultado2) {
            const [local2, visitante2] = partido2.split(" vs ").map((e) => e.trim());
            if (local2 === equipoNombre || visitante2 === equipoNombre) {
              resultados.push({
                hora,
                grupo: 2,
                campo: " 2",
                partido: partido2,
                local: local2,
                visitante: visitante2,
                resultado: resultado2,
              });
            }
          }
        }
  
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

function verResultados(nombreEquipo) {
    // Codifica el nombre del equipo para evitar problemas con espacios u otros caracteres
    const nombreCodificado = encodeURIComponent(nombreEquipo);
    // Redirige a la página de resultados con el equipo como parámetro en la URL
    window.location.href = `resultados-equipos.html?equipo=${nombreCodificado}`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const nombreEquipo = params.get('equipo');
  
    if (nombreEquipo) {
        obtenerResultadosDeEquipo(nombreEquipo);
    } else {
      document.getElementById('resultados-equipo').textContent = 'No se ha especificado el equipo.';
    }
  });