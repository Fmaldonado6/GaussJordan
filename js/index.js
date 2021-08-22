let matrixWidth = 3;
let matrixHeight = 3;
const matrix = [
  [1, 1, 2,6],
  [0, 2, 1,4],
  [2, 1, 1,7],
];


function solveMatrix() {
  for (let i = 0; i < matrixWidth; i++) {

    for (let j = 0; j < matrixHeight; j++) {
      if (i == j) continue;

      let temp = matrix[j][i] / matrix[i][i];

      for (let k = 0; k <= matrixWidth; k++) {
        matrix[j][k] -= matrix[i][k] * temp;
      }
    }
  }
}

console.log(matrix);
solveMatrix();
console.log(matrix);
