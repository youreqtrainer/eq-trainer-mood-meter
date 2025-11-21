/* -----------------------
   MAPA DE EMOCIONES
----------------------- */

const emotions = {
  yellow: [
    ["Agradable","Complacido","Energético","Nervioso","Sorprendido"],
    ["Jubiloso","Feliz","Animado","Animado","Excitado"],
    ["Concentrado","Esperanzado","Entusiasta","Motivado","Festivo"],
    ["A gusto","Orgulloso","Optimista","Inspirado","Dichoso"],
    ["Positivo","Encantado","Emocionado","Exaltado","Eufórico"]
  ],

  red: [
    ["Tocado","Molesto","Inquieto","Aturdido","Conmocionado"],
    ["Desasosegado","Irritado","Nervioso","Tenso","Agitado"],
    ["Alarmado","Preocupado","Enojado","Frustrado","Estresado"],
    ["Irascible","Aprensivo","Atemorizado","Furioso","Pánico"],
    ["Disgustado","Ansioso","Enfurecido","Con cólera","Ira"]
  ],

  blue: [
    ["Apático","Aburrido","Cansado","Fatigado","Agotado"],
    ["Decaído","Triste","Descorazonado","Exhausto","Devastado"],
    ["Decepcionado","Desalentado","Solitario","Sin ganas","Desolado"],
    ["Sombrío","Malhumorado","Miserable","Deprimido","Desesperanzado"],
    ["Disgustado","Negativo","Aislado","Abatido","Desesperado"]
  ],

  green: [
    ["Agradable","Complacido","Energético","Nervioso","Sorprendido"],
    ["Jubiloso","Feliz","Animado","Animado","Excitado"],
    ["Concentrado","Esperanzado","Entusiasta","Motivado","Festivo"],
    ["A gusto","Orgulloso","Optimista","Inspirado","Dichoso"],
    ["Positivo","Encantado","Emocionado","Exaltado","Eufórico"]
  ]
};

/* Colores clásicos del Mood Meter para canvas */
const mmColors = {
  red:    "#e63946",
  yellow: "#f1fa3c",
  blue:   "#457b9d",
  green:  "#2ecc71"
};

/* -----------------------
   MAPEO DE ACTIVACIÓN
----------------------- */

function getActivationInfo(quadrant) {
  switch (quadrant) {
    case "Rojo":
      return {
        short: "Simpática-Desagradable",
        code: "ASD",
        long: "Activación Simpática Desagradable: representa un modo defensivo de alerta, con hiperactivación autonómica y aumento de cortisol, orientado a detectar amenazas y preparar respuestas de lucha o escape. Su función es reducir el riesgo mediante contención, priorización de seguridad y descarga fisiológica controlada. La recomendación directa sería: “Detén la escalada y regula el cuerpo primero, identifica la amenaza real y actúa únicamente cuando tu estado sea estable.”"
      };
    case "Amarillo":
      return {
        short: "Simpática-Agradable",
        code: "ASA",
        long: "Activación Simpática Agradable: suele reflejar un estado de energía orientada al logro, con incremento moderado del arousal, potenciación dopaminérgica y mayor disposición conductual. Su función primaria es movilizar recursos para explorar y ejecutar conductas dirigidas a objetivos sin comprometer la regulación. La recomendación directa sería: “Canaliza esta energía en una acción específica y estructurada que mantenga tu foco sin sobrepasar tus límites.”"
      };
    case "Verde":
      return {
        short: "Parasimpática-Agradable",
        code: "APA",
        long: "Activación Parasimpática Agradable: corresponde a un modo de reposo y vinculación, con predominancia vagal ventral capaz de sostener relajación, socialización y recuperación inmunometabólica. Su función es restaurar recursos, consolidar aprendizaje emocional y facilitar la conexión social segura. La recomendación directa sería: “Profundiza la sensación de calma y utilízala para fortalecer la conexión contigo y con otros.”"
      };
    case "Azul":
      return {
        short: "Parasimpática-Desagradable",
        code: "APS",
        long: "Activación Parasimpática Desagradable: remite a estados de inhibición, colapso o retirada, asociados al circuito vagal dorsal cuando se percibe impotencia o sobrecarga, favoreciendo la conservación de energía y la búsqueda de apoyo. Su función es detener el exceso de demanda, promover introspección segura y activar conductas que restauren co-regulación. La recomendación directa sería: “Pausa sin aislarte, respira lento y busca un punto de apoyo externo que te ayude a reorganizarte.”"
      };
    default:
      return {
        short: "No determinada",
        code: "",
        long: ""
      };
  }
}

/* -----------------------
   ESTADO DEL FLUJO
----------------------- */

let flow = {
  energy: null,        // alta / baja
  energyLevel: null,   // slider 1–5
  pleasant: null,      // agradable / desagradable
  pleasureLevel: null, // slider 1–5
  emotionIntensity: null,
  context: "",
  classified: null     // { quadrant, emotion }
};

let step = 0;
const flowContainer = document.getElementById("flow-container");

/* -----------------------
   RENDER DEL FLUJO
----------------------- */

function renderStep() {
  flowContainer.innerHTML = "";

  if (step === 0) {
    flowContainer.innerHTML = `
      <h2>¿Te sientes con energía o sin energía?</h2>
      <button class="flow-btn yellow" onclick="chooseEnergy('alta')">Alta energía</button>
      <button class="flow-btn blue" onclick="chooseEnergy('baja')">Baja energía</button>
    `;
  } else if (step === 1) {
    const value = flow.energyLevel ?? 3;
    flow.energyLevel = value;
    flowContainer.innerHTML = `
      <h2>Nivel de energía (1–5)</h2>
      <input type="range" min="1" max="5" value="${value}" class="slider"
        oninput="flow.energyLevel=this.value">
      <div class="slider-labels">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
      </div>
      <button class="primary" onclick="nextStep()">Continuar</button>
    `;
  } else if (step === 2) {
    flowContainer.innerHTML = `
      <h2>¿Lo que sientes es agradable o desagradable?</h2>
      <button class="flow-btn green" onclick="choosePleasant('agradable')">Agradable</button>
      <button class="flow-btn red" onclick="choosePleasant('desagradable')">Desagradable</button>
    `;
  } else if (step === 3) {
    const value = flow.pleasureLevel ?? 3;
    flow.pleasureLevel = value;
    flowContainer.innerHTML = `
      <h2>Intensidad de la sensación (1–5)</h2>
      <input type="range" min="1" max="5" value="${value}" class="slider"
        oninput="flow.pleasureLevel=this.value">
      <div class="slider-labels">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
      </div>
      <button class="primary" onclick="nextStep()">Continuar</button>
    `;
  } else if (step === 4) {
    flow.classified = classify();
    const value = flow.emotionIntensity ?? 5;
    flow.emotionIntensity = value;
    flowContainer.innerHTML = `
      <h2>Emoción identificada: ${flow.classified.emotion}</h2>
      <p class="helper-text">Intensidad de la emoción (1–10)</p>
      <input type="range" min="1" max="10" value="${value}" class="slider"
        oninput="flow.emotionIntensity=this.value">
      <div class="slider-labels">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
      </div>
      <button class="primary" onclick="nextStep()">Continuar</button>
    `;
  } else if (step === 5) {
    flowContainer.innerHTML = `
      <h2>¿Por qué crees que te sientes de esta manera?</h2>
      <textarea rows="3" placeholder="Describe brevemente la situación, personas o pensamientos asociados..."
        oninput="flow.context=this.value"></textarea>
      <button class="primary" onclick="showResult()">Ver resultado</button>
    `;
  }
}

function chooseEnergy(val) {
  flow.energy = val;
  nextStep();
}

function choosePleasant(val) {
  flow.pleasant = val;
  nextStep();
}

function nextStep() {
  step++;
  renderStep();
}

/* -----------------------
   CLASIFICACIÓN CUADRANTE
----------------------- */

function classify() {
  let energyLevel = Number(flow.energyLevel ?? 3);
  let pleasureLevel = Number(flow.pleasureLevel ?? 3);

  energyLevel = Math.min(5, Math.max(1, energyLevel));
  pleasureLevel = Math.min(5, Math.max(1, pleasureLevel));

  const row = energyLevel - 1;
  const col = pleasureLevel - 1;

  let quadrant = "";
  let list = [];

  if (flow.energy === "alta" && flow.pleasant === "agradable") {
    quadrant = "Amarillo";
    list = emotions.yellow;
  } else if (flow.energy === "alta" && flow.pleasant === "desagradable") {
    quadrant = "Rojo";
    list = emotions.red;
  } else if (flow.energy === "baja" && flow.pleasant === "desagradable") {
    quadrant = "Azul";
    list = emotions.blue;
  } else if (flow.energy === "baja" && flow.pleasant === "agradable") {
    quadrant = "Verde";
    list = emotions.green;
  }

  const emotionName = list[row]?.[col] ?? "Sin etiqueta";

  return {
    quadrant,
    emotion: emotionName
  };
}

/* -----------------------
   RESULTADO FINAL
----------------------- */

function showResult() {
  const res = flow.classified || classify();
  const activation = getActivationInfo(res.quadrant);

  const contexto = flow.context && flow.context.trim() !== "" ? flow.context.trim() : "No reportado";

  flowContainer.innerHTML = `
    <h2>Emoción identificada:</h2>

    <div class="output-box quadrant-${res.quadrant.toLowerCase()}">
      <p><strong>${res.emotion}.</strong></p>
      <p>Intensidad: ${flow.emotionIntensity || "—"}/10</p>
      <p>Activación: ${activation.short}</p>
      ${activation.long ? `<p style="margin-top:8px;font-size:0.85rem;">${activation.long}</p>` : ""}
      <p style="margin-top:8px;">Contexto: ${contexto}</p>
    </div>

    <button class="primary" onclick='saveResultAndGoDashboard(${JSON.stringify(res).replace(/"/g,"&quot;")})'>
      Guardar registro
    </button>

    <button class="secondary" onclick="restart()">Hacer otra medición</button>
  `;
}

function restart() {
  step = 0;
  flow = {
    energy: null,
    energyLevel: null,
    pleasant: null,
    pleasureLevel: null,
    emotionIntensity: null,
    context: "",
    classified: null
  };
  renderStep();
}

/* -----------------------
   HISTORIAL + NAVEGACIÓN DESDE RESUMEN
----------------------- */

function saveResultAndGoDashboard(data) {
  // Guardar
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    quadrant: data.quadrant,
    emotion: data.emotion,
    intensity: flow.emotionIntensity || null,
    context: flow.context || ""
  };

  const list = JSON.parse(localStorage.getItem("eqHistory") || "[]");
  list.push(entry);
  localStorage.setItem("eqHistory", JSON.stringify(list));

  // Opcionalmente podrías quitar el alert si lo ves molesto
  alert("Guardado correctamente");

  // Ir al dashboard
  goToSection("history");
}

/* -----------------------
   DASHBOARD: ESTADÍSTICAS + GRÁFICA
----------------------- */

function loadHistoryAndStats() {
  const list = JSON.parse(localStorage.getItem("eqHistory") || "[]");
  const historyContainer = document.getElementById("historyList");
  const statsContainer = document.getElementById("statsContainer");

  // Historial
  if (list.length === 0) {
    historyContainer.innerHTML = `<p class="helper-text">No hay mediciones guardadas todavía.</p>`;
  } else {
    historyContainer.innerHTML = list
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((e) => {
        const activation = getActivationInfo(e.quadrant);
        return `
        <div class="history-item quadrant-${e.quadrant.toLowerCase()}">
          <p><strong>Emoción: ${e.emotion}.</strong></p>
          <p>Intensidad de la emoción: ${e.intensity || "—"}/10</p>
          <p>Activación: ${activation.short}</p>
          <p>Fecha de registro: ${formatDate(e.createdAt)}.</p>
          ${e.context ? `<p>Contexto: ${e.context}</p>` : ""}
        </div>
      `;
      })
      .join("");
  }

  // Estadísticas
  const total = list.length;
  const mostFreqEmotion = getMostFrequent(list, "emotion");
  const mostFreqQuadrant = getMostFrequent(list, "quadrant");

  const quadrantCounts = countByQuadrant(list);
  const maxQuadrantCount = Math.max(...Object.values(quadrantCounts), 1);

  statsContainer.innerHTML = `
    <p><strong>Total de mediciones:</strong> ${total}</p>
    <p><strong>Emoción más frecuente:</strong> ${mostFreqEmotion || "—"}</p>
    <p><strong>Cuadrante más frecuente:</strong> ${mostFreqQuadrant || "—"}</p>

    <div style="margin-top:12px;">
      <p style="margin-bottom:4px;"><strong>Distribución por cuadrante:</strong></p>
      ${renderQuadrantBar("Rojo", quadrantCounts["Rojo"], maxQuadrantCount, "red")}
      ${renderQuadrantBar("Amarillo", quadrantCounts["Amarillo"], maxQuadrantCount, "yellow")}
      ${renderQuadrantBar("Verde", quadrantCounts["Verde"], maxQuadrantCount, "green")}
      ${renderQuadrantBar("Azul", quadrantCounts["Azul"], maxQuadrantCount, "blue")}
    </div>
  `;

  // Gráfica de evolución
  drawEvolutionChart(list);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatShortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit"
  });
}

function getMostFrequent(list, key) {
  if (!list.length) return null;
  const counts = {};
  list.forEach(e => {
    const val = e[key];
    if (!val) return;
    counts[val] = (counts[val] || 0) + 1;
  });
  let maxVal = null;
  let maxCount = 0;
  Object.entries(counts).forEach(([val, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxVal = val;
    }
  });
  return maxVal;
}

function countByQuadrant(list) {
  const base = { "Rojo":0, "Amarillo":0, "Azul":0, "Verde":0 };
  list.forEach(e => {
    if (base[e.quadrant] !== undefined) {
      base[e.quadrant]++;
    }
  });
  return base;
}

function renderQuadrantBar(name, count, max, colorClass) {
  const percent = max === 0 ? 0 : Math.round((count / max) * 100);
  const colorMap = {
    red: "var(--red-mm)",
    yellow: "var(--yellow-mm)",
    blue: "var(--blue-mm)",
    green: "var(--green-mm)"
  };
  const activationTextMap = {
    "Rojo": "Activación Simpática Desagradable",
    "Amarillo": "Activación Simpática Agradable",
    "Verde": "Activación Parasimpática Agradable",
    "Azul": "Activación Parasimpática Desagradable"
  };
  const color = colorMap[colorClass] || "var(--accent)";
  const activationLabel = activationTextMap[name] || "";

  return `
    <div style="margin-bottom:6px;">
      <span style="font-size:0.85rem;">${name} = ${activationLabel} (${count})</span>
      <div style="background:#0b1018;border-radius:999px;height:8px;margin-top:2px;">
        <div style="width:${percent}%;height:8px;border-radius:999px;background:${color};"></div>
      </div>
    </div>
  `;
}

/* -----------------------
   GRÁFICA CARTESIANA
----------------------- */

function drawEvolutionChart(rawList) {
  const canvas = document.getElementById("evolutionChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth || 600;
  const height = canvas.clientHeight || 220;

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  if (!rawList.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.fillText("Sin datos suficientes para mostrar la evolución.", 16, height / 2);
    return;
  }

  const list = rawList
    .slice()
    .sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

  const yMap = { "Azul": 1, "Verde": 2, "Amarillo": 3, "Rojo": 4 };

  const points = list.map((e, idx) => ({
    x: idx,
    y: yMap[e.quadrant] || 0,
    label: formatShortDate(e.createdAt)
  }));

  const marginLeft = 50;
  const marginRight = 16;
  const marginTop = 16;
  const marginBottom = 30;

  const usableWidth = width - marginLeft - marginRight;
  const usableHeight = height - marginTop - marginBottom;

  const maxIndex = Math.max(points.length - 1, 1);
  const stepX = usableWidth / maxIndex;

  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.lineWidth = 1;

  const yLevels = [
    { label: "ASD", value: 4, color: mmColors.red },
    { label: "ASA", value: 3, color: mmColors.yellow },
    { label: "APA", value: 2, color: mmColors.green },
    { label: "APS", value: 1, color: mmColors.blue }
  ];

  ctx.font = "11px system-ui";
  ctx.textBaseline = "middle";

  yLevels.forEach(level => {
    const t = (level.value - 1) / 3;
    const y = height - marginBottom - t * usableHeight;

    ctx.beginPath();
    ctx.moveTo(marginLeft, y);
    ctx.lineTo(width - marginRight, y);
    ctx.stroke();

    ctx.fillStyle = level.color;
    ctx.fillText(level.label, 10, y);
  });

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#88a9c3";
  ctx.fillStyle = "#88a9c3";

  ctx.beginPath();
  points.forEach((p, idx) => {
    const t = (p.y - 1) / 3;
    const x = marginLeft + stepX * idx;
    const y = height - marginBottom - t * usableHeight;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  points.forEach((p, idx) => {
    const t = (p.y - 1) / 3;
    const x = marginLeft + stepX * idx;
    const y = height - marginBottom - t * usableHeight;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#cbd5f5";
  ctx.textBaseline = "top";
  ctx.font = "10px system-ui";

  const maxLabels = 8;
  const stepLabel = Math.ceil(points.length / maxLabels) || 1;

  points.forEach((p, idx) => {
    if (idx % stepLabel !== 0 && idx !== points.length - 1) return;
    const x = marginLeft + stepX * idx;
    const label = p.label;
    ctx.fillText(label, x - 12, height - marginBottom + 4);
  });
}

/* -----------------------
   NAVEGACIÓN
----------------------- */

function goToSection(section) {
  // actualizar botones
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.section === section);
  });

  // actualizar secciones
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("visible"));
  const target = document.getElementById(section);
  if (target) target.classList.add("visible");

  // si vamos al dashboard, recargar datos
  if (section === "history") {
    loadHistoryAndStats();
  }
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    goToSection(section);
  });
});

/* START */
renderStep();
