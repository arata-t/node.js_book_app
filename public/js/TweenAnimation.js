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

    /** @type{number} tween_returnの実行時間 */
    this.tween_return_duration = 2000;

    /** @type{THREE.Vector3} 原点の座標 */
    this.origin_point = new THREE.Vector3(0, 0, 0);

  }

  async startTween () {
    /** @type{THREE.Vector3} 最初のTweenアニメーションの目的地 */
    const first_destination = new THREE.Vector3(0, 6000, 0);

    /** @type{THREE.Vector3} 2番目のTweenアニメーションの目的地 */
    const second_position = new THREE.Vector3(0, -2000, 0);

    // 最初のTweenアニメーション
    const tween_first = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, 6000, 0), new THREE.Vector3(0, 0, 0)], this.tween_first_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      });
    // 次のTweenアニメーション
    const tween_second = new TWEEN.Tween([this.camera.position, this.camera.target])
      .to([new THREE.Vector3(0, -2000, 0), new THREE.Vector3(0, -Infinity, 0)], this.tween_second_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
    tween_first.chain(tween_second);

    // Tweenを起動する
    tween_first.start();
  }

  /**
   * 元の視点に戻るTweenアニメーション
   * @param {number} radius 環の半径
   */
  async returnTween (radius) {
    /** @type{THREE.Vector3} 最初のTweenアニメーションの開始位置 */
    const initial_point = new THREE.Vector3(0, 0, radius + 1000);

    // 一覧に戻るTweenアニメーション
    const tween_return = new TWEEN.Tween([this.camera.position, this.camera.target, this.camera.rotation])
      .to([new THREE.Vector3(0, 0, radius + 1000), this.origin_point, this.camera.rotation], this.tween_return_duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        this.camera.lookAt(this.origin_point);
      });
    // Tweenを起動する
    tween_return.start();
  }
}

export { TweenAnimation as default };
