import { Application } from "pixi.js";
import { Game } from "./main";
import "./style.css";

(async () => {
  const app = new Application();

  await app.init({ background: "#1099bb", width: 600, height: 800 });

  document.body.appendChild(app.canvas);

  const game = new Game(app);
  app.stage.addChild(game);

  app.ticker.add(() => {
    game.render();
  });
})();
