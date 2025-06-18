import { Sprite, Spritesheet } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";

export type PlayerState = "idle" | "moveLeft" | "moveRight";
export class Player extends DefaultScene {
  private game: Game;
  private viewWidth = 140;
  private viewHeight = 120;
  private moveSpeed = 5;
  private direction: number | null = null;
  private isMoving = false;
  private playerTextures!: Spritesheet;
  private playerJetsTextures!: Spritesheet;
  public sprite: Sprite;
  public spriteJets: Sprite;

  public velocity = {
    vx: 0,
    vy: 0,
  };

  public state!: PlayerState;
  public lives = 3;

  constructor(
    game: Game,
    playerTextures: Spritesheet,
    playerJetsTextures: Spritesheet
  ) {
    super();

    this.game = game;
    this.playerTextures = playerTextures;
    this.playerJetsTextures = playerJetsTextures;

    this.sprite = new Sprite(this.playerTextures.textures["0.png"]);
    this.sprite.setSize(this.viewWidth, this.viewHeight);
    this.addChild(this.sprite);

    this.spriteJets = new Sprite(this.playerJetsTextures.textures["1.png"]);
    this.spriteJets.setSize(this.viewWidth, this.viewHeight);
    this.addChild(this.spriteJets);
  }

  updateState(): void {
    if (this.velocity.vx > 0) {
      this.spriteJets.texture = this.playerJetsTextures.textures["2.png"];
    } else if (this.velocity.vx < 0) {
      this.spriteJets.texture = this.playerJetsTextures.textures["0.png"];
    } else {
      this.spriteJets.texture = this.playerJetsTextures.textures["1.png"];
    }
  }
  // switchState(state: PlayerState): void {
  //   switch (state) {
  //     case "idle":
  //       this.direction = 0;
  //       break;
  //     case "moveLeft":
  //       this.direction = -1;
  //       break;
  //     case "moveRight":
  //       this.direction = 1;
  //       break;
  //   }
  //   this.state = state;
  // }

  // handleMove(pressed: boolean, left: boolean) {
  //   if (pressed) {
  //     this.direction = left ? -1 : 1;
  //     this.isMoving = true;
  //   } else {
  //     if ((left && this.direction === -1) || (!left && this.direction === 1)) {
  //       this.direction = 0;
  //       this.isMoving = false;
  //     }
  //   }
  // }

  applyLeftDirection(pressed: boolean) {
    this.direction = pressed
      ? -1
      : this.direction === -1
      ? null
      : this.direction;
  }

  applyRightDirection(pressed: boolean) {
    this.direction = pressed ? 1 : this.direction === 1 ? null : this.direction;
  }

  handleUpdate(): void {
    if (typeof this.direction === "number") {
      if (this.direction < 0) {
        this.velocity.vx = -this.moveSpeed;
      } else if (this.direction > 0) {
        this.velocity.vx = this.moveSpeed;
      }
    } else {
      this.velocity.vx = 0;
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
