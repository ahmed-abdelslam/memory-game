/*
 * Create a list that holds all cards
 */

const UL = document.createElement("ul");
// select the element that has a class 'container'
const CONTAINER = document.querySelector('.container');
CONTAINER.appendChild(UL);
// add class deck to the list
UL.classList.add('deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 const CARDS_LIST = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf",
               "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
                "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

/*
 * @description Shuffle the list of cards and create 16 'li' and 'i' elements, append it to the list
 */
function createCards() {

    let shuffledCards = shuffle(CARDS_LIST);

    for (let i = 0; i < 16; i++) {
       let li = document.createElement("li");
       li.classList.add('card');
       UL.appendChild(li);
       let iElement = document.createElement("i");
       li.appendChild(iElement);
       // Second class will determine the card's symbol
       iElement.classList.add("fa", shuffledCards[i]);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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

// an empty array to save the class of matched cards
let matchedCards = [];
// an empty array to temporarly save open cards
let tmpOpenCards = [];
let getParentOfcard1;
let getParentOfcard2;
let indexOfMatched = 0;
let indexOfTmp = 0;
let counter = 0;
let startTheGame = false;
let endOfTime = false;
let min = 3;
let sec = 0;

/*
 * @description Display the clicked card by adding 'open' and 'show' calsses, and ensure the click was on a 'li' elemnt
 * @param {event object} evt
 */
function displayTheCard(evt) {
     if (evt.target.nodeName === 'LI') {
         let card = evt.target;
         card.classList.add('open', 'show');
         startTheGame = true;
         openTheCard(card);
    }
}

/*
 * @description Get the class of 'i' element:
                  - if the temporarly array already has another card, check to see if the two cards match
                      + if the cards do match, lock the cards in the open position by calling match function
                        & increment the move counter and display it on the page by calling incrementMoveCounter function
                      + if the cards do not match, remove the cards from the array and hide the card's symbol by
                        calling noMatch function & increment the move counter and display it on the page
                        by calling incrementMoveCounter function
                  - if the temporarly array is empty, store the card in the array and wait the another card
  * @param {HTML element} card
  */
function openTheCard(card) {
     // get class list of 'i' element, child of ('li' element)
     let getClass = card.firstElementChild.classList;

     if (tmpOpenCards.length !== 0) {
         // store the second class in the temporarly array, ex for second class : fa-bomb
         tmpOpenCards[indexOfTmp] = getClass[1];
         getParentOfcard2 = card.firstElementChild.parentElement;
         // check to see if the two cards match or not
         if (tmpOpenCards[indexOfTmp] === tmpOpenCards[--indexOfTmp]) {
             // increment & display the current number of moves
             incrementMoveCounter();
             match(getParentOfcard1, getParentOfcard2);
             // store the class list of 'i' element as an identifier for the matched cards in matchedCards array
             matchedCards[indexOfMatched] = getClass;
             // increment the index of matchedCards array
             indexOfMatched++;
             // free up the temporarly array
             tmpOpenCards = [];
       }
       else {
             // increment & display the current number of moves
             incrementMoveCounter();
             noMatch(getParentOfcard1, getParentOfcard2);
             // free up the temporarly array
             tmpOpenCards = [];
       }
       // reset the index of temporarly array to zero
       indexOfTmp = 0;
     } else { // else the temporarly array is empty, store the card direct in the array as a first card
         getParentOfcard1 = card.firstElementChild.parentElement;
         // store the second class in the temporarly array
         tmpOpenCards[indexOfTmp] = getClass[1];
         // increment the index of the temporarly array
         indexOfTmp++;
     }
}


const MOVES = document.querySelector('.moves');
/*
 * @description Increment the current number of moves
 */
function incrementMoveCounter() {
     counter++;
     MOVES.innerText = counter;
     // if counter is equal to one of these values, decrease the stars
     if (counter === 6 || counter === 12 || counter === 18 || counter === 24) {
       decrementStars();
     }
}


const STARS = document.querySelector('.stars');
/*
 * @description Decrement the number of stars
 */
function decrementStars() {
     STARS.lastElementChild.remove();
}

/*
 * @description Add class 'match' to the matched cards to lock them in the open position, also check if the user has finished
 *              matchings between cards.
 * @param {HTML element} card1 - the parent element -> 'li' of first card
 * @param {HTML element} card2 - the parent element -> 'li' of second card
 */
function match(card1, card2) {
     if (matchedCards.length === 7) {
         win();
     }
     card1.classList.remove("open", "show");
     card2.classList.remove("open", "show");
     card1.classList.add("match");
     card2.classList.add("match");
}


const DELAY_IN_MILLISECONDS = 1500;
/*
 * @description Add class 'no-match' to the mismatched cards to highlight them in 'red background' and
 *                         wait 1.5 seconds then hide the card's symbol
 * @param {HTML element} card1 - the parent element -> 'li' of first card
 * @param {HTML element} card2 - the parent element -> 'li' of second card
 */
function noMatch(card1, card2) {
     card1.classList.remove("open");
     card2.classList.remove("open");
     card1.classList.add("no-match");
     card2.classList.add("no-match");
     // wait 1.5 seconds then hide the card's symbol
     setTimeout(function() {
         card1.classList.remove("show");
         card2.classList.remove("show");
         card1.classList.remove("no-match");
         card2.classList.remove("no-match");
     }, DELAY_IN_MILLISECONDS)
}

/*
 * @description Reload the page
 */
function restartTheGame() {
     // Reload the current page without the browser cache
     location.reload(true);
}

/*
 * @description Display the congratulation seciton that contains score, star rating,
 *              button to play again and how much time it took to win the game
 */
function win() {
      const WIN_SECTION = document.createElement('section');
      WIN_SECTION.classList.add('congratulation');
      const CHECK = document.createElement('span');
      CHECK.classList.add('fa', 'fa-check', 'check');
      const H4 = document.createElement('h4');
      H4.innerText = 'Congratulations! You Won!';
      const P1 = document.createElement('p');
      P1.innerText = 'with '+ counter + ' Moves and ' + STARS.childElementCount + ' Stars.';
      const P2 = document.createElement('p');
      P2.innerText = 'Wooooooo!';
      const BTN_PLAY_AGAIN = document.createElement('button');
      BTN_PLAY_AGAIN.classList.add('btn-play-again');
      BTN_PLAY_AGAIN.innerText = 'Play again!';

      WIN_SECTION.innerHTML = CHECK.outerHTML + H4.outerHTML + P1.outerHTML + P2.outerHTML + BTN_PLAY_AGAIN.outerHTML;
      document.body.appendChild(WIN_SECTION);
      const PLAY_AGAIN = document.querySelector('.btn-play-again');
      PLAY_AGAIN.addEventListener('click', restartTheGame);
      CONTAINER.remove();
}


const CARDS = document.querySelector('.deck');
const RESTART = document.querySelector('.restart');
/*
 * @description add eventListener to the list and restart button
 */
function eventListener() {
     CARDS.addEventListener('click', displayTheCard);
     RESTART.addEventListener('click', restartTheGame);
}


const TIMER_ELEMENT = document.querySelector('.timer');
/*
 * @description Display and update the timer
 */
function timer() {
    /* if startTheGame === true that means the user has clicked on one of the cards
     * if the user didn't click on any card, startTheGame will still have the initial value 'false'
     * and timer won't run.
     */
     if (startTheGame === true && endOfTime === false) {
         if (sec === 0) {
             // reset the seconds
             sec = 60;
             // decrease the minutes
             min--;
         }
         // decrease the seconds
         sec--;
         // when min === 0 and sec === 0 set endOfTime to true to get out from parent 'if statement' in the second loop
         if (min === 0 && sec === 0) {
            endOfTime = true;
         }
         // update the innerHTML
         if (sec >= 10) {
             TIMER_ELEMENT.innerHTML = '<i class="fa fa-clock-o"></i>';
             TIMER_ELEMENT.innerHTML += " 0" + min + ":" + sec;
         } else {
             TIMER_ELEMENT.innerHTML = '<i class="fa fa-clock-o"></i>';
             TIMER_ELEMENT.innerHTML += " 0" + min + ":" + "0" + sec;
         }
     } else if (endOfTime) { // when the timer is over, display a warning
          const SCORE_PANEL = document.querySelector('.score-panel');
          const WARNING = document.createElement("div");
          WARNING.classList.add('end-of-time');
          WARNING.innerHTML = '<p><i class="fa fa-exclamation-triangle"></i> Time is over! click on the restart icon  <i class="fa fa-repeat"></i></p>';
          SCORE_PANEL.appendChild(WARNING);
          // prevent the user from clicking on the cards by remove the event listener
          CARDS.removeEventListener('click', displayTheCard);
          // to get out from setInterval function
          clearInterval(timerFunction);
     }
}

// now call these three functions to start everything!

// create the cards
createCards();

// add event listener to the cards and restart symbol
eventListener();

// start the timer when the user has clicked on one of the cards
let timerFunction = setInterval(timer, 1000);
