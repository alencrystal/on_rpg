const buttonsContainer = document.querySelector(".area-pulsanti");

// ===== Mappa tipo → emoji =====
// Aggiungi qui gli altri tipi quando li conosci
const TYPE_EMOJI = {
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electro: "⚡",
  ice: "❄️",
  ground: "🪨",
  wind: "💨",
  steel: "⚙️",
  spirit: "🌀",
};

function getTypeEmoji(type) {
  return TYPE_EMOJI[type] || "❓";
}

function getSpriteUrl(sprite) {
  const clean = (sprite || "unknown").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `sprite/${clean}.gif`;
}

// Converte i bersagli tecnici salvati nei dati in descrizioni leggibili.
// La tabella copre sia i bersagli delle mosse sia quelli dei loro effetti.
function describeTarget(target, isEffectTarget = false) {
  const targets = {
    self: "attacker",
    enemy: "the target",
    enemies: "enemies",
    everyone: "other characters",
    ally: "selected ally",
    allies: "all allies",
    team: "user's team",
  };

  // Se una mossa non specifica il bersaglio, il combattimento usa quello
  // scelto dal giocatore nella schermata successiva.
  return (
    targets[target] || (isEffectTarget ? "bersaglio non specificato" : "user")
  );
}

// Spiega l'effetto con testo adatto alla card, mantenendo un caso leggibile
// anche per effetti nuovi o non ancora gestiti dal gioco.
function describeEffect(effect) {
  if (!effect) {
    return "no effect";
  }

  let description;
  if (effect.type === "stat_change") {
    const action = effect.operation === "sub" ? "loose" : "gain";
    description = `${describeTarget(effect.target, true)} ${action} ${effect.value}% ${effect.stat}`;
  } else if (effect.type === "heal") {
    description = `heal by ${effect.value}% on ${describeTarget(effect.target, true)}`;
  } else if (effect.type === "move_target") {
    description =
      "modify the target of the moves (effetto non ancora implementato)";
  } else {
    description = `Effect: ${effect.type}`;
  }

  // Nei dati la probabilità è espressa come frazione (per esempio 0.5 = 50%);
  // il valore 1 indica quindi un effetto garantito.
  if (typeof effect.chance === "number" && effect.chance < 1) {
    description += ` (${Math.round(effect.chance * 100)}% di probabilità)`;
  }

  return description;
}

// Crea il testo del retro. La potenza è un valore base, non il danno finale:
// il danno effettivo dipende anche da statistiche, livello e tipo del bersaglio.
function getMoveDetails(move) {
  const details = [
    ["Power", move.power ?? "Non specificata"],
    ["Type", move.type || "Non specificato"],
    ["Category", move.category || "Non specificata"],
    ["Target", describeTarget(move.target)],
    ["Effect", describeEffect(move.effect)],
  ];

  return details;
}

let tooltipId = 0;

// Aggiunge una finestra informativa ai soli pulsanti che hanno i dettagli di una
// mossa. Il nome rimane sempre visibile e il tooltip viene mostrato dal CSS solo
// quando il pulsante è in hover o ha il focus da tastiera.
function renderButtonLabel(button, element) {
  if (!button.details) {
    // Gli altri pulsanti (bersagli, switch e slot vuoti) mantengono il testo normale.
    element.textContent = button.label;
    return;
  }

  // Mantiene il nome come contenuto principale del pulsante, anche quando il
  // tooltip non è visibile.
  const label = document.createElement("span");
  label.className = "pulsante-label";
  label.textContent = button.label;
  element.appendChild(label);

  // Il tooltip è un elemento separato sovrapposto alla griglia, non una faccia
  // del pulsante: così il testo principale non scompare durante l'hover.
  const tooltip = document.createElement("span");
  tooltip.className = "pulsante-tooltip";
  tooltip.id = `move-tooltip-${tooltipId++}`;
  tooltip.setAttribute("role", "tooltip");
  element.setAttribute("aria-describedby", tooltip.id);

  // Ogni informazione viene aggiunta come testo, non come HTML, così nomi e
  // descrizioni delle mosse non vengono interpretati dal browser come markup.
  getMoveDetails(button.details).forEach(([label, value]) => {
    const row = document.createElement("span");
    row.className = "pulsante-dettaglio-riga";

    const title = document.createElement("strong");
    title.className = "pulsante-dettaglio-label";
    title.textContent = `${label}: `;

    const text = document.createElement("span");
    text.textContent = String(value);

    row.append(title, text);
    tooltip.appendChild(row);
  });

  element.appendChild(tooltip);
  element.classList.add("pulsante-con-tooltip");
}

/**
 * Mostra una griglia di pulsanti e restituisce una Promise
 * che si risolve con il `value` del pulsante cliccato.
 *
 * @param {Array<{label: string, value: any, disabled?: boolean, details?: object} | null>} buttons
 *        Ogni elemento è un pulsante, oppure `null` per uno slot vuoto (visibile ma non cliccabile).
 *        Se è presente `details`, il pulsante mostra le informazioni della mossa in hover.
 */
export function waitForButtons(buttons) {
  return new Promise((resolve) => {
    buttonsContainer.innerHTML = "";

    buttons.forEach((btn) => {
      const el = document.createElement("button");
      el.className = "pulsante";

      if (btn === null) {
        // slot riservato: presente nel layout, ma vuoto e disabilitato
        el.disabled = true;
        el.classList.add("vuoto");
      } else {
        // Il renderer distingue i pulsanti normali dalle mosse con dettagli.
        renderButtonLabel(btn, el);
        if (btn.disabled) {
          el.disabled = true;
        } else {
          el.addEventListener("click", () => {
            // disabilito tutti subito: evita doppi click durante il resolve
            buttonsContainer
              .querySelectorAll("button")
              .forEach((b) => (b.disabled = true));
            resolve(btn.value);
          });
        }
      }

      buttonsContainer.appendChild(el);
    });
  });
}

export function updateCards(char_ist, activeId = -1) {
  const quadrati = document.querySelectorAll(".quadrato");

  quadrati.forEach((el, index) => {
    // Primi 3 = team 0 (riga sopra), ultimi 3 = team 1 (riga sotto)
    const team = index < 3 ? 0 : 1;
    const position = index % 3;

    // Trova il personaggio che occupa questo slot
    const character = char_ist.find(
      (c) => c.team === team && c.position === position,
    );

    if (!character) {
      // Slot vuoto (nessun personaggio in quella posizione)
      el.innerHTML = "";
      el.classList.remove("active", "ko");
      return;
    }

    renderCard(el, character, character.id_instance === activeId);
  });
}

function renderCard(el, c, isActive) {
  const hp = c.stats_instance.hp;
  const maxHp = c.stats_instance.max_hp;
  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const hpClass = hpPct > 50 ? "" : hpPct > 25 ? "mid" : "low";

  const expNeeded = c.level * c.level * 75;
  const expPct = Math.min(100, (c.exp / expNeeded) * 100);

  const typeEmoji = c.type.map(getTypeEmoji).join(" ");
  const spriteUrl = getSpriteUrl(c.sprite);

  el.innerHTML = `
        <div class="card-sprite">
            <span class="sprite-fallback">${c.sprite}</span>
            <img src="${spriteUrl}" alt="${c.name}" onerror="this.style.display='none'">
        </div>
        <div class="card-info">
            <div class="card-header">
                <span>${c.name}</span>
                <span>Lv.${c.level}</span>
            </div>
            <div class="card-sub">
                <span>${c.archetype}</span>
                <span>${typeEmoji}</span>
            </div>
            <div class="bar bar-hp ${hpClass}">
                <div class="bar-fill" style="width: ${hpPct}%"></div>
            </div>
            <div class="bar-label">HP ${Math.round(hp)}/${Math.round(maxHp)}</div>
            <div class="bar bar-exp">
                <div class="bar-fill" style="width: ${expPct}%"></div>
            </div>
            <div class="bar-label">EXP ${c.exp}/${expNeeded}</div>
        </div>
    `;

  el.classList.toggle("active", isActive);
  el.classList.toggle("ko", !c.alive);
}

/** Svuota l'area dei pulsanti. */
export function clearButtons() {
  buttonsContainer.innerHTML = "";
}
