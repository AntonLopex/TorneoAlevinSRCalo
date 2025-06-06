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
  "S.R. Calo B": "img/equipos/calob.png",
  "Victoria C.F.": "img/equipos/victoria.png",
  "G.D. Chaves": "img/equipos/chaves.png",
  "Atl. Arteixo": "img/equipos/arteixo.png",
};

const enfrentamientosPlaceholder = {
  plata: {
    Semifinais: [
      {
        hora: "18:15",
        campo: "Campo 1",
        local: "5º Grupo A",
        visitante: "6º Grupo B",
        resultado: "Por definir",
      },
      {
        hora: "18:15",
        campo: "Campo 2",
        local: "5º Grupo A",
        visitante: "6º Grupo B",
        resultado: "Por definir",
      },
    ],
    Final: [
      {
        hora: "19:15",
        campo: "Campo 1",
        local: "Ganador Semifinal A",
        visitante: "Ganador Semifinal B",
        resultado: "Por definir",
      },
    ],
  },
  oro: {
    "Cuartos de final": [
      {
        hora: "17:15",
        campo: "Campo 1",
        local: "1º Grupo A",
        visitante: "4º Grupo B",
        resultado: "Por definir",
      },
      {
        hora: "17:15",
        campo: "Campo 2",
        local: "1º Grupo B",
        visitante: "4º Grupo A",
        resultado: "Por definir",
      },
      {
        hora: "17:45",
        campo: "Campo 1",
        local: "2º Grupo  A",
        visitante: "3º Grupo B",
        resultado: "Por definir",
      },
      {
        hora: "17:45",
        campo: "Campo 2",
        local: "2º Grupo B",
        visitante: "3º Grupo A",
        resultado: "Por definir",
      },
    ],
    Semifinais: [
      {
        hora: "18:45",
        campo: "Campo 1",
        local: "Ganador Cuartos A",
        visitante: "Ganador Cuartos D",
        resultado: "Por definir",
      },
      {
        hora: "18:45",
        campo: "Campo 2",
        local: "Ganador Cuartos B",
        visitante: "Ganador Cuartos C",
        resultado: "Por definir",
      },
    ],
    Final: [
      {
        hora: "19:45",
        campo: "Campo 1",
        local: "Ganador Semifinal A",
        visitante: "Ganador Semifinal B",
        resultado: "Por definir",
      },
    ],
  },
};

let datosPorLinea = [];

fetch(CSV_URL_RESULTADOS)
  .then((res) => res.text())
  .then((csv) => {
    const lineas = csv.split(/\r?\n/).slice(29);
    datosPorLinea = lineas.map((linea) =>
      linea.split(",").map((c) => c.trim())
    );
    cambiarFase(); // Iniciar con la fase por defecto
    document.getElementById("loading").style.display = "none";
    document.getElementById("selector").style.display = "block";
  })
  .catch((err) => {
    document.body.innerHTML += "<p>Error al cargar los datos.</p>";
    console.error("Error leyendo el CSV:", err);
  });

const lineaMapeo = {
  oro: {
    "Cuartos de final": [0, 1],
    Semifinais: [3],
    Final: [5],
  },
  plata: {
    Semifinais: [2],
    Final: [4],
  },
};

function mostrarPartidos(fase, ronda) {
  const lineas = lineaMapeo[fase][ronda];
  const resultados = [];

  if (!lineas || !Array.isArray(lineas)) return;

  for (const linea of lineas) {
    const datos = datosPorLinea[linea];
    if (!datos) continue;

    const hora = datos[0];

    const partido1 = datos[1];
    const resultado1 = datos[4];
    const partido2 = datos[5];
    const resultado2 = datos[8];
    let resultado1F;

    function procesarResultado(resultado) {
      if (!resultado) return { resultado: null, resultadoPen: null };
      const match = resultado.match(/(.*?)\s*pen\((\d+-\d+)\)/i);
      if (match) {
        return {
          resultado: match[1].trim(),
          resultadoPen: match[2].trim(),
        };
      }
      return {
        resultado: resultado.trim(),
        resultadoPen: null,
      };
    }

    if (!resultado1) {
      resultado1F = datos[8];
    } else {
      resultado1F = resultado1;
    }

    if (partido1 && resultado1F) {
      const { resultado, resultadoPen } = procesarResultado(resultado1F);
      const [local, visitante] = partido1.split(" vs ").map((e) => e.trim());
      resultados.push({
        hora,
        campo: "Campo 1",
        partido: partido1,
        local,
        visitante,
        resultado: resultado,
        resultadoPen,
      });
    }

    if (partido2 && resultado2) {
      const { resultado, resultadoPen } = procesarResultado(resultado2);
      const [local2, visitante2] = partido2.split(" vs ").map((e) => e.trim());
      resultados.push({
        hora,
        campo: "Campo 2",
        partido: partido2,
        local: local2,
        visitante: visitante2,
        resultado: resultado,
        resultadoPen,
      });
    }
  }
  if (resultados.length == 0 && enfrentamientosPlaceholder[fase]?.[ronda]) {
    renderizarTarjetas(enfrentamientosPlaceholder[fase][ronda], ronda);
  } else {
    renderizarTarjetas(resultados, ronda);
  }
}

function renderizarTarjetas(resultados, ronda) {
  const contenedor = document.getElementById("contenedor-tarjetas");
  contenedor.innerHTML = ""; // Limpiar contenido previo

  if (resultados.length) {
    resultados.forEach((res, index) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      const nombrePartido = obtenerNombrePartido(ronda, index);

      tarjeta.innerHTML = `
        <div class="nombre-partido"><strong>${nombrePartido}</strong></div>
        <div class="resultado-partido">
          <div class="equipo-lado">
            <p>${res.local}</p>
            <img 
            src="${escudos[res.local] ? escudos[res.local] : "img/equipos/interrog.png"}" 
            alt="${res.local}" 
            onerror="this.src='img/equipos/interrog.png'"
            >
          </div>

          <div class="marcador-central">
            <p class="resultado">
              ${res.resultado} 
              ${res.resultadoPen ? `<br><small> (${res.resultadoPen})</small>` : ""}
            </p>
            <p class="info">Hora: ${res.hora}</p>
            <p class="info">${res.campo}</p>
          </div>

          <div class="equipo-lado">
            <p>${res.visitante}</p>
            <img 
            src="${escudos[res.visitante] ? escudos[res.visitante] : 'img/equipos/interrog.png'}" 
            alt="${res.visitante}" 
            onerror="this.src='img/equipos/interrog.png'"
            >
          </div>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  }
}

function cambiarFase() {
  const faseSeleccionada = document.getElementById("fase").value;
  const menuRondas = document.getElementById("menu-rondas");

  const rondas =
    faseSeleccionada === "oro"
      ? ["Cuartos de final", "Semifinais", "Final"]
      : ["Semifinais", "Final"];

  menuRondas.innerHTML = "";

  rondas.forEach((ronda) => {
    const btn = document.createElement("button");
    btn.className = "btn-ronda";
    btn.textContent = ronda;
    btn.onclick = () => mostrarPartidos(faseSeleccionada, ronda);
    menuRondas.appendChild(btn);
  });

  // Mostrar por defecto la primera ronda
  if (rondas.length > 0) mostrarPartidos(faseSeleccionada, rondas[0]);
}

function obtenerNombrePartido(fase, index) {
  if (fase === "Semifinais") {
    return `Semifinal ${index === 0 ? "A" : "B"}`;
  }
  if (fase === "Final") {
    return "Final";
  }
  if (fase === "Cuartos de final") {
    return `Cuartos ${String.fromCharCode(65 + index)}`; // A, B, C, D
  }
  return `Partido ${index + 1}`;
}
