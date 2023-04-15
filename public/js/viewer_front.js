/**
 * viewer_frontページを起動した際に最初に呼び出されるjs
 * ここでは裏側の処理を記載せずに、処理を行うクラスを呼び出しましょう
 */

import ViewerMain from "./ViewerMain.js";

// ViewerMain
const viewer = new ViewerMain();
await viewer.init();
document.addEventListener('mousedown', viewer.onClickSphereAndText, false);
