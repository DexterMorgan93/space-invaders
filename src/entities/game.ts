import { Container, Sprite, Spritesheet, type Texture } from "pixi.js";
import { LoaderModal } from "../features/loader-modal";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Wave } from "./wave";
import { Statusbar } from "./status-bar";
import { EndGameModal } from "./end-game-modal";
import { getObjectBounds } from "../shared/lib/bounds";
import { Beetlemorph } from "./enemy/beetlemorph";
import { Collision } from "../shared/lib/collision";

export class Game extends DefaultScene {
  private background: Texture;
  private maxProjectiles = 10;
  private wave!: Wave;
  private waveCount = 1;
  private endGameModal!: EndGameModal;

  public player: Player;
  public playerLifes = 3;
  private playerTextures!: Spritesheet;
  private playerJetsTextures!: Spritesheet;

  public statusBar!: Statusbar;
  public projectilesPool: Container;
  public enemyColumns = 3;
  public enemyRows = 3;
  public enemySize = 80;
  public gameOver = false;
  public beetlemorph!: Spritesheet;

  constructor() {
    super();

    const loaderModal = new LoaderModal();
    const {
      backgroundTexture,
      beetlemorph,
      player: playerTextures,
      playerJets,
    } = loaderModal.getAssets();
    this.beetlemorph = beetlemorph;
    this.playerTextures = playerTextures;

    this.playerJetsTextures = playerJets;

    this.background = backgroundTexture;
    this.addBackground();

    const player = new Player(
      this,
      this.playerTextures,
      this.playerJetsTextures
    );
    player.position.set(
      SceneManager.app.canvas.width * 0.5 - player.width * 0.5,
      SceneManager.app.canvas.height - player.height
    );
    this.player = player;
    this.addChild(this.player);

    this.projectilesPool = new Container();
    this.projectilesPool.label = "ProjectilesPool";
    this.addChild(this.projectilesPool);
    this.createProjectiles();

    this.createWave();

    this.statusBar = new Statusbar();
    this.addChild(this.statusBar);

    this.addEventListeners();
  }

  handleUpdate(): void {
    this.player.handleUpdate();
    this.wave.update();
    const { position, velocity } = this.player;
    const playerBounds = getObjectBounds(this.player);

    if (velocity.vy > 0) {
      this.player.shoot();
    }
    // TODO останавливать при выходе игрока наполовину
    if (playerBounds.x + velocity.vx < -playerBounds.width * 0.5) {
      velocity.vx = 0;
      position.x = -playerBounds.width * 0.5;
    } else if (
      playerBounds.x + velocity.vx >
      SceneManager.app.canvas.width - playerBounds.width * 0.5
    ) {
      velocity.vx = 0;
      position.x = SceneManager.app.canvas.width - playerBounds.width * 0.5;
    } else {
      position.x += velocity.vx;
    }
    this.player.updateState();

    this.projectilesPool.children.forEach((item) => {
      const projectile = item as Projectile;
      projectile.handleUpdate();
      projectile.draw();

      // если пуля выходит за границы то возвращаем ее в пул обратно
      if (projectile.y < -projectile.height) {
        projectile.reset();
      }
    });

    if (this.wave.children.length < 1 && !this.gameOver) {
      this.wave.removeFromParent();
      this.createWave();
      this.waveCount++;
      this.wave.nextWaveTrigger = true;
      this.statusBar.changeWave(this.waveCount);
      this.statusBar.addLives(1);

      if (
        Math.random() < 0.5 &&
        this.enemyColumns * this.enemySize < SceneManager.app.canvas.width * 0.8
      ) {
        this.enemyColumns++;
      } else if (
        this.enemyRows * this.enemySize <
        SceneManager.app.canvas.height * 0.6
      ) {
        this.enemyRows++;
      }
    }

    this.wave.children.forEach((enemyItem) => {
      const enemy = enemyItem as Beetlemorph;
      const enemyBounds = getObjectBounds(enemy);
      const playerBounds = getObjectBounds(this.player);

      // коллизия между врагом и пулей
      this.projectilesPool.children.forEach((item) => {
        const projectile = item as Projectile;
        const projectileBounds = getObjectBounds(projectile);

        if (
          !projectile.free &&
          Collision.checkCollisionMBxB(enemyBounds, projectileBounds)
        ) {
          projectile.reset();

          // при попадании добавлять пойнты
          this.statusBar.addScore(1);

          enemy.animatedSprite.animationSpeed = 0.08;
          enemy.animatedSprite.play();
          enemy.setDisable();

          enemy.animatedSprite.onFrameChange = (currentFrame: number) => {
            if (currentFrame === 0) {
              enemy.markedForDeletion = true;
            }
            enemy.angle = 0.5;
          };
        }
      });

      // коллизия между врагом и игроком
      if (Collision.checkCollisionMBxB(enemyBounds, playerBounds)) {
        enemy.markedForDeletion = true;

        if (!this.gameOver && this.statusBar.score > 0) {
          this.statusBar.subtractScore(1);
          this.statusBar.subtractLives(1);
        }
      }

      if (enemy.markedForDeletion) {
        enemy.removeFromParent();
      }
    });

    if (this.wave.y + this.wave.height > SceneManager.app.canvas.height) {
      // условие проигрыша
      this.endGame();
    }
  }

  // создаем двумерный массив врагов
  createWave() {
    this.wave = new Wave(this, this.beetlemorph);
    this.addChild(this.wave);
    this.wave.nextWaveTrigger = false;

    for (let y = 0; y < this.enemyRows; y++) {
      for (let x = 0; x < this.enemyColumns; x++) {
        const enemyX = x * this.enemySize;
        const enemyY = y * this.enemySize;
        const randomKey = String(Math.floor(Math.random() * 4 + 1));

        const enemy = new Beetlemorph(
          this,
          randomKey,
          this.beetlemorph.animations
        );
        enemy.position.set(enemyX, enemyY);
        this.wave.addChild(enemy);
      }
    }
  }

  // создаем сразу же фиксированное количество пуль. Object pool pattenr design
  createProjectiles(): void {
    for (let i = 0; i < this.maxProjectiles; i++) {
      this.projectilesPool.addChild(new Projectile());
    }
  }

  // находим свободную пулю в пуле пуль))
  getFreeProjectile(): Projectile | undefined {
    for (let i = 0; i < this.projectilesPool.children.length; i++) {
      const element = this.projectilesPool.children[i] as Projectile;

      if (element.free) {
        return element;
      }
    }
  }

  endGame = () => {
    this.gameOver = true;
    this.endGameModal = new EndGameModal(this);
    this.addChild(this.endGameModal);

    SceneManager.app.ticker.stop();
  };

  addBackground() {
    const backgroundSprite = new Sprite(this.background);
    backgroundSprite.label = "background";
    this.addChild(backgroundSprite);
  }

  addEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        this.player.applyLeftDirection(true);
        break;
      case "KeyD":
      case "ArrowRight":
        this.player.applyRightDirection(true);
        break;
      case "Numpad1":
      case "Space":
        this.player.applyShoot(true);
        break;
    }
  };
  handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        this.player.applyLeftDirection(false);
        break;
      case "KeyD":
      case "ArrowRight":
        this.player.applyRightDirection(false);
        break;
      case "Numpad1":
      case "Space":
        this.player.applyShoot(false);
        break;
    }
  };
}
