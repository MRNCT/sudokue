Vue.component('puzzle', {
  props: ['squares','original'],
  template: '\
    <table>\
      <caption>Sudokue</caption>\
      <tr v-for="row in 9">\
          <cell v-for="col in 9" v-bind:value="squares[row - 1][col - 1]" v-bind:original="original[row - 1][col - 1]"></cell>\
      </tr>\
    </table>\
  '
})

Vue.component('cell', {
  props: ['value','original'],
  template: '<td><span v-if="value != 0" v-bind:class="[(original == value) ? classOrig : classNotOrig]">{{ value }}</span></td>',
  data: function() {
    return {
      classOrig: 'bold',
      classNotOrig: ''
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: "Let's do this",
    original: [
      [5,0,0,0,3,0,0,8,0],
      [2,0,0,0,0,0,5,0,6],
      [0,8,9,0,0,0,3,0,0],
      [0,0,3,0,1,0,0,9,0],
      [0,0,0,9,0,2,0,0,0],
      [0,9,0,0,4,0,7,0,0],
      [0,0,8,0,0,0,9,5,0],
      [6,0,1,0,0,0,0,0,4],
      [0,4,0,0,5,0,0,0,1],
    ],
    squares: [
      [5,0,0,0,3,0,0,8,0],
      [2,0,0,0,0,0,5,0,6],
      [0,8,9,0,0,0,3,0,0],
      [0,0,3,0,1,0,0,9,0],
      [0,0,0,9,0,2,0,0,0],
      [0,9,0,0,4,0,7,0,0],
      [0,0,8,0,0,0,9,5,0],
      [6,0,1,0,0,0,0,0,4],
      [0,4,0,0,5,0,0,0,1],
    ]
  },
  methods: {
    extractBlock: function(row, col) {
      var blkArray = [];
      var cRow = row - (row % 3);
      var cCol = col - (col % 3);

      blkArray = blkArray.concat(this.squares[cRow].slice(cCol,cCol + 3))
      blkArray = blkArray.concat(this.squares[cRow + 1].slice(cCol,cCol + 3))
      blkArray = blkArray.concat(this.squares[cRow + 2].slice(cCol,cCol + 3))
      return blkArray;
    },
    extractCol: function(col) {
      var colArray = [];
      for (var i = 0; i < 9; i++) {
        colArray.push(this.squares[i][col])
      }
      return colArray;
    },
    scanSquare: function(row, col) {
      var seen = new Set([1,2,3,4,5,6,7,8,9]);
      var rowArray = this.squares[row];
      var colArray = this.extractCol(col);
      var blkArray = this.extractBlock(row,col);
      for (i in rowArray) {
        seen.delete(rowArray[i]);
      }
      for (j in colArray) {
        seen.delete(colArray[j]);
      }
      for (k in blkArray) {
        seen.delete(blkArray[k]);
      }
      if (seen.size == 1) {
        //console.log('Found square: ' + row + ',' + col);
        var newRow = this.squares[row];
        newRow[col] = Array.from(seen)[0];
        this.squares.splice(row, 1, newRow);
      }
    },
    scanAll: function() {
      var stuck = false;
      var unsolved = this.countUnsolved();
      while (!stuck) {
        for (var i = 0; i < this.squares.length; i++) {
          for (var j = 0; j < this.squares[i].length; j++) {
            if (this.squares[i][j] == 0) {
              //console.log('Scan square: ' + i + ',' + j);
              this.scanSquare(i, j);
            }
          }
        }
        var newUnsolved = this.countUnsolved();
        if (unsolved == newUnsolved) {
          stuck = true;
        } else {
          unsolved = newUnsolved;
        }
      }
    },
    countUnsolved: function() {
      return this.squares
      var unsolved = 0;
      for (var i = 0; i < this.squares.length; i++) {
        for (var j = 0; j < this.squares[i].length; j++) {
          if (this.squares[i][j] == 0) {
            unsolved += 1;
          }
        }
      }
      return unsolved
    },
    solvePuzzle: function() {
      this.scanAll();
      if (this.countUnsolved() == 0) {
        this.message = "Solved!"
      } else {
        this.message = "Stuck!"
      }
    }
  }
});
