import { Application, Assets } from "pixi.js";
import { Game } from "./main";
import "./style.css";
import { addBackGround } from "./add-background";
import { AssetsFactory } from "./assets-factory";

const app = new Application();

(async () => {
  await setup();
  await preload();
  const assets = new AssetsFactory();

  const game = new Game(app, assets);
  app.stage.addChild(game);

  app.ticker.add(() => {
    game.render();
  });
})();

async function setup() {
  await app.init({ background: "#1099bb", width: 600, height: 800 });
  document.body.appendChild(app.canvas);
}

async function preload() {
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
      {
        name: "beetlemorph",
        assets: [
          { alias: "beetlemorph", src: "./../public/assets/beetlemorph.json" },
        ],
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle(["load-screen", "beetlemorph"]);

  addBackGround(app);
}
