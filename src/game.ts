import { Sprite, type Texture } from "pixi.js";
import { LoaderModal } from "./loader-modal";
import { DefaultScene } from "./scene-manager";

export class Game extends DefaultScene {
  private background: Texture;

  constructor() {
    super();

    const loaderModal = new LoaderModal();
    const { backgroundTexture } = loaderModal.getAssets();

    this.background = backgroundTexture;
    this.addBackground();
  }

  addBackground() {
    const backgroundSprite = new Sprite(this.background);
    this.addChild(backgroundSprite);
  }
}
