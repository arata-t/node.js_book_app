/**
 * viewer_frontページを起動した際に最初に呼び出されるjs
 * ここでは裏側の処理を記載せずに、処理を行うクラスを呼び出しましょう
 */

import ViewerMain from "./ViewerMain.js";

// ビューアーを起動
const viewer = new ViewerMain();
await viewer.init();

// ビュアーを起動した後にクリックイベントを読み込ませる
document.addEventListener('mousedown', viewer.onClickSphereAndText, false);
