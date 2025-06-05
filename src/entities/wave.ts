import { Container, Graphics } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";
import { Enemy } from "./enemy";
import type { Projectile } from "./projectile";
import { Collision } from "../shared/lib/collision";
import { getObjectBounds } from "../shared/lib/bounds";

export class Wave extends DefaultScene {
  private game: Game;
  private speedX = 3;
  private speedY = 0;
  private enemies: Container;

  public waveWidth: number;
  public waveHeight: number;

  constructor(game: Game) {
    super();

    this.game = game;
    this.waveWidth = game.enemyColumns * game.enemySize;
    this.waveHeight = game.enemyRows * game.enemySize;

    this.enemies = new Container();
    this.addChild(this.enemies);

    this.draw();
    this.create();

    this.position.y = -this.waveHeight;
  }

  draw() {
    const view = new Graphics();
    view.rect(0, 0, this.waveWidth, this.waveHeight);
    view.stroke({ color: "red" });

    this.addChild(view);
  }

  handleUpdate() {
    // типа плавное опускание сверху экрана
    if (this.y < 0) {
      this.y += 5;
    }

    this.speedY = 0;
    // горизонтальные боунды
    if (this.x < 0 || this.x > SceneManager.app.canvas.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    // коллизия между врагом и пулей
    this.enemies.children.forEach((enemy) => {
      const enemyBounds = getObjectBounds(enemy as Enemy);

      this.game.projectilesPool.children.forEach((item) => {
        const projectile = item as Projectile;
        const projectileBounds = getObjectBounds(projectile);

        if (
          !projectile.free &&
          Collision.checkCollisionMBxB(enemyBounds, projectileBounds)
        ) {
          (enemy as Enemy).markedForDeletion = true;
          projectile.reset();
        }
      });
    });

    this.enemies.children = this.enemies.children.filter((item) => {
      const enemy = item as Enemy;
      return !enemy.markedForDeletion;
    });
  }

  // создаем двумерный массив врагов
  create() {
    for (let y = 0; y < this.game.enemyRows; y++) {
      for (let x = 0; x < this.game.enemyColumns; x++) {
        const enemyX = x * this.game.enemySize;
        const enemyY = y * this.game.enemySize;

        const enemy = new Enemy(this.game);
        enemy.position.set(enemyX, enemyY);
        this.enemies.addChild(enemy);
      }
    }
  }
}
