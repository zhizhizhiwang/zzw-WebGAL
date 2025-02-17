import { sceneFetcher } from './sceneFetcher';
import { sceneParser } from '../../parser/sceneParser';
import { logger } from '../../util/logger';
import { nextSentence } from '@/Core/controller/gamePlay/nextSentence';
import { ISceneEntry } from '@/Core/Modules/scene';
import { WebSocketClient } from '../../util/WebSocket'
import { WebGAL } from '@/Core/WebGAL';

/**
 * 恢复场景
 * @param entry 场景入口
 */
export const restoreScene = (entry: ISceneEntry) => {
  if (WebGAL.sceneManager.lockSceneWrite) {
    return;
  }
  WebGAL.sceneManager.lockSceneWrite = true;
  const socket = new WebSocketClient();
  // 场景写入到运行时
  sceneFetcher(entry.sceneUrl)
    .then( async (rawScene) => {
      WebGAL.sceneManager.sceneData.currentScene = sceneParser(rawScene, entry.sceneName, entry.sceneUrl);
      WebGAL.sceneManager.sceneData.currentSentenceId = entry.continueLine + 1; // 重设场景
      logger.debug('现在恢复场景，恢复后场景：', WebGAL.sceneManager.sceneData.currentScene);
      try {
        await socket.send(WebGAL.sceneManager.sceneData)
        logger.debug("changeScene成功发送数据")
      } catch(error) {
        logger.error("socket连接错误", error)
      }
      WebGAL.sceneManager.lockSceneWrite = false;
      nextSentence();
      socket.close()
    })
    .catch((e) => {
      logger.error('场景调用错误', e);
      WebGAL.sceneManager.lockSceneWrite = false;
    });
};
