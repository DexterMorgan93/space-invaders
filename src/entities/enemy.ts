import { Graphics } from "pixi.js";
import { DefaultScene } from "../features/scene-manager";
import type { Game } from "./game";

export class Enemy extends DefaultScene {
  private game: Game;

  public enemyWidth: number;
  public enemyHeight: number;

  constructor(game: Game) {
    super();

    this.game = game;
    this.enemyWidth = game.enemySize;
    this.enemyHeight = game.enemySize;

    this.draw();
  }

  draw() {
    const view = new Graphics();
    view.rect(0, 0, this.enemyWidth, this.enemyHeight);
    view.stroke({ color: "white" });
    this.addChild(view);
  }
}
