import { Container, Graphics } from "pixi.js";
import { Game } from "../main";

export class Player extends Container {
  game: Game;
  widthPlayer: number;
  heightPlayer: number;
  speed: number;

  constructor(game: Game) {
    super();
    this.game = game;
    this.widthPlayer = 100;
    this.heightPlayer = 100;
    const xPosPlayer = this.game.widthGame * 0.5 - this.widthPlayer * 0.5;
    const yPosPlayer = this.game.heightGame - this.heightPlayer;
    this.position.set(xPosPlayer, yPosPlayer);
    this.speed = 20;

    const view = new Graphics();
    view.rect(0, 0, this.widthPlayer, this.heightPlayer).fill({
      color: "black",
      alpha: 1,
    });
    this.addChild(view);
  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y);
    }
  }
}
