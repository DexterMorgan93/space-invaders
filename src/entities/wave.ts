import { Graphics } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";

export class Wave extends DefaultScene {
  private game: Game;
  private speedX = 3;
  private speedY = 0;

  public waveWidth: number;
  public waveHeight: number;

  constructor(game: Game) {
    super();

    this.game = game;
    this.waveWidth = game.enemyColumns * game.enemySize;
    this.waveHeight = game.enemyRows * game.enemySize;

    this.draw();
  }

  draw() {
    const view = new Graphics();
    view.rect(0, 0, this.waveWidth, this.waveHeight).fill({ color: "black" });
    this.addChild(view);
  }

  handleUpdate() {
    this.speedY = 0;
    // горизонтальные боунды
    if (this.x < 0 || this.x > SceneManager.app.canvas.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }
}
