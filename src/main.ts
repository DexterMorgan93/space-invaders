import { Application, Container } from "pixi.js";
import { Player } from "./components/player";
import { Projectile } from "./components/projectile";
import { Enemy } from "./components/enemy";
import { Wave } from "./components/wave";
import { AssetsFactory } from "./assets-factory";

export class Game extends Container {
  app: Application;
  widthGame: number;
  heightGame: number;
  player: Player;
  keys: string[];
  projectilesPool: Projectile[];
  numberOfProjectiles: number;
  enemyColumns: number;
  enemyRows: number;
  enemySize: number;
  enemyWave: Wave[];
  assets: AssetsFactory;

  constructor(app: Application, assets: AssetsFactory) {
    super();

    this.app = app;
    this.widthGame = app.screen.width;
    this.heightGame = app.screen.height;

    this.assets = assets;

    this.player = new Player(this);
    this.addChild(this.player);

    this.enemyColumns = 3;
    this.enemyRows = 3;
    this.enemySize = 80;
    this.enemyWave = [];
    this.enemyWave.push(new Wave(this));

    this.projectilesPool = [];
    this.numberOfProjectiles = 10;
    this.createProjectiles(); // создаем сразу 10 пуль для оптимизации

    this.keys = [];
    addEventListener("keydown", ({ key }) => {
      if (this.keys.indexOf(key) === -1) this.keys.push(key);
      if (key === "1") this.player.shoot();
    });
    addEventListener("keyup", ({ key }) => {
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  render() {
    this.projectilesPool.forEach((projectile) => {
      projectile.update();

      this.addChild(projectile);
    });

    this.enemyWave.forEach((wave) => {
      wave.render();
      this.addChild(wave);
    });

    // horizontal movement
    if (this.keys.indexOf("a") > -1)
      this.player.position.x -= this.player.speed;
    if (this.keys.indexOf("d") > -1)
      this.player.position.x += this.player.speed;

    // horizontal boundaries
    if (this.player.position.x < -this.player.width * 0.5) {
      this.player.position.x = -this.player.width * 0.5;
    } else if (
      this.player.position.x >
      this.widthGame - this.player.width * 0.5
    ) {
      this.player.position.x = this.widthGame - this.player.width * 0.5;
    }
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectilesPool.push(new Projectile(this));
    }
  }
  // get free projectile from the pool
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }

  checkCollisionAB(a: Enemy, b: Projectile) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
