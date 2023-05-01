"use strict";

/**
 * TweenAnimationクラス
 */
class TweenAnimation {
  constructor(camera) {

    /** @type{THREE.PerspectiveCamera} カメラに関する情報クラス */
    this.camera = camera;

    /** @type{number} tween_firstの実行時間 */
    this.tween_first_duration = 1500;

    /** @type{number} tween_secondの実行時間 */
    this.tween_second_duration = 1000;

    /** @type{number} return_firstの実行時間 */
    this.return_first_duration = 1500;

    /** @type{number} return_secondの実行時間 */
    this.return_second_duration = 1000;

  }

  async startTween () {

    // 最初のTweenアニメーション
    const tween_first = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, 0, 0)], this.tween_first_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });
    // 次のTweenアニメーション
    const tween_second = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, 3000, 0), new THREE.Vector3(0, Infinity, 0)], this.tween_second_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)

    // tween_firstの後にtween_secondを紐づける
    tween_first.chain(tween_second);

    // tween_firstを起動する
    tween_first.start();
  }

  /**
   * 元の視点に戻るTweenアニメーション
   * @param {number} radius 環の半径
   */
  async returnTween (radius) {

    // 最初のreturn_tweenアニメーション
    const return_first = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, 0, 0)], this.return_first_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)

    // 2番目のreturn_tweenアニメーション
    const return_second = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, 0, radius + 1000), new THREE.Vector3(0, 0, 0)], this.return_second_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });

    // return_firstの後にreturn_secondを紐づける
    return_first.chain(return_second)

    // return_tweenを起動する
    return_first.start();
  }
}

export { TweenAnimation as default };
