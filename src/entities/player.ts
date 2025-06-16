import { Graphics, Sprite, Spritesheet } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";

export class Player extends DefaultScene {
  private game: Game;
  private viewWidth = 140;
  private viewHeight = 120;
  private moveSpeed = 5;
  private direction: -1 | 0 | 1 = 0;
  private isMoving = false;
  private textures!: Spritesheet;
  public sprite: Sprite;

  public lives = 3;

  constructor(game: Game, playerTextures: Spritesheet) {
    super();

    this.game = game;
    this.textures = playerTextures;
    this.sprite = new Sprite(playerTextures.textures["0.png"]);
    this.sprite.setSize(this.viewWidth, this.viewHeight);
    this.addChild(this.sprite);
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

  subtractLives(damage: number) {
    this.lives -= damage;
  }
  addLives(damage: number) {
    this.lives += damage;
  }
}
