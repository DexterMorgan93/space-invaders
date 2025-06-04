import { Graphics } from "pixi.js";
import { DefaultScene, SceneManager } from "./scene-manager";
import type { Game } from "./game";

export class Player extends DefaultScene {
  private game: Game;
  private view: Graphics;
  private viewWidth = 100;
  private viewHeight = 100;
  private moveSpeed = 5;
  private direction: -1 | 0 | 1 = 0;
  private isMoving = false;

  constructor(game: Game) {
    super();

    this.game = game;

    this.view = new Graphics();
    this.draw();
  }

  draw() {
    this.view
      .rect(0, 0, this.viewWidth, this.viewHeight)
      .fill({ color: "black" });
    this.addChild(this.view);
  }

  handleMove(pressed: boolean, left: boolean) {
    if (pressed) {
      this.direction = left ? -1 : 1;
      this.isMoving = true;
    } else {
      if ((left && this.direction === -1) || (!left && this.direction === 1)) {
        this.direction = 0;
        this.isMoving = false;
      }
    }
  }

  handleUpdate(): void {
    if (this.isMoving) {
      // TODO останавливать при выходе игрока наполовину
      if (this.x < -this.width * 0.5) {
        this.x = -this.width * 0.5;
      } else if (this.x > SceneManager.app.canvas.width - this.width * 0.5) {
        this.x = SceneManager.app.canvas.width - this.width * 0.5;
      }

      this.x += this.direction * this.moveSpeed;
    }
  }

  shoot() {
    const projectile = this.game.getFreeProjectile();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y);
    }
  }
}
