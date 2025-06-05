import { Container, Sprite, type Texture } from "pixi.js";
import { LoaderModal } from "../features/loader-modal";
import { DefaultScene, SceneManager } from "../features/scene-manager";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Wave } from "./wave";

export class Game extends DefaultScene {
  private background: Texture;
  private player: Player;
  private maxProjectiles = 10;
  private wave: Container;

  public projectilesPool: Container;
  public enemyColumns = 3;
  public enemyRows = 3;
  public enemySize = 60;

  constructor() {
    super();

    const loaderModal = new LoaderModal();
    const { backgroundTexture } = loaderModal.getAssets();

    this.background = backgroundTexture;
    this.addBackground();

    const player = new Player(this);
    player.position.set(
      SceneManager.app.canvas.width * 0.5 - player.width * 0.5,
      SceneManager.app.canvas.height - player.height
    );
    this.player = player;
    this.addChild(this.player);

    this.projectilesPool = new Container();
    this.addChild(this.projectilesPool);
    this.createProjectiles();

    this.wave = new Container();
    this.wave.addChild(new Wave(this));
    this.addChild(this.wave);

    this.addEventListeners();
  }

  handleUpdate(): void {
    this.player.handleUpdate();

    this.projectilesPool.children.forEach((item) => {
      const projectile = item as Projectile;
      projectile.handleUpdate();
      projectile.draw();

      // если пуля выходит за границы то возвращаем ее в пул обратно
      if (projectile.y < -projectile.height) {
        projectile.reset();
      }
    });

    this.wave.children.forEach((item) => {
      const wave = item as Wave;
      wave.handleUpdate();
    });
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

  addBackground() {
    const backgroundSprite = new Sprite(this.background);
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
        this.player.handleMove(true, true);
        break;
      case "KeyD":
      case "ArrowRight":
        this.player.handleMove(true, false);
        break;
      case "Numpad1":
        this.player.shoot();
        break;
    }
  };
  handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        this.player.handleMove(false, true);
        break;
      case "KeyD":
      case "ArrowRight":
        this.player.handleMove(false, false);
        break;
    }
  };
}
