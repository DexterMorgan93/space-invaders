import { Container, Text, Graphics } from "pixi.js";

export class Statusbar extends Container {
  public score = 0;
  private scoreText!: Text;
  private scoreContent!: Text;

  private wave = 1;
  private waveText!: Text;
  private waveContent!: Text;

  private lives = 3;
  private livesText!: Text;
  private livesContent!: Text;

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

    this.livesText = new Text({
      text: "Lives:",
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.livesText.position.set(20, this.livesText.height + 55);
    this.addChild(this.livesText);

    this.livesContent = new Text({
      text: String(this.lives),
      style: {
        fontSize: 24,
        fill: "white",
        stroke: 2,
      },
    });
    this.livesContent.position.set(
      this.livesText.width + 25,
      this.livesText.height + 55
    );
    this.addChild(this.livesContent);
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

  subtractScore(point: number) {
    this.score -= point;
    this.scoreContent.text = this.score;
  }

  changeWave(value: number) {
    this.wave = value;
    this.waveContent.text = this.wave;
  }

  subtractLives(value: number) {
    this.lives -= value;
    this.livesContent.text = this.lives;
  }
  addLives(value: number) {
    this.lives += value;
    this.livesContent.text = this.lives;
  }

  // restart(): void {
  //   this.coins = 100;
  //   this.coinsText.text = this.coins;
  //   this.hearts = 10;
  //   this.heartsText.text = this.hearts;
  // }
}
