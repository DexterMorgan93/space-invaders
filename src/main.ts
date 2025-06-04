import { LoaderModal } from "./features/loader-modal";
import { SceneManager } from "./features/scene-manager";
import { delay } from "./shared/lib/delay";
import { StartModal } from "./entities/start-modal";

async function run(): Promise<void> {
  await SceneManager.initialize();

  const loaderModal = new LoaderModal();
  await SceneManager.changeScene(loaderModal);
  await loaderModal.initializeLoader();

  await delay(500);
  await SceneManager.changeScene(new StartModal());
}

run();
