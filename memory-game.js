/** Memory game: find matching pairs of cards and flip both of them. */

/*
  ========================================
  GAME SETUP - DON'T TOUCH
  ========================================
*/

"use strict";
let GAME_ACTIVE = true;

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow",
  "red", "blue", "green", "orange", "purple", "yellow",
];

const colors = shuffle(COLORS);
createCards(colors);

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
} // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.




/*
  ========================================
  THE ASSIGNMENT:
  WRITE THE (4) FOLLOWING FUNCTIONS
  TO MAKE THE GAME WORK
  ========================================
*/

/** Create card for every color in colors (each color appears twice).
 *
 * Each div DOM element will have:
 * - A class with the value of the color.
 * - A click event listener for each card to handleCardClick.
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game-board");
  for (let color of colors) {
    // NO. 1 - CREATECARDS... you need to write this ...
    // Create a container for each card, assign it a color, and load it face down.
    let card = document.createElement('div');
    card.className = color;
    card.classList.add('card');
    card.classList.add('face-down');
    // Add a click event listener to each card and append it to the game board.
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
    gameBoard.appendChild(card);
  }
}

/** Keep track of the scores. */
let LOWEST_SCORE = 0;
let CURRENT_SCORE = 0;
document.querySelector('.current').innerText = CURRENT_SCORE;

/** Flip a card face-up. */
function flipCard(card) {
  // N0. 2  - FLIPCARD... you need to write this ...
  card.classList.toggle('face-down');
  CURRENT_SCORE++;
  document.querySelector('.current').innerText = CURRENT_SCORE;
}

/** Flip a card face-down. */
function unFlipCard(card) {
  // N0. 3 - UNFLIPCARD... you need to write this ...
  card.classList.toggle('face-down');
}

/** Handle clicking on a card - this could be card1 or card2. */
let CARD1 = null;
let CARD2 = null;
function handleCardClick(card) {
  // N0. 4 HANDLECARDCLICK... you need to write this ...
  if (GAME_ACTIVE) {
    if (CARD1 === null) {
      flipCard(card);
      CARD1 = card;
    } else if (CARD2 === null && card !== CARD1) {
      flipCard(card);
      CARD2 = card;
      // After one second, check for a match.
      setTimeout(() => checkMatch(), FOUND_MATCH_WAIT_MSECS);
    }
  }
}

/** Check for a match. */
function checkMatch() {
  let cards = document.querySelectorAll('.card');
  if (cardColor(CARD1) === cardColor(CARD2)) {
    CARD1.classList.add('matched');
    CARD2.classList.add('matched');
    // Check for a win.
    if (allMatched(cards)) {
      gameOver();
    }
    // Reset card1 and card2 if a match is found.
    CARD1 = null;
    CARD2 = null;
  } else {
    // Unflip card1 and card2 if mismatching and reset their values to null.
    unFlipCard(CARD1);
    unFlipCard(CARD2);
    CARD1 = null;
    CARD2 = null;
  }
}

/** Determine card color. */
function cardColor(card) {
  let colors = ["red", "blue", "green", "orange", "purple", "yellow"];
  for (let color of colors) {
    if (card.classList.contains(color)) {
      return color;
    }
  }
}

/** Check if all cards are matched. */
function allMatched(cards) {
  for (let card of cards) {
    if (!card.classList.contains('matched')) {
      return false;
    }
  }
  return true;
}

/** Reset the game. */
let RESET_BUTTON = document.querySelector('button');
RESET_BUTTON.addEventListener("click", () => {
  let cards = document.querySelectorAll('.card');
  // Clear the game board if all cards are matched, shuffle the cards, and reset the game.
  if (allMatched(cards)) {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = '';
    shuffle(COLORS);
    createCards(colors);
    CURRENT_SCORE = 0;
    document.querySelector('.current').innerText = CURRENT_SCORE;
  }

  GAME_ACTIVE = true;
  RESET_BUTTON.style.display = 'none';
});

/** Handle win condition */
function gameOver() {
  // Set scores.
  let score = CURRENT_SCORE;
  if (CURRENT_SCORE < LOWEST_SCORE || LOWEST_SCORE === 0) {
    LOWEST_SCORE = score;
    document.querySelector('.lowest').innerText = LOWEST_SCORE;
  }
  // Display reset button and deactive the game board.
  RESET_BUTTON.style.display = 'block';
  GAME_ACTIVE = false;
}