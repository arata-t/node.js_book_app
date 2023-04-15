"use strict";

import TextAndSphere from "./TextAndSphere.js";
import WireframeSphere from "./WireframeSphere.js"
import Particle from "./Particle.js"

/**
 * viewer_frontから呼び出1されるviewのメイン処理クラス
 */
class ViewerMain {
  constructor() {

    /** @type {array} 本に関する情報の配列 */
    this.books = [];

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
    this.master_circle_group = null;

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
    font_loader.load('../fonts/Zen Kaku Gothic New Medium_Regular.json', (font) => {

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

    // 球体全体を統括するグループをシーンに追加
    this.master_circle_group = new THREE.Group();
    this.scene.add(this.master_circle_group);

    // テキストと球体のモデル群を作成し、円の半径を返却する
    const radius = await this.generateTextAndSphereGroup();

    // パーティクルを作成する
    const particle = await new Particle().generateParticle();
    this.scene.add(particle);

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);

    // カメラを移動
    this.camera.position.z = radius + 1000;

    // カメラコントローラーを作成
    const orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // 滑らかにカメラコントローラーを制御する
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.2;

    // アニメーションを実行
    this.animate();
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
   * @returns {Promise<number>} radius 円の半径
   */
  generateTextAndSphereGroup = async () => {

    /** @type {number} book_num ブックオブジェクトの数 */
    const book_num = this.books.length;

    // 球体同士の間隔から半径を求める
    const distance = new WireframeSphere().radius * 10; // 球体同士の間隔
    /** @type {number} radius 円の半径 */
    const radius = distance * (book_num / (2 * Math.PI));

    for (let current_num = 0; current_num < book_num; current_num++) {

      // //環状テキストメッシュとワイヤーフレームの球体のグループを作成しシーンに追加
      const textAndSphereClass = new TextAndSphere();
      const text_and_sphere = await textAndSphereClass.generateTextAndSphere(this.books[current_num], this.font);

      // 縦の円状に配置するための座標を計算
      const theta = (current_num / book_num) * Math.PI * 2; // 角度
      const x = radius * Math.cos(theta); // y座標
      const z = radius * Math.sin(theta); // z座標

      // textObjectの位置を設定
      text_and_sphere.position.setX(x);
      text_and_sphere.position.setZ(z);

      // グループにtextObjectを追加
      this.master_circle_group.add(text_and_sphere);

      // textAndSphereクラスのアニメーションを実行
      textAndSphereClass.animate();
    }
    return radius;
  }

  /**
   * フレーム毎に実行されるアニメーション
   */
  animate = () => {
    this.master_circle_group.rotation.y -= 0.005;
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 球をクリックした時のイベント
   * @param {Object} event イベントオブジェクト
   */
  onClickSphereAndText = (event) => {

    // master_circle_groupに含まれているすべてのオブジェクトを配列として取得する
    const allObjectsArray = this.getAllChildObjects(this.master_circle_group);

    // クリックされた位置からレイを生成
    const vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5).unproject(this.camera);

    // レイとオブジェクトの交差を調べる
    const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

    // 交差したオブジェクトを取得
    const intersects = raycaster.intersectObjects(allObjectsArray);


    if (intersects.length > 0) {
      intersects[0].object.material.transparent = true;
      intersects[0].object.material.opacity = 0.1;
    }
  }

  /**
   * 与えられた Three.js Group 内に含まれる全ての子オブジェクトを配列として取得する関数
   * @param {THREE.Group} group - 全ての子オブジェクトを取得したい Three.js Group
   * @returns {Array} - Three.js Group 内に含まれる全ての子オブジェクトを含む配列
   */
  getAllChildObjects = (group) => {
    const objects = [];
    // グループの直下の子オブジェクトを配列に追加する
    group.children.forEach((child) => {
      objects.push(child);
      // 孫のオブジェクトがある場合は、再帰的に配下の全ての子オブジェクトを配列に追加する
      if (child.children) {
        objects.push(...this.getAllChildObjects(child));
      }
    });
    return objects;
  }
}

export { ViewerMain as default };
