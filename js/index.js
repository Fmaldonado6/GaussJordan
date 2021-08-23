let matrixWidth = 3;
let matrixHeight = 3;
const matrix = [
  [0, 3, 0, 6],
  [2, 4, 1, 4],
  [1, 1, 0, 7],
];



function validateMatrix(matrixParam){
  
  //for para hacerle n pasadas a la matriz (indispensable)
  for (let k = 0; k<matrixHeight; k++){
    for(let i = 0; i < matrixWidth; i++){
      //verifica si el pivote es distinto de cero
      if(matrixParam[i][i]!=0)
        continue;
      for(let j = 0; j < matrixHeight; j++){
        
        //si la fila tiene algo distinto a cero en la posicion que estamos buscando
        //intercambia las filas
        if(matrixParam[j][i]!=0 ){
          let temp = matrixParam[i];
          matrixParam[i] = matrixParam[j];
          matrixParam[j] = temp;
          break;
        }
        
      }
      
    }
  }
  for(let i = 0;i<matrixHeight; i++){
    if(matrixParam[i][i]==0){
      console.log("Matriz inconsistente");
      return null;
    }
  }
    return matrixParam;
  }


function solveMatrix(matrixParam) {
  if (!matrixParam)
    return null;
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

console.log(validateMatrix(matrix));
//si comentas la linea de abajo, la de arriba imprime el arreglo ordenado
//si la dejas asi lo imprime resuelto no se pq
console.log(solveMatrix(validateMatrix(matrix)));
