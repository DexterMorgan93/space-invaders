import { Sprite, type Texture } from "pixi.js";
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
    this.addChild(this.player);

    this.addEventListeners();
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

  handleUpdate(): void {
    this.player.handleUpdate();
  }
}
