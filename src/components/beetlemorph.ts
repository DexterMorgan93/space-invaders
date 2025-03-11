import { Sprite } from "pixi.js";
import { Game } from "../main";
import { Enemy } from "./enemy";

export class Beetlemorpgh extends Enemy {
  constructor(
    game: Game,
    positionX: number,
    positionY: number,
    frameY: number,
    frameX: number
  ) {
    super(game, positionX, positionY);
    const beetlemorphSprite = new Sprite(
      game.assets.getTexture(`beetlemorph-${frameY}-${frameX}`)
    );

    const beetlemorph = new Sprite(beetlemorphSprite);
    this.addChild(beetlemorph);
  }
}
