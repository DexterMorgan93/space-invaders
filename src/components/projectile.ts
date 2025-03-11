import { Container, Graphics } from "pixi.js";
import { Game } from "../main";

export class Projectile extends Container {
  game: Game;
  widthProjectile: number;
  heightProjectile: number;
  speed: number;
  free: boolean;
  private view: Graphics | null = null;

  constructor(game: Game) {
    super();
    this.game = game;
    this.widthProjectile = 8;
    this.heightProjectile = 40;
    this.speed = 20;
    this.free = true; // sitting in the pool & ready to use
  }

  draw() {
    if (!this.free && !this.view) {
      this.view = new Graphics();
      this.view.rect(0, 0, this.widthProjectile, this.heightProjectile).fill({
        color: "white",
        alpha: 1,
      });

      this.addChild(this.view);
    }
  }

  update() {
    this.draw();
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.heightProjectile) {
        this.reset();
      }
    }
  }

  start(x: number, y: number) {
    // object is using & not available right now
    this.x = x - this.widthProjectile * 0.5;
    this.y = y;
    this.free = false;
  }

  reset() {
    this.free = true;

    // Удаляем графику из контейнера
    if (this.view) {
      this.removeChild(this.view);
      this.view = null;
    }

    this.game.removeChild(this);
  }
}
