import { Container } from "pixi.js";
import { Game } from "../main";
import { Beetlemorpgh } from "./beetlemorph";
import { Enemy } from "./enemy";

export class Wave extends Container {
  game: Game;
  widthWave: number;
  heightWave: number;
  speedX: number;
  speedY: number;
  enemies: Beetlemorpgh[];

  constructor(game: Game) {
    super();

    this.game = game;
    this.widthWave = this.game.enemyColumns * this.game.enemySize;
    this.heightWave = this.game.enemyRows * this.game.enemySize;
    this.speedX = 3;
    this.speedY = 0;
    this.enemies = [];

    this.create();
    this.y = -this.heightWave;
  }

  render() {
    if (this.y < 0) {
      this.y += 5;
    }
    // сбрасываем при каждом фрейме до нуля, чтобы он опускался медленно
    this.speedY = 0;
    if (this.x < 0 || this.x > this.game.widthGame - this.widthWave) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }
    this.x += this.speedX;
    this.y += this.speedY;

    this.enemies.forEach((enemy) => {
      enemy.update(this.x, this.y);
      this.game.addChild(enemy);
    });

    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.markedForDeletion) {
        this.game.removeChild(enemy); // Удаляем врага со сцены
        return false; // Исключаем из массива
      }
      return true; // Оставляем в массиве
    });
  }

  create() {
    for (let y = 0; y < this.game.enemyRows; y++) {
      for (let x = 0; x < this.game.enemyColumns; x++) {
        const frameY = Math.floor(Math.random() * this.game.enemyRows);
        // const frameX = Math.floor(Math.random() * game.enemyColumns);
        const frameX = 0;
        let enemyX = x * this.game.enemySize;
        let enemyY = y * this.game.enemySize;
        this.enemies.push(
          new Beetlemorpgh(this.game, enemyX, enemyY, frameY, frameX)
        );
      }
    }
  }
}
