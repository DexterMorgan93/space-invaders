import { Application, Container, Graphics } from "pixi.js";

export class Player extends Graphics {
  game: Game;
  playerWidth = 0;
  playerHeight = 0;
  speed: number;

  constructor(game: Game) {
    super();
    this.game = game;
    this.playerWidth = 100;
    this.playerHeight = 100;
    this.speed = 20;
  }

  draw() {
    this.rect(0, 0, this.playerWidth, this.playerHeight).fill({
      color: "black",
      alpha: 1,
    });
  }
}

export class Game extends Container {
  app: Application;
  player: Player;
  keys: string[];

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

    this.keys = [];
    addEventListener("keydown", ({ key }) => {
      if (this.keys.indexOf(key) === -1) this.keys.push(key);
    });
    addEventListener("keyup", ({ key }) => {
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  render() {
    this.player.draw();

    // horizontal movement
    if (this.keys.indexOf("a") > -1)
      this.player.position.x -= this.player.speed;
    if (this.keys.indexOf("d") > -1)
      this.player.position.x += this.player.speed;

    // horizontal boundaries
    if (this.player.position.x < 0) {
      this.player.position.x = 0;
    } else if (
      this.player.position.x >
      this.app.screen.width - this.player.playerWidth
    ) {
      this.player.position.x = this.app.screen.width - this.player.playerWidth;
    }
  }
}
