const Game = require('./Game');
const User = require('./User');

let cardsPosition = {
  0: {value: 0},
  1: {value: 0},
  2: {value: 0},
  3: {value: 0},
  4: {value: 0},
};

for (let i_p = 0; i_p < 10000; i_p++) {

  let cardCount = 0;
  let admin = new User(i_p, 'user name', 'user name');
  admin.setFakeSocket();
  let g = new Game(i_p, 'game name', admin.uuid);
  g.addPlayer(admin);
  let numberOfPlayer = 7;
  for (let i_u = 0; i_u < numberOfPlayer; i_u++) {
    let u = new User(i_p * 10 + i_u, 'user name', 'user name');
    u.setFakeSocket();
    g.addPlayer(u);
  }

  g.startGame();

  g.players.forEach(player => {
    player.cards.forEach((card, index) => {
      cardCount++;
      if (card.type === 'DEFUSING_CABLE') {
        cardsPosition[index].value++;
      }
    });
  });

  for (i in cardsPosition) {
    cardsPosition[i].ratio = Math.floor(cardsPosition[i].value / cardCount);
  }

}

console.log(cardsPosition);



