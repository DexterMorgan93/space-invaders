import { Graphics } from "pixi.js";
import { DefaultScene } from "../features/scene-manager";

export class Projectile extends DefaultScene {
  private view!: Graphics;
  private projectileWidth = 3;
  private projectileHeight = 40;
  private projectileSpeed = 20;
  public free = true;

  constructor() {
    super();
  }

  draw() {
    if (!this.free) {
      const tempView = new Graphics();
      tempView
        .rect(0, 0, this.projectileWidth, this.projectileHeight)
        .fill({ color: "gold" });
      tempView.position.y = -15;
      this.view = tempView;
      this.addChild(this.view);
    }
  }

  handleUpdate() {
    1;
    if (!this.free) {
      this.y -= this.projectileSpeed;
    }
  }

  start(x: number, y: number) {
    this.position.set(x - this.projectileWidth * 0.5, y);
    this.free = false;
    this.visible = true;
  }

  reset() {
    this.free = true;
    this.visible = false;
  }
}
