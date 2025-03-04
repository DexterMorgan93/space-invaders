import { Application, Container, Graphics } from "pixi.js";

export class Player extends Graphics {
  game: Game;
  widthPlayer: number;
  heightPlayer: number;
  speed: number;

  constructor(game: Game) {
    super();
    this.game = game;
    this.widthPlayer = 100;
    this.heightPlayer = 100;
    const xPosPlayer = this.game.widthGame * 0.5 - this.widthPlayer * 0.5;
    const yPosPlayer = this.game.heightGame - this.heightPlayer;
    this.position.set(xPosPlayer, yPosPlayer);
    this.speed = 20;
  }

  draw() {
    this.rect(0, 0, this.widthPlayer, this.heightPlayer).fill({
      color: "black",
      alpha: 1,
    });
  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y);
    }
  }
}
export class Projectile extends Graphics {
  widthProjectile: number;
  heightProjectile: number;
  speed: number;
  free: boolean;

  constructor() {
    super();
    this.widthProjectile = 8;
    this.heightProjectile = 40;
    this.speed = 20;
    this.free = true; // sitting in the pool & ready to use
  }

  draw() {
    if (!this.free) {
      this.rect(0, 0, this.widthProjectile, this.heightProjectile).fill({
        color: "white",
        alpha: 1,
      });
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.heightProjectile) this.reset();
    }
  }
  start(x: number, y: number) {
    // object is using & not available right now
    this.x = x - this.widthProjectile * 0.5;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}

export class Enemy extends Graphics {
  game: Game;
  widthEnemy: number;
  heightEnemy: number;
  positionX: number;
  positionY: number;

  constructor(game: Game, positionX: number, positionY: number) {
    super();
    this.game = game;
    this.widthEnemy = this.game.enemySize;
    this.heightEnemy = this.game.enemySize;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  draw() {
    this.rect(0, 0, this.widthEnemy, this.heightEnemy).stroke({ color: "red" });
  }

  update(waveX: number, waveY: number) {
    this.x = waveX + this.positionX;
    this.y = waveY + this.positionY;
  }
}

export class Wave extends Container {
  game: Game;
  widthWave: number;
  heightWave: number;
  speedX: number;
  speedY: number;
  enemies: Enemy[];

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
      enemy.draw();
      this.game.addChild(enemy);
    });
  }

  create() {
    for (let y = 0; y < this.game.enemyRows; y++) {
      for (let x = 0; x < this.game.enemyColumns; x++) {
        let enemyX = x * this.game.enemySize;
        let enemyY = y * this.game.enemySize;
        console.log(enemyX);
        this.enemies.push(new Enemy(this.game, enemyX, enemyY));
      }
    }
  }
}

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

  constructor(app: Application) {
    super();
    this.app = app;
    this.widthGame = app.screen.width;
    this.heightGame = app.screen.height;

    this.player = new Player(this);
    this.addChild(this.player);

    this.enemyColumns = 3;
    this.enemyRows = 3;
    this.enemySize = 60;
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
    this.player.draw();

    this.projectilesPool.forEach((projectile) => {
      this.addChild(projectile);
      projectile.draw();
      projectile.update();
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
      this.projectilesPool.push(new Projectile());
    }
  }
  // get free projectile from the pool
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
}
