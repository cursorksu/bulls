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
}

class Controller {
  constructor() {
    this.btnStart = document.querySelector('.js__btn-start');
    this.btnAgain = document.querySelector('.js__btn-again');
    this.btnReset = document.querySelector('.js__btn-reset');
    this.attemptCounter = 0;
    this.viewModel = new View();
  }
  getNumbersFromUser() {
    return prompt('Input four numbers from 0 to 9');
  }

  numbersGenerator() {
    function generatedOneNumber() {
      return Math.floor(Math.random() * (0 - 9 + 1)) + 9;
    }

    const randomNumbers = [];

    for (let i = 0; randomNumbers.length < 4; i++) {
      const num = generatedOneNumber();

      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }

    return randomNumbers.join('');
  }

  startGame() {
    delete this.error;
    this.btnStart.setAttribute('disabled', 'disable');
    this.btnAgain.removeAttribute('disabled');
    this.btnReset.removeAttribute('disabled');
    this.attemptCounter += 1;

    this.randomNumbers = this.numbersGenerator().toString();
    this.usersNumbers = this.getNumbersFromUser().toString();
    this.responseObject = main(this.randomNumbers, this.usersNumbers);

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

    this.responseObject = main(this.randomNumbers, this.usersNumbers);

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

function main(generatedNumber, enteredNumber) {
  const response = {
    'bulls': 0,
    'cows': 0,
  };

  if (!enteredNumber || enteredNumber.length !== 4) {
    control.error = 'You entered the wrong value. Try again!';

    return undefined;
  }

  generatedNumber.split('').forEach((num, idx) => {
    if (enteredNumber.indexOf(enteredNumber[idx], idx + 1) > 0) {
      control.error = 'Enter non-duplicate numbers!';
    }

    if (num === enteredNumber[idx]) {
      response.bulls += 1;
    } else if (generatedNumber.includes(enteredNumber[idx])) {
      response.cows += 1;
    }
  });

  return response;
}

control.btnStart.addEventListener('click', control.startGame.bind(control));
control.btnAgain.addEventListener('click', control.tryAgain.bind(control));
control.btnReset.addEventListener('click', control.resetGame.bind(control));
