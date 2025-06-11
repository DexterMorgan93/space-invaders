import { Container, Text, Graphics } from "pixi.js";

export class Statusbar extends Container {
  private score = 0;
  private scoreText!: Text;
  private scoreContent!: Text;

  private wave = 1;
  private waveText!: Text;
  private waveContent!: Text;

  background!: Graphics;

  constructor() {
    super();
    this.setup();
    this.drawBackground();
  }

  setup() {
    this.scoreText = new Text({
      text: "Score:",
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.scoreText.position.set(20, 20);
    this.addChild(this.scoreText);

    this.scoreContent = new Text({
      text: String(this.score),
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.scoreContent.position.set(this.scoreText.width + 25, 20);
    this.addChild(this.scoreContent);

    this.waveText = new Text({
      text: "Wave:",
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.waveText.position.set(20, this.waveText.height + 25);
    this.addChild(this.waveText);

    this.waveContent = new Text({
      text: String(this.wave),
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.waveContent.position.set(
      this.waveText.width + 25,
      this.waveText.height + 25
    );
    this.addChild(this.waveContent);
  }

  drawBackground() {
    this.background = new Graphics();
    this.background
      .rect(0, 0, this.width + 40, this.height + 40)
      .fill({ color: 0xffffff });
    this.background.alpha = 0.2;
    this.addChild(this.background);
  }

  addScore(point: number) {
    this.score += point;
    this.scoreContent.text = this.score;
  }

  changeWave(value: number) {
    this.wave = value;
    this.waveContent.text = this.wave;
  }

  // restart(): void {
  //   this.coins = 100;
  //   this.coinsText.text = this.coins;
  //   this.hearts = 10;
  //   this.heartsText.text = this.hearts;
  // }
}
