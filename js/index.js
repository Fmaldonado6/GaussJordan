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
  //for para controlar la fila de referencia para comparar y determinar
  //independencia lineal con las demas
  for (let i = 0; i < matrixSize; i++) {
    const firstArray = matrixParam[i];
    let previousDiv1;
    let previousDiv2;
    //for para determinar la segunda fila a comparar
    for (let j = 0; j < matrixSize; j++) {
      if (i == j) continue;

      const secondArray = matrixParam[j];

      if (!previousDiv1 && !previousDiv2) {
        previousDiv1 =
          secondArray[0] != 0 ? firstArray[0] / secondArray[0] : null;

        previousDiv2 =
          firstArray[0] != 0 ? secondArray[0] / firstArray[0] : null;
      }
      //contador para saber si todos los terminos son linealmente dependientes
      let times = 0;
      //for para iterar cada elemento de las filas y compararlos
      for (let k = 0; k <= matrixSize; k++) {
        //si uno de los elementos es cero y el otro no, se salta al siguente

        const firstNumber = firstArray[k];
        const secondNumber = secondArray[k];

        if (
          firstNumber / secondNumber == previousDiv1 ||
          secondNumber / firstNumber == previousDiv2
        )
          times++;
      }
      console.log(times);
      //si el contador times queda con el valor del tamaño de la matriz mas uno
      //significa que son dependientes dos o mas ecuaciones y se sale de los ciclos
      if (times == matrixSize + 1) return null;
    }
  }

  //hash map que registrará los estados de la matriz para evitar ciclos redundantes
  let map = {};
  //for para hacerle k pasadas a la matriz (indispensable) como un ordenamiento burbuja
  for (let k = 0; k < matrixSize; k++) {
    //for para controlar los pivotes con i
    for (let i = 0; i < matrixSize; i++) {
      //verifica si el pivote es distinto de cero
      if (matrixParam[i][i] != 0) continue;
      //for para iterar las filas e intercambiar si es conveniente
      for (let j = 0; j < matrixSize; j++) {
        //se crea una copia del arreglo para operar en ella y verificar si ya pasamos por ahi
        const newMatrix = JSON.parse(JSON.stringify(matrixParam));
        //si la fila tiene algo distinto a cero en la posicion que estamos buscando
        //intercambia las filas
        if (newMatrix[j][i] != 0) {
          let temp = newMatrix[i];
          newMatrix[i] = newMatrix[j];
          newMatrix[j] = temp;
        }
        //si nuestro hash map ya contiene a ese orden guardado se salta a otra fila
        if (map[newMatrix]) continue;
        //si no estaba en el hash map se queda como se modificó
        matrixParam = newMatrix;
        //se añade este estado al hash map
        map[matrixParam] = matrixParam;
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
      //Dividimos el elemento de la diagnoal entre el valor que quermos hacer 0
      let temp = matrixParam[j][i] / matrixParam[i][i];

      //Validamos que el valor no sea indefnidio
      if (Number.isNaN(temp) || !Number.isFinite(temp)) return null;

      for (let k = 0; k <= matrixSize; k++) {
        //Operamos la fila con el valor calculado
        matrixParam[j][k] -= matrixParam[i][k] * temp;
      }
    }
  }
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
