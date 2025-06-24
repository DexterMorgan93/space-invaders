import { Spritesheet, Texture, TextureSource } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";

export class Wave extends DefaultScene {
  private game: Game;
  private speedX = 3;
  private speedY = 0;

  public waveWidth: number;
  public waveHeight: number;
  public nextWaveTrigger = false;
  public beetleMorphAnimations!: Record<
    string | number,
    Texture<TextureSource<any>>[]
  >;

  constructor(game: Game, beetleMorph: Spritesheet) {
    super();

    this.game = game;
    const { animations } = beetleMorph;
    this.beetleMorphAnimations = animations;
    this.waveWidth = game.enemyColumns * game.enemySize;
    this.waveHeight = game.enemyRows * game.enemySize;

    this.position.y = -this.waveHeight;
  }

  update() {
    // типа плавное опускание сверху экрана
    if (this.y < 0) {
      this.y += 5;
    }

    this.speedY = 0;
    // горизонтальные боунды
    if (this.x < 0 || this.x > SceneManager.app.canvas.width - this.waveWidth) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }
}
