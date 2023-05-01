"use strict";

import TextAndSphere from "./TextAndSphere.js";
import WireframeSphere from "./WireframeSphere.js";
import Particle from "./Particle.js";
import Camera from "./Camera.js";
import TweenAnimation from "./TweenAnimation.js";
import ContentTextObject from "./ContentTextObject.js"

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
    // const center_axes = new THREE.AxesHelper(100);
    // this.scene.add(center_axes);

    // 球体全体を統括するグループをシーンに追加
    this.master_circle_group = new THREE.Group();
    this.scene.add(this.master_circle_group);

    // テキストと球体のモデル群を作成し、円の半径を返却する
    const radius = await this.generateTextAndSphereGroup();

    // パーティクルを作成する
    const particle = await new Particle().generateParticle();
    this.scene.add(particle);

    // カメラを作成
    const cameraInst = new Camera();
    this.camera = await cameraInst.generateCamera(radius);

    // カメラ制御を追加
    const orbit = await cameraInst.generateOrbitControls(this.camera, this.renderer.domElement);

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

    // 球体同士の間隔から半径を求める
    const radius = await this.getRadius();

    for (let current_num = 0; current_num < this.books.length; current_num++) {

      //環状テキストメッシュとワイヤーフレームの球体のグループを作成しシーンに追加
      const textAndSphereClass = new TextAndSphere();
      const text_and_sphere = await textAndSphereClass.generateTextAndSphere(this.books[current_num], this.font);

      // 縦の円状に配置するための座標を計算
      const theta = (current_num / this.books.length) * Math.PI * 2; // 角度
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

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
   * 環の半径を取得する
   * @returns radius
   */
  getRadius = async () => {
    const distance = new WireframeSphere().radius * 10; // 球体同士の間隔
    /** @type {number} radius 円の半径 */
    const radius = distance * (this.books.length / (2 * Math.PI));
    return radius
  }

  /**
   * フレーム毎に実行されるアニメーション
   */
  animate = () => {
    this.master_circle_group.rotation.y -= 0.005;
    requestAnimationFrame(this.animate);
    TWEEN.update(); // アニメーション内で呼び出さないと起動しない。
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 球をクリックした時のイベント
   * @param {Object} event イベントオブジェクト
   */
  onClickSphereAndText = async (event) => {

    // master_circle_groupに含まれているすべてのオブジェクトを配列として取得する
    const allObjectsArray = this.getAllChildObjects(this.master_circle_group);

    // クリックされた位置からレイを生成
    const vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5).unproject(this.camera);

    // レイとオブジェクトの交差を調べる
    const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

    // 交差したオブジェクトを取得
    const intersects = raycaster.intersectObjects(allObjectsArray);

    if (intersects.length > 0) {
      // クリックした一番手前のオブジェクトがintersects[0]となる
      const getting_id = intersects[0].object.book_id;
      // クリックした球のbook_idと同じbook_idを持つオブジェクトを取得する
      const book_obj = this.books.find(book => book.book_id === getting_id);

      // TweenAnimationオブジェクトを作成
      const tween_animation = new TweenAnimation(this.camera);
      // TweenAnimationを実行
      tween_animation.startTween();

      // 関数実行開始時間を取得（ログ）
      const startTime = performance.now();

      // TweenAnimationの完了を待ってから、テキストグループを作成する
      setTimeout(async () => {
        // textObjectインスタンスを作成
        const textObject = new ContentTextObject();

        // テキストグループを作成
        const text_group = await textObject.generateText(this.font, book_obj.contents);

        // 関数実行修正時間を取得（ログ）
        const endTime = performance.now();

        // テキスト作成時間をログに出力
        console.log(`textCreateTime: ${endTime - startTime - (tween_animation.tween_first_duration + tween_animation.tween_second_duration)} ms`);

        // シーンにテキストグループを追加
        this.scene.add(text_group);

        // アニメーションを起動
        textObject.animate();

        // returnアイコンを取得
        const turn_buck_icon = document.getElementById("turn_buck_icon");

        // returnアイコンを表示する
        turn_buck_icon.style.display = "block";

        // returnアイコンをクリックした時の処理
        turn_buck_icon.addEventListener("click", async () => {
          // returnアイコンを消す
          turn_buck_icon.style.display = "none";

          // tweenで元の視覚に戻る
          await tween_animation.returnTween(
            await this.getRadius()
          );

          // アニメーションのタイミングに合わせてtext_groupを消す
          setTimeout(async () => { this.scene.remove(text_group) }, tween_animation.return_first_duration);
        });

      }, tween_animation.tween_first_duration + tween_animation.tween_second_duration);

    }
  }

  /**
   * 全ての子オブジェクトを配列として取得する
   * @param {THREE.Group} group 全ての子オブジェクトを取得したい Three.js Group
   * @returns {Array} THREE.Group内に含まれる全ての子オブジェクトを含む配列
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
