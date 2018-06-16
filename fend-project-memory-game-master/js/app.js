/*
 * Create a list that holds all of your cards
 */

const card_deck = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-anchor",
    "fa-leaf",
    "fa-bicycle",
    "fa-diamond",
    "fa-bomb",
    "fa-leaf",
    "fa-bomb",
    "fa-bolt",
    "fa-bicycle",
    "fa-paper-plane-o",
    "fa-cube"];

// Set global variables for the DOM

const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const playAgain = document.querySelector(".playAgain");
const restart = document.querySelector(".restart");
const stars = document.querySelector(".stars");

const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modalText");

let timer = document.querySelector(".timer");

// variables for the timer

let interval;
let second = 0;
let minute = 0;
let timeStart = false;

// variables to keep track of the game

let cards_open = [];
let matches = 0;
let numberOfMoves = moves.textContent;
let numberOfStars = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function startNewGame() {
	resetTimer();
	timeStart = false;
	timer.textContent = minute + " minutes " + second + " seconds";
	shuffle(card_deck); // use given shuffle function on card_deck
	cards_open = [];
	matches = 0;
	moves.textContent = 0;
	numberOfMoves = moves.textContent;

	// Get rid of classes and, thus, slip all cards to backside, set icons according to shuffled card deck

	for (let i = 0; i < card_deck.length; i++) {
		let deck_element = deck.getElementsByTagName("li");
		let class_element = deck_element[i].getAttribute("class");
		deck_element[i].className = "";
		deck_element[i].classList.add("card");

		let icon_element = deck.getElementsByTagName("i");
		let icon_class = icon_element[i].getAttribute("class");
		icon_element[i].className = "";
		icon_element[i].classList.add("fa", card_deck[i]);
	}

	// Return three stars to score-panel

	stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
	numberOfStars = 3;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// functions to play Memory

function flipCard(card) {
	card.classList.add("open", "show");
}

function youHaveAMatch() {
	cards_open[0].classList.remove("open", "show");
	cards_open[0].classList.add("match");
	cards_open[1].classList.remove("open", "show");
	cards_open[1].classList.add("match");
	cards_open = [];
	matches++;
}

function noMatch() {
	setTimeout(function() {
		cards_open[0].classList.remove("open", "show");
		cards_open[1].classList.remove("open", "show");
		cards_open = [];
	}, 700)
}

function addMove(card) {
	if (!card.classList.contains("match")) {
		numberOfMoves++;
		moves.innerText = numberOfMoves;
	}
}

function gameOver() {
	if (matches === 8) {
		modal.style.display = "block";
		modalText.textContent = "Congratulations! You earned " + numberOfStars + " stars in " + timer;
		startNewGame();
		//resetTimer();
	}
}

// Set timer at 00:00

function resetTimer() {
	clearInterval(interval);
	second = 0;
	minute = 0;
}

// Start timer

function startTimer() {
	interval = setInterval(function() {
		timer.textContent = minute + " minutes " + second + " seconds ";
		second++;
		if (second === 60) {
			minute++;
			second = 0;
		}
	}, 1000)
}

// event listener for restart button

restart.addEventListener("click", startNewGame);

playAgain.addEventListener("click", function() {
	modal.style.display = "none";
	timer.style.display = "none";
	startNewGame();
})

// event listener for starting the game

deck.addEventListener("click", function(event) {

	let card = event.target;

	// start timer

	if (!timeStart) {
		startTimer();
		timeStart = true;
		timer.style.display = "inline-block";
	}

	// Go on only for closed cards

	if (!card.classList.contains("open")) {

		if (cards_open.length < 2) {
				flipCard(card);
				cards_open.push(card);
		}

		if (cards_open.length === 2) {
			// keep track of number of moves
			addMove(card);

			if (cards_open[0].innerHTML === cards_open[1].innerHTML) {
				youHaveAMatch();
			} else {
				noMatch();
			}

			// set stars according to number of moves

			//if (moves.innerText === 15) {
			if (numberOfMoves === 15) {
				stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
				numberOfStars--;
			//} else if (moves.innerText === 21) {
			} else if (numberOfMoves === 21) {
				stars.innerHTML = '<li><i class="fa fa-star"></i></li>';
				numberOfStars--;
			}
		}
		gameOver();
	}
})

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

startNewGame();
