let matrixWidth = 3;
let matrixHeight = 3;
const matrix = [
  [1, 1, 2, 6],
  [0, 2, 1, 4],
  [2, 1, 1, 7],
];

function solveMatrix(matrixParam) {

  for (let i = 0; i < matrixWidth; i++) {
    for (let j = 0; j < matrixHeight; j++) {
      if (i == j) continue;

      let temp = matrixParam[j][i] / matrixParam[i][i];

      for (let k = 0; k <= matrixWidth; k++) {
        matrixParam[j][k] -= matrixParam[i][k] * temp;
      }
    }
  }
  return matrixParam;
}

console.log(JSON.parse(JSON.stringify(matrix)));

console.log(solveMatrix(matrix));
