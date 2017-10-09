<template>
  <div class='app'>
    <div class='board' :class="{over: gameOver}">
      <div class='futureBalls'>
        <div class='score'><p>{{score}}</p></div>
        <router-view name='FutureBalls' v-for='ball in nextBalls' :color='ball' />
        <div class='new'><p><button class='btnNewGame' @click={newGame()}>Новая игра</button></p></div>
      </div>
      <div class='field'>
        <router-view name='Ball'
                     v-for='(ball,index) in board'
                     :isFocused='numberChoosen'
                     :index='index'
                     :color='ball'
                     @chosen={chosen(index,ball)}>
        </router-view>
      </div>
    </div>
    <div v-show='gameOver' class="static-dialog">
      <p>Игра окончена</p>
      <p>Ваш счет</p>
      <div class='score'><p>{{score}}</p></div>
      <div class='new'><p><button class='btnNewGame' @click={newGame()}>Новая игра</button></p></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'game',
    data () {
      return {
        score: 0,
        board: new Array(81).fill('none'),
        nextBalls: new Array(3).fill('none'),
        freeBoardZone: new Array(81),
        numberChoosen: '',
        wayIsset: false,
        colorChoosen: 'none',
        wayMap: new Array(81).fill(0),
        gameOver: false
      }
    },
    methods: {
      getRandomPlace: function () {
        const rand = Math.floor(Math.random() * this.freeBoardZone.length)
        return this.freeBoardZone.splice(rand, 1)[0]
      },
      newGame: function () {
        this.gameOver = false
        this.board.fill('none')
        this.score = 0 // Количество очков равно нулю
        for (let i = 0; i < 81; ++i) { // Это свободные ячейки
          this.freeBoardZone[i] = i
        }
        for (var i = 0; i < 3; ++i) {
          this.board.splice(this.getRandomPlace(), 1, this.generateColor())
          this.nextBalls.splice(i, 1, this.generateColor())
        }
      },
      generateColor: function () {
        const colorVariant = ['red', 'green', 'yellow', 'blue', 'orange', 'violet', 'brown']
        const rand = Math.floor(Math.random() * colorVariant.length)
        return colorVariant[rand]
      },
      chosen: function (index, item) {
        // Нажатие в пустое место, когда ничего не выбрано
        if (this.board[index] === 'none' && this.numberChoosen === '') {
          return
        }
        // Нажатие на элемент, когда ничего не было выбрано
        if (this.board[index] !== 'none') {
          this.numberChoosen = index
          this.colorChoosen = item
        }
        // Необходимо перемещение
        if (this.board[index] === 'none' && this.numberChoosen !== '') {
          this.wayIsset = false
          this.wayMap.fill(0)
          this.mayTransport(this.numberChoosen, index)

          if (this.wayIsset) {
            this.board.splice(this.numberChoosen, 1, 'none')
            this.freeBoardZone.push(this.numberChoosen)
            this.board.splice(index, 1, this.colorChoosen)
            const tmpIdx = this.freeBoardZone.indexOf(index)
            this.freeBoardZone.splice(tmpIdx, 1)
            this.numberChoosen = ''
            if (!this.findCombo()) {
              this.nextStep()
              this.findCombo()
              if (this.freeBoardZone.length === 0) {
                this.gameOver = true
              }
            }
          }
        }
      },
      mayTransport: function (start, end) {
        if (start === end) {
          this.wayIsset = true
        }
        // Шаг вправо
        if ((Math.floor(start % 10 + start / 10) !== 8) && (this.board[start + 1] === 'none') && (this.wayMap[start + 1] === 0)) {
          this.wayMap[start + 1] = 1
          this.mayTransport(start + 1, end)
        }
        // Шаг вверх
        if ((start < 73) && (this.board[start + 9] === 'none') && (this.wayMap[start + 9] === 0)) {
          this.wayMap[start + 9] = 1
          this.mayTransport(start + 9, end)
        }
        // Шаг вниз
        if ((start > 9) && (this.board[start - 9] === 'none') && (this.wayMap[start - 9] === 0)) {
          this.wayMap[start - 9] = 1
          this.mayTransport(start - 9, end)
        }
        // Шаг влево
        if ((Math.floor(start % 10 + start / 10) !== 9) && (this.board[start - 1] === 'none') && (this.wayMap[start - 1] === 0)) {
          this.wayMap[start - 1] = 1
          this.mayTransport(start - 1, end)
        }
        return
      },
      nextStep: function () {
        this.nextBalls.forEach((item, i) => {
          this.board.splice(this.getRandomPlace(), 1, item)
          this.nextBalls.splice(i, 1, this.generateColor())
        })
      },
      findHorisontal: function () {
        for (var i = 0; i < 81; i += 9) {
          for (var j = i; j < i + 9; ++j) {
            if (this.board[j] !== 'none' && this.board[j] === this.board[j + 1] && this.board[j + 1] === this.board[j + 2] && this.board[j + 2] === this.board[j + 3] && this.board[j + 3] === this.board[j + 4]) {
              this.wayMap[j] = 2
              this.wayMap[j + 1] = 2
              this.wayMap[j + 2] = 2
              this.wayMap[j + 3] = 2
              this.wayMap[j + 4] = 2
            }
          }
        }
      },
      findVertical: function () {
        for (var i = 0; i < 9; ++i) {
          for (var j = i; j < 81; j += 9) {
            if (this.board[j] !== 'none' && this.board[j] === this.board[j + 9] && this.board[j + 9] === this.board[j + 18] && this.board[j + 18] === this.board[j + 27] && this.board[j + 27] === this.board[j + 36]) {
              this.wayMap[j] = 2
              this.wayMap[j + 9] = 2
              this.wayMap[j + 18] = 2
              this.wayMap[j + 27] = 2
              this.wayMap[j + 36] = 2
            }
          }
        }
      },
      findDiagLeft: function () {
        for (var i = 0; i < 5; ++i) {
          for (var j = i; ; j += 10) {
            if (this.board[j] !== 'none' && this.board[j] === this.board[j + 10] && this.board[j + 10] === this.board[j + 20] && this.board[j + 20] === this.board[j + 30] && this.board[j + 30] === this.board[j + 40]) {
              this.wayMap[j] = 2
              this.wayMap[j + 10] = 2
              this.wayMap[j + 20] = 2
              this.wayMap[j + 30] = 2
              this.wayMap[j + 40] = 2
            }
            var tmp = Math.floor((j + 40) % 10) + Math.floor((j + 40) / 10)
            if (tmp === 8) break
          }
        }
        for (var k = 9; k < 37; k += 9) {
          for (var p = k; p < 45; p += 10) {
            if (this.board[p] !== 'none' && this.board[p] === this.board[p + 10] && this.board[p + 10] === this.board[p + 20] && this.board[p + 20] === this.board[p + 30] && this.board[p + 30] === this.board[p + 40]) {
              this.wayMap[p] = 2
              this.wayMap[p + 10] = 2
              this.wayMap[p + 20] = 2
              this.wayMap[p + 30] = 2
              this.wayMap[p + 40] = 2
            }
          }
        }
      },
      findDiagRight: function () {
        for (var i = 4; i < 9; ++i) {
          for (var j = i; ; j += 8) {
            if (this.board[j] !== 'none' && this.board[j] === this.board[j + 8] && this.board[j + 8] === this.board[j + 16] && this.board[j + 16] === this.board[j + 24] && this.board[j + 24] === this.board[j + 32]) {
              this.wayMap[j] = 2
              this.wayMap[j + 8] = 2
              this.wayMap[j + 16] = 2
              this.wayMap[j + 24] = 2
              this.wayMap[j + 32] = 2
            }
            var tmp = Math.floor((j + 32) % 10) + Math.floor((j + 32) / 10)
            if (tmp === 9) break
          }
        }
        for (var k = 8; k < 45; k += 9) {
          for (var p = k; p < 45; p += 8) {
            if (this.board[p] !== 'none' && this.board[p] === this.board[p + 8] && this.board[p + 8] === this.board[p + 16] && this.board[p + 16] === this.board[p + 24] && this.board[p + 24] === this.board[p + 32]) {
              this.wayMap[p] = 2
              this.wayMap[p + 8] = 2
              this.wayMap[p + 16] = 2
              this.wayMap[p + 24] = 2
              this.wayMap[p + 32] = 2
            }
          }
        }
      },
      findCombo: function () {
        this.findHorisontal()
        this.findVertical()
        this.findDiagLeft()
        this.findDiagRight()
        return this.deleteCombo()
      },
      deleteCombo: function () {
        let flag = false
        this.wayMap.forEach((item, index) => {
          if (item === 2) {
            this.score += 2
            this.board.splice(index, 1, 'none')
            this.freeBoardZone.push(index)
            flag = true
          }
        })
        return flag
      }
    }
  }
</script>

<style>
  *{
    font-family: Ubuntu, SegoeUI, Arial;
  }
  .over{
    filter: blur(15px);
    transition: all .5s ease-in;
  }
  .field, .futureBalls{
    margin: 0 auto;
  }
  .field{
    width: 470px;
    margin-top: 30px;
  }
  .futureBalls{
    width: 470px;
    height: 55px;
  }
  .score, .new{
    float: left;
    width: 156px;
  }
  .score p, .new p{
    text-align: center;
  }
  .new p button{
    border-radius: 15px;
    cursor: pointer;
    padding: 10px;
    border: 2px solid green;
    color: green;
    background-color: #fff;
    margin-top: -0.683rem;
    outline: none;
  }
  .new p button:hover{
    background-color: green;
    color: white;
    border-color: white;
  }
  .static-dialog{
    background-color: #fff;
    border: 2px solid green;
    position: absolute;
    left: 50%;
    margin-left: -185px;
    padding: 0 100px;
    border-radius: 10%;
  }
  .static-dialog p{
    text-align: center;
    font-size: 24px;
    line-height: 1;
  }
  .static-dialog .score{
    font-size: 48px !important;
    float: none !important;
  }
</style>
