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

export class Game extends Container {
  app: Application;
  widthGame: number;
  heightGame: number;
  player: Player;
  keys: string[];
  projectilesPool: Projectile[];
  numberOfProjectiles: number;

  constructor(app: Application) {
    super();
    this.app = app;
    this.widthGame = app.screen.width;
    this.heightGame = app.screen.height;

    this.player = new Player(this);
    this.addChild(this.player);

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
