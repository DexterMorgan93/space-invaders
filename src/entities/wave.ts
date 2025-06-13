import { Container, Spritesheet, Texture, TextureSource } from "pixi.js";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import type { Game } from "./game";
import type { Projectile } from "./projectile";
import { Collision } from "../shared/lib/collision";
import { getObjectBounds } from "../shared/lib/bounds";
import { Beetlemorph } from "./enemy/beetlemorph";

export class Wave extends DefaultScene {
  private game: Game;
  private speedX = 3;
  private speedY = 0;

  public enemies: Container;
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

    this.enemies = new Container();
    this.addChild(this.enemies);

    this.create();

    this.position.y = -this.waveHeight;
  }

  handleUpdate() {
    const { statusBar, endGame, gameOver, player } = this.game;

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

    this.enemies.children.forEach((enemyItem) => {
      const enemy = enemyItem as Beetlemorph;
      const enemyBounds = getObjectBounds(enemy);
      const playerBounds = getObjectBounds(player);

      // коллизия между врагом и пулей
      this.game.projectilesPool.children.forEach((item) => {
        const projectile = item as Projectile;
        const projectileBounds = getObjectBounds(projectile);

        if (
          !projectile.free &&
          Collision.checkCollisionMBxB(enemyBounds, projectileBounds)
        ) {
          projectile.reset();

          // при попадании добавлять пойнты
          statusBar.addScore(1);

          enemy.animatedSprite.animationSpeed = 0.08;
          enemy.animatedSprite.play();
          enemy.setDisable();

          enemy.animatedSprite.onFrameChange = (currentFrame: number) => {
            if (currentFrame === 0) {
              enemy.markedForDeletion = true;
            }
          };
        }
      });

      // коллизия между врагом и игроком
      if (Collision.checkCollisionMBxB(enemyBounds, playerBounds)) {
        enemy.markedForDeletion = true;
        player.subtractLives(1);

        if (!gameOver && statusBar.score > 0) {
          statusBar.subtractScore(1);
          statusBar.changeLives(player.lives);
        }
      }
    });

    this.enemies.children.forEach((enemyItem) => {
      const enemy = enemyItem as Beetlemorph;
      if (enemy.markedForDeletion) {
        enemy.removeFromParent();
      }
    });

    if (this.y + this.height > SceneManager.app.canvas.height) {
      // условие проигрыша
      endGame();
    }
  }

  // создаем двумерный массив врагов
  create() {
    for (let y = 0; y < this.game.enemyRows; y++) {
      for (let x = 0; x < this.game.enemyColumns; x++) {
        const enemyX = x * this.game.enemySize;
        const enemyY = y * this.game.enemySize;
        const randomKey = String(Math.floor(Math.random() * 4 + 1));

        const enemy = new Beetlemorph(
          this.game,
          randomKey,
          this.beetleMorphAnimations
        );
        enemy.position.set(enemyX, enemyY);
        this.enemies.addChild(enemy);
      }
    }
  }
}
