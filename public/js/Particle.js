'use strict'

/**
 * パーティクルのクラス
 */
class Particle {
  constructor() {
    /** @type{ number } パーティクルの数 */
    this.count = 18000;

    /** @type{ number } パーティクルの乱数を生成する範囲 */
    this.random_particle_range = 20000;

    /** @type{ number } ドットの大きさ */
    this.particle_size = 10;
  }

  /**
   * パーティクルを作成する
   * @returns {Promise<THREE.Points>} パーティクル
   */
  async generateParticle () {
    const particle_geometry = new THREE.BufferGeometry();
    const particle_array = new Float32Array(this.count * 3); // パーティクルの配列
    const color_array = new Float32Array(this.count * 3) // 色の配列
    for (let i = 0; i < this.count * 3; i++) {
      // 0~99999の間で配列を作成する
      particle_array[i] = Math.random() * this.random_particle_range;
      // 色をランダムに作成する
      color_array[i] = Math.random(); // 配色は0~1の値で変化する
    }
    // パーティクルの配列にランダムのpositionをセットする
    particle_geometry.setAttribute("position", new THREE.BufferAttribute(particle_array, 3))
    // 色の配列にランダムのpositionをセットする(BufferGeometryの頂点にcolorをsetすると色が適用される)
    particle_geometry.setAttribute("color", new THREE.BufferAttribute(color_array, 3))

    // マテリアルの作成
    const particle_material = new THREE.PointsMaterial({
      size: this.particle_size,
      vertexColors: true, //頂点の色を有効にするためのプロパティ
    })

    // パーティクルを作成
    const particle = new THREE.Points(particle_geometry, particle_material);

    // パーティクルが配置される範囲を取得し、中心に移動させる
    const bounding_area = new THREE.Box3().setFromObject(particle); // パーティクルが配置される範囲
    const center = bounding_area.getCenter(new THREE.Vector3()); // パーティクルの中心座標
    // モデルの位置を中心に移動する
    particle.position.sub(center);// model.positionの座標が、centerの座標を引いた座標に更新される。

    return particle;
  }
}

export { Particle as default }
