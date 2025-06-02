import { Graphics, Ticker } from "pixi.js";
import { DefaultScene } from "./scene-manager";

export class Player extends DefaultScene {
  private view: Graphics;
  private viewWidth = 100;
  private viewHeight = 100;
  private moveSpeed = 5;
  private direction: -1 | 0 | 1 = 0;
  private isMoving = false;

  constructor() {
    super();

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
      this.x += this.direction * this.moveSpeed;
    }
  }
}
