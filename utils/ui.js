const buttonsContainer = document.querySelector('.area-pulsanti');

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


/**
 * Mostra una griglia di pulsanti e restituisce una Promise
 * che si risolve con il `value` del pulsante cliccato.
 *
 * @param {Array<{label: string, value: any, disabled?: boolean} | null>} buttons
 *        Ogni elemento è un pulsante, oppure `null` per uno slot vuoto (visibile ma non cliccabile).
 */
export function waitForButtons(buttons) {
    return new Promise((resolve) => {
        buttonsContainer.innerHTML = '';

        buttons.forEach((btn) => {
            const el = document.createElement('button');
            el.className = 'pulsante';

            if (btn === null) {
                // slot riservato: presente nel layout, ma vuoto e disabilitato
                el.disabled = true;
                el.classList.add('vuoto');
            } else {
                el.textContent = btn.label;
                if (btn.disabled) {
                    el.disabled = true;
                } else {
                    el.addEventListener('click', () => {
                        // disabilito tutti subito: evita doppi click durante il resolve
                        buttonsContainer
                            .querySelectorAll('button')
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
            (c) => c.team === team && c.position === position
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
    buttonsContainer.innerHTML = '';
}