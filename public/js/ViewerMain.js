"use strict";

import TextAndSphere from "./TextAndSphere.js";
/**
 * viewer_frontから呼び出されるviewのメイン処理クラス
 */
class ViewerMain {
  constructor() {
    /** @type {object} フォントに関する情報 */
    this.font = '';

    /**  @type {object} カメラに関する情報 */
    this.camera = '';

    /**  @type {object} シーンに関する情報 */
    this.scene = '';

    /**  @type {object} レンダラーに関する情報 */
    this.renderer = '';

  }

  /**
   * ビューアーを初期化する
   * Bookの情報をThree.jsでモデリング化する処理などを書く
   */
  async init () {

    // 最初にFontLoaderを読み込む必要がある
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('../fonts/Rounded Mplus 1c_Regular.json', (font) => {

      // フォントに関する情報
      this.font = font;

      // ビューアーを生成する
      this.generateViewer();

      // 画面の拡大縮小に対応
      window.addEventListener('resize', this.onResize, false);

    })
  }

  /**
   * 画面をリサイズする
   */
  onResize = async () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * ビューアーを起動する
   */
  async generateViewer () {

    // 3Dシーンを作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewer_front").appendChild(this.renderer.domElement);

    // 空間の中心に3D起点を追加
    const centerAxes = new THREE.AxesHelper(100);
    this.scene.add(centerAxes);

    // groupに後から作成したオブジェクトを格納する
    let group = new THREE.Group();
    this.scene.add(group);

    // テキストのモデルを作成、textAndSphereはGUIで可変なためletで定義
    let textAndSphere = await new TextAndSphere().generateMesh(this.font);
    this.scene.add(textAndSphere);

    // オブジェクト群を作成する
    async function generateTextObjectAndSphere (font, n) {
      for (let i = 0; i < n; i++) {

        // テキストのモデルを作成
        const TextAndSphere = new TextAndSphere(font);
        // textAndSphereはGUIで可変なためletで定義
        let textAndSphere = await TextAndSphere.generateMesh();

        // オブジェクトから半径を算定
        const width = 800;
        // const height = textAndSphere.geometry.parameters.options.size * 9; // TextObjectの高さ
        const radius = width * (n / (2 * Math.PI)); // 半径

        // 縦の円状に配置するための座標を計算
        const theta = (i / n) * Math.PI * 2; // 角度
        const x = radius * Math.cos(theta); // y座標
        const z = radius * Math.sin(theta); // z座標

        // textObjectの位置を設定
        // textAndSphere.position.setX(x);
        // textAndSphere.position.setZ(z);

        // グループにtextObjectを追加
        group.add(textAndSphere);
      }
    }
    // generateTextObjectAndSphere(this.font, 1);

    // カメラを移動
    this.camera.position.z = 1000;

    // カメラコントローラーを作成
    const orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    /**
     * フレーム毎に実行されるアニメーション
     *
     */
    const animate = () => {
      group.rotation.y += 0.005;
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }
}

export { ViewerMain as default };
