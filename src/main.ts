import { Application, Container, Graphics } from "pixi.js";

export class Player extends Graphics {
  game: Game;
  widthPlayer: number;
  heightPlayer: number;
  xPosPlayer: number;
  yPosPlayer: number;
  speed: number;

  constructor(game: Game) {
    super();
    this.game = game;
    this.widthPlayer = 100;
    this.heightPlayer = 100;
    this.xPosPlayer = this.game.widthGame * 0.5 - this.widthPlayer * 0.5;
    this.yPosPlayer = this.game.heightGame - this.heightPlayer;
    this.speed = 20;
  }

  draw() {
    this.rect(0, 0, this.widthPlayer, this.heightPlayer).fill({
      color: "black",
      alpha: 1,
    });
    this.position.set(this.xPosPlayer, this.yPosPlayer);
  }
}

export class Game extends Container {
  app: Application;
  widthGame: number;
  heightGame: number;
  player: Player;
  keys: string[];

  constructor(app: Application) {
    super();
    this.app = app;
    this.widthGame = app.screen.width;
    this.heightGame = app.screen.height;

    this.player = new Player(this);
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
      this.player.xPosPlayer -= this.player.speed;
    if (this.keys.indexOf("d") > -1)
      this.player.xPosPlayer += this.player.speed;

    // horizontal boundaries
    if (this.player.xPosPlayer < 0) {
      this.player.xPosPlayer = 0;
    } else if (
      this.player.xPosPlayer >
      this.widthGame - this.player.widthPlayer
    ) {
      this.player.xPosPlayer = this.widthGame - this.player.widthPlayer;
    }
  }
}
