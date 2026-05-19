const SIZES = {
  '2x3': { cols: 3, pairs: 3, cardSize: 150 },
  '4x3': { cols: 4, pairs: 6, cardSize: 120 },
  '5x4': { cols: 5, pairs: 10, cardSize: 100 },
};

let state = {
  activeSize: '4x3',
  flipped: [],
  locked: false,
  moves: 0,
  pairs: 0,
  totalPairs: 6,
};

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return { id: data.id, name: data.name, image: data.sprites.front_default };
}

async function generateCards(numPairs) {
  const ids = new Set();
  while (ids.size < numPairs) ids.add(Math.floor(Math.random() * 1000) + 1);
  const pokemon = await Promise.all([...ids].map(fetchPokemon));
  return [...pokemon, ...pokemon].sort(() => Math.random() - 0.5);
}

function buildGrid(cards, cols, cardSize) {
  const grid = document.getElementById("game_grid");
  grid.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`;
  grid.innerHTML = "";

  cards.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.pokeid = pokemon.id;
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
    card.innerHTML = `
      <img id="img${index}" class="front_face" src="${pokemon.image}" alt="${pokemon.name}">
      <img class="back_face" src="back.webp" alt="">
    `;
    card.addEventListener("click", () => onCardClick(card));
    grid.appendChild(card);
  });
}

function onCardClick(card) {
  if (state.locked) return;
  if (card.classList.contains("flip")) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flip");
  state.flipped.push(card);

  if (state.flipped.length === 2) {
    state.locked = true;
    state.moves++;

    const [a, b] = state.flipped;
    if (a.dataset.pokeid === b.dataset.pokeid) {
      a.classList.add("matched");
      b.classList.add("matched");
      state.pairs++;
      state.flipped = [];
      state.locked = false;
      if (state.pairs === state.totalPairs) {
        setTimeout(() => {
          document.getElementById("win-msg").textContent = `You won in ${state.moves} moves!`;
        }, 300);
      }
    } else {
      setTimeout(() => {
        a.classList.remove("flip");
        b.classList.remove("flip");
        state.flipped = [];
        state.locked = false;
      }, 1000);
    }
  }
}

async function init(sizeKey = state.activeSize) {
  document.getElementById("win-msg").textContent = "";
  const { cols, pairs, cardSize } = SIZES[sizeKey];
  state = { activeSize: sizeKey, flipped: [], locked: false, moves: 0, pairs: 0, totalPairs: pairs };

  const cards = await generateCards(pairs);
  buildGrid(cards, cols, cardSize);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => init(btn.dataset.size));
  });

  init();
});