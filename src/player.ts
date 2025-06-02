import { Graphics, Ticker } from "pixi.js";
import { DefaultScene } from "./scene-manager";

export class Player extends DefaultScene {
  private view: Graphics;
  private viewWidth = 100;
  private viewHeight = 100;
  private moveSpeed = 5;

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

  handleUpdate(): void {
    this.position.x += this.moveSpeed;
  }
}
