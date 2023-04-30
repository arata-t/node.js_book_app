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

  }

  async startTween () {
    /** @type{THREE.Vector3} 最初のTweenアニメーションの開始位置 */
    const first_position = new THREE.Vector3(0, 6000, 0);

    /** @type{THREE.Vector3} 最初のTweenアニメーションの終了位置 */
    const first_target = new THREE.Vector3(0, 0, 0);

    /** @type{THREE.Vector3} 2番目のTweenアニメーションの終了位置 */
    const second_position = new THREE.Vector3(0, this.tween_second_duration, 0);

    // 最初のTweenアニメーション
    const tween_first = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([first_position, first_target], this.tween_first_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        this.camera.lookAt(first_target);
      });
    // 次のTweenアニメーション
    const tween_second = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([second_position, null], this.tween_second_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
    tween_first.chain(tween_second);

    // Tweenを起動する
    tween_first.start();
  }
}

export { TweenAnimation as default };
