import { Container, Graphics } from "pixi.js";
import { Game } from "../main";

export class Enemy extends Container {
  game: Game;
  widthEnemy: number;
  heightEnemy: number;
  positionX: number;
  positionY: number;
  markedForDeletion: boolean;

  constructor(game: Game, positionX: number, positionY: number) {
    super();
    this.game = game;
    this.widthEnemy = this.game.enemySize;
    this.heightEnemy = this.game.enemySize;
    this.positionX = positionX;
    this.positionY = positionY;
    this.markedForDeletion = false;

    const view = new Graphics();
    view.rect(0, 0, this.widthEnemy, this.heightEnemy).stroke({ color: "red" });

    this.addChild(view);
  }

  update(waveX: number, waveY: number) {
    this.x = waveX + this.positionX;
    this.y = waveY + this.positionY;
    this.game.projectilesPool.forEach((projectile) => {
      if (!projectile.free && this.game.checkCollisionAB(this, projectile)) {
        this.markedForDeletion = true;
        projectile.reset();
      }
    });
  }
}
