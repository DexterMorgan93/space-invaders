import { Application, Container, Graphics } from "pixi.js";

export class Game extends Container {
  app: Application;
  player: Player;

  constructor(app: Application) {
    super();
    this.app = app;
    const width = app.screen.width;
    const height = app.screen.height;

    this.player = new Player(this);
    const playerPosX = width * 0.5 - this.player.playerWidth * 0.5;
    const playerPosY = height - this.player.playerHeight;
    this.player.position.set(playerPosX, playerPosY);
    this.addChild(this.player);
  }

  render() {
    this.player.draw();
  }
}

export class Player extends Graphics {
  game: Game;
  playerWidth = 0;
  playerHeight = 0;

  constructor(game: Game) {
    super();
    this.game = game;
    this.playerWidth = 100;
    this.playerHeight = 100;
  }

  draw() {
    this.rect(0, 0, this.playerWidth, this.playerHeight).fill({
      color: "black",
      alpha: 1,
    });
  }
}
