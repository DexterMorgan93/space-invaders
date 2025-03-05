import { Application, Assets, Sprite } from "pixi.js";

export function addBackGround(app: Application) {
  const backgroundTexture = Assets.get("background");
  const background = new Sprite(backgroundTexture);
  background.anchor.set(0.5);

  // если бэкгранд альбомный, то  заполнить ширину экрана и мастшабировать к вертикали.
  if (app.screen.width > app.screen.height) {
    background.width = app.screen.width * 1.2;
    background.scale.y = background.scale.x;
  } else {
    // если бэкгранд квадратный или портретный, то вместо этого заполнить высоту экрана и мастшабировать к горизонту.
    background.height = app.screen.height * 1.2;
    background.scale.x = background.scale.y;
  }

  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  app.stage.addChild(background);
}
