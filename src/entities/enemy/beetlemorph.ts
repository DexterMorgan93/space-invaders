import type { Game } from "../game";
import { Enemy } from "./enemy";

export class Beetlemorph extends Enemy {
  public game: Game;

  constructor(game: Game) {
    super(game);

    this.game = game;
  }
}
