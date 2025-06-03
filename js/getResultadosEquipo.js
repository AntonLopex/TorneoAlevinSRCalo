
const CSV_URL_RESULTADOS =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-cKi7PXQIvUCei0LnpprMcwMBKvjXa955mYqFZygYzYuh08zlKP8JCmSero4jw/pub?gid=597302420&single=true&output=csv";


const escudos = {
  "C.D. Lugo": "img/equipos/lugo.png",
  "S.R. Calo": "img/equipos/calo.png",
  "F.C. Famalicão": "img/equipos/familiaçao.png",
  "Santa Mariña": "img/equipos/santamarina.png",
  "Ural C.F.": "img/equipos/ural.png",
  "Pabellón Ourense": "img/equipos/pabellon.png",
  "S.D. Villestro": "img/equipos/villestro.png",
  "Val Miñor": "img/equipos/valminor.jpg",
  "Sp. Portugal": "img/equipos/spacademy.png",
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
      <div class="resultado-partido">
        <div class="equipo-lado">
          <p>${res.local}</p>
          <img src="${escudos[res.local] || '/img/equipos/default.png'}" alt="${res.local}">
        </div>

        <div class="marcador-central">
          <p class="resultado">${res.resultado}</p>
          <p class="info">Hora: ${res.hora}</p>
          <p class="info">Grupo: ${res.grupo}</p>
          <p class="info">Campo: ${res.campo}</p>
        </div>

        <div class="equipo-lado">
          <p>${res.visitante}</p>
          <img src="${escudos[res.visitante] || '/img/equipos/default.png'}" alt="${res.visitante}">
        </div>
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