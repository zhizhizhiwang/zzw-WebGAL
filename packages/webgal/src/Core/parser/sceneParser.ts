import { IScene } from '../controller/scene/sceneInterface';
import { logger } from '../util/logger';
import { assetsPrefetcher } from '@/Core/util/prefetcher/assetsPrefetcher';
import { assetSetter } from '@/Core/util/gameAssetsAccess/assetSetter';
import SceneParser from 'webgal-parser';

import { commandType, ISentence } from '@/Core/controller/scene/sceneInterface';
import { intro } from '@/Core/gameScripts/intro';
import { changeBg } from '@/Core/gameScripts/changeBg';
import { changeFigure } from '@/Core/gameScripts/changeFigure';
import { miniAvatar } from '@/Core/gameScripts/miniAvatar';
import { changeSceneScript } from '@/Core/gameScripts/changeSceneScript';
import { choose } from '@/Core/gameScripts/choose';
import { end } from '../gameScripts/end';
import { bgm } from '@/Core/gameScripts/bgm';
import { playVideo } from '@/Core/gameScripts/playVideo';
import { setComplexAnimation } from '@/Core/gameScripts/setComplexAnimation';
import { setFilter } from '@/Core/gameScripts/setFilter';
import { pixiInit } from '../gameScripts/pixi/pixiInit';
import { pixi } from '@/Core/gameScripts/pixi';
import { label } from '@/Core/gameScripts/label';
import { jumpLabel } from '../gameScripts/jumpLabel';
import { setVar } from '../gameScripts/setVar';
import { showVars } from '../gameScripts/showVars';
import { unlockCg } from '@/Core/gameScripts/unlockCg';
import { unlockBgm } from '@/Core/gameScripts/unlockBgm';
import { say } from '../gameScripts/say';
import { filmMode } from '@/Core/gameScripts/filmMode';
import { callSceneScript } from '@/Core/gameScripts/callSceneScript';
import { setTextbox } from '@/Core/gameScripts/setTextbox';
import { setAnimation } from '@/Core/gameScripts/setAnimation';
import { playEffect } from '@/Core/gameScripts/playEffect';
import { setTempAnimation } from '@/Core/gameScripts/setTempAnimation';
import { comment } from '@/Core/gameScripts/comment';
import { IPerform } from '@/Core/Modules/perform/performInterface';
import { setTransform } from '@/Core/gameScripts/setTransform';
import { setTransition } from '@/Core/gameScripts/setTransition';
import { getUserInput } from '@/Core/gameScripts/getUserInput';

interface IConfigInterface {
  scriptString: string;
  scriptType: commandType;
  scriptFunction: (sentence: ISentence) => IPerform;
}

export const SCRIPT_CONFIG: IConfigInterface[] = [
  { scriptString: 'intro', scriptType: commandType.intro, scriptFunction: intro },
  { scriptString: 'changeBg', scriptType: commandType.changeBg, scriptFunction: changeBg },
  { scriptString: 'changeFigure', scriptType: commandType.changeFigure, scriptFunction: changeFigure },
  { scriptString: 'miniAvatar', scriptType: commandType.miniAvatar, scriptFunction: miniAvatar },
  { scriptString: 'changeScene', scriptType: commandType.changeScene, scriptFunction: changeSceneScript },
  { scriptString: 'choose', scriptType: commandType.choose, scriptFunction: choose },
  { scriptString: 'end', scriptType: commandType.end, scriptFunction: end },
  { scriptString: 'bgm', scriptType: commandType.bgm, scriptFunction: bgm },
  { scriptString: 'playVideo', scriptType: commandType.video, scriptFunction: playVideo },
  {
    scriptString: 'setComplexAnimation',
    scriptType: commandType.setComplexAnimation,
    scriptFunction: setComplexAnimation,
  },
  { scriptString: 'setFilter', scriptType: commandType.setFilter, scriptFunction: setFilter },
  { scriptString: 'pixiInit', scriptType: commandType.pixiInit, scriptFunction: pixiInit },
  { scriptString: 'pixiPerform', scriptType: commandType.pixi, scriptFunction: pixi },
  { scriptString: 'label', scriptType: commandType.label, scriptFunction: label },
  { scriptString: 'jumpLabel', scriptType: commandType.jumpLabel, scriptFunction: jumpLabel },
  { scriptString: 'setVar', scriptType: commandType.setVar, scriptFunction: setVar },
  { scriptString: 'showVars', scriptType: commandType.showVars, scriptFunction: showVars },
  { scriptString: 'unlockCg', scriptType: commandType.unlockCg, scriptFunction: unlockCg },
  { scriptString: 'unlockBgm', scriptType: commandType.unlockBgm, scriptFunction: unlockBgm },
  { scriptString: 'say', scriptType: commandType.say, scriptFunction: say },
  { scriptString: 'filmMode', scriptType: commandType.filmMode, scriptFunction: filmMode },
  { scriptString: 'callScene', scriptType: commandType.callScene, scriptFunction: callSceneScript },
  { scriptString: 'setTextbox', scriptType: commandType.setTextbox, scriptFunction: setTextbox },
  { scriptString: 'setAnimation', scriptType: commandType.setAnimation, scriptFunction: setAnimation },
  { scriptString: 'playEffect', scriptType: commandType.playEffect, scriptFunction: playEffect },
  { scriptString: 'setTempAnimation', scriptType: commandType.setTempAnimation, scriptFunction: setTempAnimation },
  { scriptString: '__commment', scriptType: commandType.comment, scriptFunction: comment },
  { scriptString: 'setTransform', scriptType: commandType.setTransform, scriptFunction: setTransform },
  { scriptString: 'setTransition', scriptType: commandType.setTransition, scriptFunction: setTransition },
  { scriptString: 'getUserInput', scriptType: commandType.getUserInput, scriptFunction: getUserInput },
];
export const ADD_NEXT_ARG_LIST = [
  commandType.bgm,
  commandType.pixi,
  commandType.pixiInit,
  commandType.label,
  commandType.if,
  commandType.miniAvatar,
  commandType.setVar,
  commandType.unlockBgm,
  commandType.unlockCg,
  commandType.filmMode,
  commandType.playEffect,
  commandType.comment,
  commandType.setTransition,
];

/**
 * 场景解析器
 * @param rawScene 原始场景
 * @param sceneName 场景名称
 * @param sceneUrl 场景url
 * @return {IScene} 解析后的场景
 */
export const WebgalParser = new SceneParser(assetsPrefetcher, assetSetter, ADD_NEXT_ARG_LIST, SCRIPT_CONFIG);

export const sceneParser = (rawScene: string, sceneName: string, sceneUrl: string): IScene => {
  const parsedScene = WebgalParser.parse(rawScene, sceneName, sceneUrl);
  logger.info(`解析场景：${sceneName}，数据为：`, parsedScene);
  return parsedScene;
};
