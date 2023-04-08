"use strict";

import TextAndSphere from "./TextAndSphere.js";
/**
 * viewer_frontから呼び出されるviewのメイン処理クラス
 */
class ViewerMain {
  constructor() {

    /** @type {object} 本に関する情報のオブジェクト */
    this.books = {};

    /** @type {object} フォントに関する情報 */
    this.font = {};

    /** @type {THREE.PerspectiveCamera} カメラに関する情報クラス */
    this.camera = null;

    /** @type {THREE.Scene} シーンに関する情報クラス */
    this.scene = null;

    /** @type {THREE.WebGLRenderer} レンダラーに関する情報クラス */
    this.renderer = null;

    /**
     * @type {TreeWalker.Group} 全体を統括するグループ
     * このグループ内にモデルをaddする
     */
    this.master_group = null;

  }

  /**
   * ビューアーを初期化する
   * Bookの情報をThree.jsでモデリング化する処理などを書く
   */
  async init () {

    // サーバーからブックオブジェクトを取得
    this.books = await this.getBooks();

    // 最初にFontLoaderを読み込む必要がある
    const font_loader = new THREE.FontLoader();
    font_loader.load('../fonts/Rounded Mplus 1c_Regular.json', (font) => {

      // フォントに関する情報をセットする
      this.font = font;

      // ビューアーを生成する
      this.startView();

      // 画面の拡大縮小に対応
      window.addEventListener('resize', this.onResize, false);

    })
  }

  /**
   * 画面をリサイズに合わせて、画面のアスペクト比を調整する
   */
  onResize = async () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * ビューアーを起動する
   */
  async startView () {

    // 3Dシーンを作成
    this.scene = new THREE.Scene();

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewer_front").appendChild(this.renderer.domElement);

    // 空間の中心に3D起点を追加
    const center_axes = new THREE.AxesHelper(100);
    this.scene.add(center_axes);

    // 全体を統括するグループをシーンに追加
    this.master_group = new THREE.Group();
    this.scene.add(this.master_group);

    // テキストと球体のモデル群を作成する
    this.generateTextAndSphereGroup();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // カメラを移動
    this.camera.position.z = 1500;

    // カメラコントローラーを作成
    const orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    /**
     * フレーム毎に実行されるアニメーション
     */
    const animate = () => {
      this.master_group.rotation.y -= 0.005;
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }

  /**
   * サーバーからブックオブジェクトを取得する
   * @returns {object} booksオブジェクトのデータ
   */
  async getBooks () {
    try {
      // サーバーから値を取得
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Error:', response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert('ブックオブジェクトの取得に失敗しました。');
    }
  }

  /**
   * テキストと球体のモデル群を作成する
   */
  generateTextAndSphereGroup = async () => {

    /** @type {number} book_num ブックオブジェクトの数 */
    const book_num = this.books.length;
    for (let current_num = 0; current_num < book_num; current_num++) {

      // //環状テキストメッシュとワイヤーフレームの球体のグループを作成しシーンに追加
      const textAndSphereClass = new TextAndSphere();
      const text_and_sphere = await textAndSphereClass.generateTextAndSphere(this.books, this.font, current_num);

      // オブジェクトから半径を算定
      const width = 1000;
      const radius = width * (book_num / (2 * Math.PI)); // 半径

      // 縦の円状に配置するための座標を計算
      const theta = (current_num / book_num) * Math.PI * 2; // 角度
      const x = radius * Math.cos(theta); // y座標
      const z = radius * Math.sin(theta); // z座標

      // textObjectの位置を設定
      text_and_sphere.position.setX(x);
      text_and_sphere.position.setZ(z);

      // グループにtextObjectを追加
      this.master_group.add(text_and_sphere);

      // textAndSphereクラスのアニメーションを実行
      textAndSphereClass.animate();
    }
  }
}

export { ViewerMain as default };
