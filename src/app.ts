import { Application, Assets, Sprite } from "pixi.js";
import { Game } from "./main";
import "./style.css";

(async () => {
  const app = new Application();

  await app.init({ background: "#1099bb", width: 600, height: 800 });

  document.body.appendChild(app.canvas);

  const manifest = {
    bundles: [
      {
        name: "load-screen",
        assets: [
          {
            alias: "background",
            src: "./../public/assets/background.png",
          },
        ],
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle([manifest.bundles[0].name]);

  const backgroundTexture = Assets.get(manifest.bundles[0].assets[0].alias);
  const background = new Sprite(backgroundTexture);

  const game = new Game(app);

  app.stage.addChildAt(background, 0);
  app.stage.addChild(game);
  app.ticker.add(() => {
    game.render();
  });
})();
