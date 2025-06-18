import { Sprite, Spritesheet } from "pixi.js";
import { DefaultScene } from "../features/scene-manager";
import type { Game } from "./game";

export class Player extends DefaultScene {
  private game: Game;
  private viewWidth = 140;
  private viewHeight = 120;
  private moveSpeed = 5;
  private direction: number | null = null;
  private shooting: number | null = null;
  private playerTextures!: Spritesheet;
  private playerJetsTextures!: Spritesheet;
  public sprite: Sprite;
  public spriteJets: Sprite;

  public velocity = {
    vx: 0,
    vy: 0,
  };

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

    if (this.velocity.vy > 0) {
      this.sprite.texture = this.playerTextures.textures["1.png"];
    } else {
      this.sprite.texture = this.playerTextures.textures["0.png"];
    }
  }

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

  applyShoot(pressed: boolean) {
    this.shooting = pressed ? -1 : null;
  }

  shoot() {
    if (typeof this.shooting === "number" && this.shooting < 0) {
      this.game.getFreeProjectile()?.start(this.x + this.width * 0.5, this.y);
    }
  }

  handleUpdate(): void {
    if (typeof this.shooting === "number" && this.shooting < 0) {
      this.velocity.vy = 1;
    } else {
      this.velocity.vy = 0;
    }

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

  subtractLives(damage: number) {
    this.lives -= damage;
  }
  addLives(damage: number) {
    this.lives += damage;
  }
}
