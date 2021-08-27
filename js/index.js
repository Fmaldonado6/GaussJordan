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
  const values = [];

  for (let k = 0; k < matrixHeight; k++) {
    let val; //booleano que indica si uno de los terminos es linealmente independiente del mismo
    //en la fila con la que se le compara
    for (let i = 0; i < matrixWidth; i++) {
      //for que controla a la fila estatica en cada comparacion
      val = true; //se inicia en true para despues pasar a false si hay alguno que sea independiente
      //con uno que sea independiente es suficiente para que sean validas las ecuaciones
      for (let j = 0; j < matrixWidth; j++) {
        //for que controla la iteracion de la fila con la que se compara la fila de i
        if (i == j) continue;
        for (let k = 0; k < matrixWidth + 1; k++) {
          //for que controla la iteracion de las columnas (terminos) que se comparan
          if (i == j) continue;
          if (matrixParam[i][k] % matrixParam[j][k] != 0) {
            //si uno de los terminos es independiente, se salta a la siguiente fila para comparar
            if (k == matrixWidth) {
              // este for de k va hasta el vector de soluciones, si todas los demas terminos fueron independientes, pero el ultimo no, entonces es inconsistente
              console.log("El sistema es inconsistente");
              return null;
            }
            //si no es el ultimo termino simplemente se salta a la siguiente fila para comparar
            val = false;
            break;
          }
        }
        if (val) {
          //si el val es true, no hubo ningun termino independiente en la comparacion por lo que es de soluciones infinitas

          console.log(
            "Dos o mas filas son linealmente dependientes por lo que el sistema tiene soluciones infinitas"
          );
          return null;
        }
      }
    }
  }

  //for para hacerle k pasadas a la matriz (indispensable) dificil de explicar en texto xd
  for (let k = 0; k < matrixSize; k++) {
    for (let i = 0; i < matrixSize; i++) {
      //verifica si el pivote es distinto de cero
      if (matrixParam[i][i] != 0) continue;
      for (let j = 0; j < matrixSize; j++) {
        //si la fila tiene algo distinto a cero en la posicion que estamos buscando
        //intercambia las filas
        if (matrixParam[j][i] != 0) {
          let temp = matrixParam[i];
          matrixParam[i] = matrixParam[j];
          matrixParam[j] = temp;
          break;
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
