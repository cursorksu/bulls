/* eslint-disable */
'use strict';

/*git test*/
class View {
  constructor() {
    this.resultList = document.querySelector('.js__result');
  }

  createWrongString(obj, enter) {
    return `<li class="game__item flex__container">
        <span>You enter: ${enter}</span>
        <span>Bulls: ${obj.bulls}</span>
        <span>Cows: ${obj.cows}</span>
        </li>`;
  }

  createErrorMassage(error) {
    return `<li class="game__item flex__container game__error">
              <span>${error}</span></li>`;
  }

  createWinnMassage(random, attemptCounter) {
    return `<li class="game__item flex__container game__winn">
        <span>You won! Congratulations!
        <br> The winn number is  ${random} 
        <br> You made ${attemptCounter} attempts</span>
        </li>`;
  }

  createRow(obj, numbers, random, error, attemptCounter) {
    let markup;
    console.log(random, "RUNDOM");

    if (error) {
      markup = this.createErrorMassage(error);
    } else {
      obj.bulls === 4 && obj.cows === 0
        ? markup = this.createWinnMassage(random, attemptCounter)
        : markup = this.createWrongString(obj, numbers);
    }

    this.resultList.insertAdjacentHTML('beforeend', markup);
  }

  resetList() {
    this.resultList.innerHTML = '';
  }
};

class Controller {
  constructor() {
    this.btnStart = document.querySelector('.js__btn-start');
    this.btnAgain = document.querySelector('.js__btn-again');
    this.btnReset = document.querySelector('.js__btn-reset');
    this.attemptCounter = 0;
    this.viewModel = new View();
  }

  getNumbersFromUser() {
    const str = prompt('Input four numbers from 0 to 9');

    return str;
  }

  numbersGenerator() {
    function generatedOneNumber() {
      return Math.floor(Math.random() * (0 - 9 + 1)) + 9;
    }

    const rundomNumbers = [];

    for (let i = 0; rundomNumbers.length < 4; i++) {
      const num = generatedOneNumber();

      if (!rundomNumbers.includes(num)) {
        rundomNumbers.push(num);
      }
    }

    return rundomNumbers.join('');
  }

  startGame() {
    delete this.error;
    this.btnStart.setAttribute('disabled', 'disable');
    this.btnAgain.removeAttribute('disabled');
    this.btnReset.removeAttribute('disabled');
    this.attemptCounter += 1;

    this.randomNumbers = this.numbersGenerator().toString();
    this.usersNumbers = this.getNumbersFromUser().toString();
    this.responseObject = bullsAndCows(this.randomNumbers, this.usersNumbers);

    this.viewModel.createRow(this.responseObject,
      this.usersNumbers,
      this.randomNumbers,
      this.error,
      this.attemptCounter
    );
  }

  tryAgain() {
    delete this.error;
    this.usersNumbers = this.getNumbersFromUser().toString();
    this.attemptCounter += 1;

    this.responseObject = bullsAndCows(this.randomNumbers, this.usersNumbers);

    this.viewModel.createRow(this.responseObject,
      this.usersNumbers,
      this.randomNumbers,
      this.error,
      this.attemptCounter
    );

    if (this.responseObject.bulls === 4 && this.responseObject.cows === 0) {
      this.error = undefined;
      this.btnAgain.setAttribute('disabled', 'disabled');
    }
  }

  resetGame() {
    this.viewModel.resetList();

    delete this.error;
    delete this.randomNumbers;
    delete this.usersNumbers;
    delete this.responseObject;

    this.btnStart.removeAttribute('disabled');
    this.btnAgain.setAttribute('disabled', 'disabled');
    this.btnReset.setAttribute('disabled', 'disabled');
  }
}

const control = new Controller();

function bullsAndCows(generatedNumber, enteredNumber) {
  const response = {
    'bulls': 0,
    'cows': 0,
  };

  if (enteredNumber === undefined || enteredNumber.length !== 4) {
    control.error = `You entered the wrong value. Try again!`;

    return undefined;
  }

  for (let i = 0; i < 4; i++) {
    if (enteredNumber.indexOf(enteredNumber[i], i + 1) > 0) {
      control.error = `Enter non-duplicate numbers!`;

      return undefined;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (generatedNumber[i] === enteredNumber[i]) {
      response.bulls += 1;
    } else if (generatedNumber.includes(enteredNumber[i])) {
      response.cows += 1;
    }
  }

  return response;
}

control.btnStart.addEventListener('click', control.startGame.bind(control));
control.btnAgain.addEventListener('click', control.tryAgain.bind(control));
control.btnReset.addEventListener('click', control.resetGame.bind(control));
