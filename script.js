const fases = {
  octavos: [
    ['FC Porto', 'Atlético de Madrid'],
    ['Bayern Munchen', 'Flamengo'],
    ['Inter de Milan', 'Fluminense'],
    ['Manchester City', 'Al Hilal SFC'],
    ['Paris Saint-Germain', 'Palmeiras'],
    ['Chelsea FC', 'SL Benfica'],
    ['Borussia Dortmund', 'River Plate'],
    ['Real Madrid CF', 'Juventus FC']
  ],
  cuartos: [[], [], [], []],
  semis: [[], []],
  final: [[]]
};

const logos = {
  "FC Porto": "assets/fc_porto.png",
  "Atlético de Madrid": "assets/atletico_madrid.png",
  "Bayern Munchen": "assets/bayern_munchen.png",
  "Flamengo": "assets/flamengo.png",
  "Inter de Milan": "assets/inter_milan.png",
  "Fluminense": "assets/fluminense.png",
  "Manchester City": "assets/manchester_city.png",
  "Al Hilal SFC": "assets/al_hilal.png",
  "Paris Saint-Germain": "assets/psg.png",
  "Palmeiras": "assets/palmeiras.png",
  "Chelsea FC": "assets/chelsea.png",
  "SL Benfica": "assets/benfica.png",
  "Borussia Dortmund": "assets/borussia_dortmund.png",
  "River Plate": "assets/river_plate.png",
  "Real Madrid CF": "assets/real_madrid.png",
  "Juventus FC": "assets/juventus.png"
};

const seleccionados = {};

function crearPartidos(fase, partidos) {
  const contenedor = document.getElementById('contenedor');
  const divFase = document.createElement('div');
  divFase.className = 'round';

  const titulo = document.createElement('h3');
  titulo.textContent = fase.charAt(0).toUpperCase() + fase.slice(1);
  divFase.appendChild(titulo);

  partidos.forEach((equipo, i) => {
    const matchId = `${fase}${i+1}`;
    const divMatch = document.createElement('div');
    divMatch.className = 'match';
    divMatch.setAttribute('data-match', matchId);
    divMatch.innerHTML = equipo.length > 0 ? `${equipo[0]} vs ${equipo[1]}` : `Esperando...`;

    const logosDiv = document.createElement('div');
    logosDiv.className = 'logo-container';

    equipo.forEach(nombre => {
      const img = document.createElement('img');
      img.src = logos[nombre];
      img.className = 'logo';
      img.setAttribute('data-team', nombre);
      img.setAttribute('onclick', `seleccionarEquipo(this, '${matchId}')`);
      logosDiv.appendChild(img);
    });

    divMatch.appendChild(logosDiv);

    const divMarcadores = document.createElement('div');
    divMarcadores.className = 'marcadores';
    divMarcadores.innerHTML = `
      <input type="number" id="m_${matchId}_a" placeholder="A" min="0">
      <input type="number" id="m_${matchId}_b" placeholder="B" min="0">
    `;

    divMatch.appendChild(divMarcadores);
    divFase.appendChild(divMatch);
  });

  contenedor.appendChild(divFase);
}

function seleccionarEquipo(elemento, matchId) {
  const logos = document.querySelectorAll(`[data-match="${matchId}"] .logo`);
  logos.forEach(logo => logo.classList.remove("selected"));
  elemento.classList.add("selected");
  seleccionados[matchId] = elemento.getAttribute("data-team");
  actualizarFase(matchId);
}

function actualizarFase(matchId) {
  const fasesOrden = ['octavos', 'cuartos', 'semis', 'final'];
  for (let i = 0; i < fasesOrden.length - 1; i++) {
    const fase = fasesOrden[i];
    if (matchId.startsWith(fase)) {
      const index = parseInt(matchId.replace(fase, '')) - 1;
      const nuevoFase = fasesOrden[i + 1];
      const pos = Math.floor(index / 2);
      fases[nuevoFase][pos][index % 2] = seleccionados[matchId];
      redibujar();
      break;
    }
  }
}

function redibujar() {
  document.getElementById('contenedor').innerHTML = '';
  for (const fase in fases) {
    crearPartidos(fase, fases[fase]);
  }
}

function guardarQuiniela() {
  const nombre = document.getElementById('nombre').value || 'Participante';
  let resumen = `<h2>Quiniela de ${nombre}</h2><h3>Marcadores:</h3><ul>`;
  for (let matchId in seleccionados) {
    const a = document.getElementById(`m_${matchId}_a`)?.value ?? '';
    const b = document.getElementById(`m_${matchId}_b`)?.value ?? '';
    resumen += `<li>${matchId.toUpperCase()}: ${a || 0} - ${b || 0} | Ganador: ${seleccionados[matchId]}</li>`;
  }
  resumen += "</ul>";
  document.getElementById('resultado').innerHTML = resumen;
}

// Inicializar
redibujar();