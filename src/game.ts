import { Sprite, Ticker, type Texture } from "pixi.js";
import { LoaderModal } from "./loader-modal";
import { DefaultScene, SceneManager } from "./scene-manager";
import { Player } from "./player";

export class Game extends DefaultScene {
  private background: Texture;
  private player: Player;

  constructor() {
    super();

    const loaderModal = new LoaderModal();
    const { backgroundTexture } = loaderModal.getAssets();

    this.background = backgroundTexture;
    this.addBackground();

    const player = new Player();
    player.position.set(
      SceneManager.app.canvas.width * 0.5 - player.width * 0.5,
      SceneManager.app.canvas.height - player.height
    );
    this.player = player;
    this.addChild(player);
  }

  addBackground() {
    const backgroundSprite = new Sprite(this.background);
    this.addChild(backgroundSprite);
  }

  handleUpdate(deltaMS: Ticker): void {
    this.player.handleUpdate();
  }
}
