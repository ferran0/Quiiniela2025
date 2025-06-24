const fases = {
  octavos: [
    ['Palmeiras', 'Botafogo'],
    ['Bayern Munchen', 'Chelsea FC'],
    ['Inter de Milan', 'Fluminense'],
    ['Manchester City', 'Al Hilal SFC'],
    ['Paris Saint-Germain', 'Inter Miami'],
    ['Flamengo', 'SL Benfica'],
    ['Borussia Dortmund', 'River Plate'],
    ['Real Madrid CF', 'Juventus FC']
  ],
  cuartos: [[], [], [], []],
  semis: [[], []],
  final: [[]]
};

const logos = {
  "Palmeiras": "assets/palmeiras.png",
  "Botafogo": "assets/botafogo.png",
  "Bayern Munchen": "assets/bayern_munchen.png",
  "Flamengo": "assets/flamengo.png",
  "Inter de Milan": "assets/inter_milan.png",
  "Fluminense": "assets/fluminense.png",
  "Manchester City": "assets/manchester_city.png",
  "Al Hilal SFC": "assets/al_hilal.png",
  "Paris Saint-Germain": "assets/psg.png",
  "Inter Miami": "assets/inter_miami.png",
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
    const matchId = `${fase}${i + 1}`;
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
      <input type="number" id="m_${matchId}_a" placeholder="goles" min="0">
      <input type="number" id="m_${matchId}_b" placeholder="goles" min="0">
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
      const nuevaFase = fasesOrden[i + 1];
      const pos = Math.floor(index / 2);
      fases[nuevaFase][pos][index % 2] = seleccionados[matchId];
      redibujar();
      break;
    }
  }
}

function redibujar() {
  const golesTemp = {};
  const inputs = document.querySelectorAll('.marcadores input');
  inputs.forEach(input => {
    golesTemp[input.id] = input.value;
  });

  document.getElementById('contenedor').innerHTML = '';
  for (const fase in fases) {
    crearPartidos(fase, fases[fase]);
  }

  for (const id in golesTemp) {
    const input = document.getElementById(id);
    if (input) {
      input.value = golesTemp[id];
    }
  }
}

function guardarQuiniela() {
  const nombre = document.getElementById('nombre').value || 'Participante';
  const fecha = document.getElementById('fecha').value || 'Sin fecha';
  const campeon = seleccionados['final1'] || 'No seleccionado';
  const logo = logos[campeon] || '';

  document.getElementById('resultado').innerHTML = `
    <h2>Quiniela de ${nombre}</h2>
    <p><strong>Fecha de registro:</strong> ${fecha}</p>
    <p><strong>Campeón seleccionado:</strong> ${campeon}</p>
    ${logo ? `<img src="${logo}" alt="${campeon}" style="width: 100px;">` : ''}
  `;

  let resumenHTML = `
    <h1>Quiniela - Mundial de Clubes 2025</h1>
    <p><strong>Participante:</strong> ${nombre}</p>
    <p><strong>Fecha de registro:</strong> ${fecha}</p>
    <h2>Predicciones por Fase</h2>
  `;

  const fasesOrden = ['octavos', 'cuartos', 'semis', 'final'];
  fasesOrden.forEach(fase => {
    resumenHTML += `<h3>${fase.charAt(0).toUpperCase() + fase.slice(1)}</h3><ul>`;
    fases[fase].forEach((partido, i) => {
      const matchId = `${fase}${i + 1}`;
      const ganador = seleccionados[matchId];
      if (partido[0] && partido[1]) {
        resumenHTML += `<li><strong>${partido[0]}</strong> vs <strong>${partido[1]}</strong> → <span style="color:#ffcc00">${ganador || 'Sin seleccionar'}</span></li>`;
      }
    });
    resumenHTML += `</ul>`;
  });

  resumenHTML += `<h2>Campeón: ${campeon}</h2>`;
  if (logo) {
    resumenHTML += `<img src="${logo}" alt="${campeon}" style="width: 120px;">`;
  }

  document.getElementById('resumenPDF').innerHTML = resumenHTML;
  document.getElementById('resumenPDF').style.display = 'block';
}



// Inicializar al cargar
redibujar();
