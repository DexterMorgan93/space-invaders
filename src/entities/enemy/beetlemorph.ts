import { AnimatedSprite, Texture, TextureSource } from "pixi.js";
import { DefaultScene } from "../../features/scene-manager";
import type { Game } from "../game";

export class Beetlemorph extends DefaultScene {
  public game: Game;

  public enemyWidth: number;
  public enemyHeight: number;
  public markedForDeletion = false;
  public beetleMorphAnimations!: Record<
    string | number,
    Texture<TextureSource<any>>[]
  >;

  public animatedSprite!: AnimatedSprite;

  constructor(
    game: Game,
    randomKey: string,
    beetleMorphAnimations: Record<
      string | number,
      Texture<TextureSource<any>>[]
    >
  ) {
    super();

    this.beetleMorphAnimations = beetleMorphAnimations;
    this.game = game;
    this.enemyWidth = game.enemySize;
    this.enemyHeight = game.enemySize;

    this.animatedSprite = new AnimatedSprite(
      this.beetleMorphAnimations[randomKey]
    );

    this.addChild(this.animatedSprite);
  }
}
