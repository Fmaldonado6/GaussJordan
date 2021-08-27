const matrixSizeInput = document.getElementById("size");
const resultCard = document.getElementById("result-card");
const results = document.getElementById("results");
const matrixContainer = document.querySelector(".matrix-container");
const snackbar = document.querySelector("#snackbar");

let matrixSize = 3;

function generateMatrix() {
  matrixSize = Number.parseFloat(matrixSizeInput.value);

  if (matrixSize < 2)
    return showSnackbar("El tamaño de la matriz no puede ser menor a 2");

  if (matrixSize > 10)
    return showSnackbar("El tamaño de la matriz no puede ser mayor a 10");

  matrixContainer.innerHTML = "";

  for (let i = 0; i < matrixSize; i++) {
    const div = document.createElement("div");
    div.classList.add("row-container");

    for (let j = 0; j < matrixSize + 1; j++) {
      const inputContainer = document.createElement("div");
      inputContainer.classList.add("input-container");
      const input = document.createElement("input");
      input.type = "number";
      inputContainer.appendChild(input);
      div.appendChild(inputContainer);
    }
    matrixContainer.appendChild(div);
  }
}

function validateMatrix(matrixParam) {

  for (let i = 0; i < matrixSize; i++) {
    const firstArray = matrixParam[i];

    for (let j = 0; j < matrixSize; j++) {
      if (i == j) continue;
      const secondArray = matrixParam[j];
      let times = 0;
      for (let k = 0; k <= matrixSize; k++) {
        if (
          firstArray[k] % secondArray[k] == 0 ||
          secondArray[k] % firstArray[k] == 0
        )
          times++;
      }

      if (times == matrixSize + 1) return null;
    }
  }

//for para hacerle k pasadas a la matriz (indispensable) dificil de explicar en texto xd
 
  for (let k = 0; k < matrixSize; k++) {
    let map = {};
 
    for (let i = 0; i < matrixSize; i++) {
      //verifica si el pivote es distinto de cero
      if (matrixParam[i][i] != 0) continue;
      for (let j = 0; j < matrixSize; j++) {
        //si la fila tiene algo distinto a cero en la posicion que estamos buscando
        //intercambia las filas
        if (matrixParam[j][i] != 0 && map[matrixParam]==null) {
          let temp = matrixParam[i];
          matrixParam[i] = matrixParam[j];
          matrixParam[j] = temp;
          map[matrixParam] = matrixParam;
          break;
        }else{

          continue;
        }
      }
    }
  }

  return matrixParam;
}

function solveMatrix(matrixParam) {
  if (!matrixParam) return null;

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      if (i == j) continue;

      let temp = matrixParam[j][i] / matrixParam[i][i];

      if (Number.isNaN(temp) || !Number.isFinite(temp)) return null;

      for (let k = 0; k <= matrixSize; k++) {
        matrixParam[j][k] -= matrixParam[i][k] * temp;
      }
    }
  }
  console.log(matrixParam);
  return matrixParam;
}

async function calculate() {
  let matrix = [];

  for (let col of matrixContainer.children) {
    const row = [];
    for (let element of col.children) {
      const input = element.firstChild;
      const value = Number.parseFloat(input.value);
      if (Number.isNaN(value))
        return showSnackbar("No puede haber valores en blanco");
      row.push(value);
    }
    matrix.push(row);
  }

  console.log(resultCard.classList.contains("show"));

  matrix = validateMatrix(matrix);

  if (resultCard.classList.contains("show")) {
    hideResultCard();
    await delay(300);
  }

  if (!matrix)
    return showSnackbar("La matriz tiene elementos linealmente dependientes");

  matrix = solveMatrix(matrix);

  if (!matrix) return showSnackbar("La matriz es inconsistente");

  showResults(matrix);
}

function showResults(matrix) {
  showResultCard();
  results.innerHTML = "";

  for (let i = 0; i < matrixSize; i++) {
    const value = matrix[i][matrixSize] / matrix[i][i];

    const element = document.createElement("p");
    element.innerHTML = `x<sub>${i + 1}</sub> = ${
      value % 1 == 0 ? value : value.toFixed(4)
    }`;

    results.appendChild(element);
  }
}

function showResultCard() {
  if (resultCard.classList.contains("hidden"))
    resultCard.classList.remove("hidden");
  resultCard.classList.add("show");
}

function hideResultCard() {
  if (resultCard.classList.contains("show"))
    resultCard.classList.remove("show");
  resultCard.classList.add("hidden");
}

function showSnackbar(message) {
  snackbar.classList.add("show");
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 2750);
}

function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

generateMatrix();
