interface IBound {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Collision {
  static checkCollisionMBxB(a: IBound, b: IBound): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
