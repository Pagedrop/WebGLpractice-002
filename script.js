import * as THREE from "./lib/three.module.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import { GUI } from "./lib/lil-gui.js";

window.addEventListener(
  "DOMContentLoaded",
  () => {
    const app = new App3();

    app.init();

    app.render();
  },
  false
);

class App3 {
  /**
   * カメラ定義の定数
   */
  static get CAMERA_PARAM() {
    return {
      fovy: 40,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 200,
      x: 12.0,
      y: 12.0,
      z: 12.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }

  /**
   * レンダラー定義の定数
   */
  static get RENDERER_PARAM() {
    return {
      clearColor: 0xdfdfdf,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * ディレクショナルライト定義の定数
   */
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xffffff,
      intensity: 1.0,
      x: 1.0,
      y: 1.0,
      z: 1.0,
    };
  }

  /**
   * アンビエントライト定義の定数
   */
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff,
      intensity: 0.4,
    };
  }

  /**
   * マテリアル定義の定数
   */
  static get MATERIAL_PARAM() {
    return {
      color: 0xfc6668,
    };
  }

  /**
   * ボックス定義の定数
   */
  static get BOX_PARAM() {
    return {
      size: 1.0,
      maxCount: 200,
    };
  }

  /**
   * エリア定義の定数
   */
  static get AREA() {
    return {
      size: 40.0,
    };
  }

  /**
   * コンストラクタ
   * @constructor
   */
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.gui;
    this.directionalLight;
    this.ambientLight;
    this.material;
    this.boxGeometry;
    this.box;
    this.boxArray;
    this.controls;
    this.axesHelper;
    this.directionalLightHelper;

    this.isDown = false;

    // 再帰呼び出しの為のthis固定
    this.render = this.render.bind(this);

    /**
     * イベント
     */

    // キーイベント
    window.addEventListener(
      "keydown",
      (keyEvent) => {
        switch (keyEvent.key) {
          case " ":
            this.isDown = true;
            break;
          default:
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (keyEvent) => {
        switch (keyEvent.key) {
          case " ":
            this.isDown = false;
            break;
          default:
        }
      },
      false
    );

    // リサイズイベント
    window.addEventListener(
      "resize",
      () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      },
      false
    );
  }

  /**
   * 初期化処理
   */
  init() {
    //レンダラー
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(App3.RENDERER_PARAM.clearColor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      App3.RENDERER_PARAM.width,
      App3.RENDERER_PARAM.height
    );
    this.renderer.shadowMap.enabled = true;
    const wrapper = document.querySelector("#webgl");
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far
    );
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z
    );
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

    // ディレクショナルライト
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z
    );
    this.scene.add(this.directionalLight);

    // アンビエントライト
    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity
    );
    this.scene.add(this.ambientLight);

    // ジオメトリ
    this.boxGeometry = new THREE.BoxGeometry(
      App3.BOX_PARAM.size,
      App3.BOX_PARAM.size,
      App3.BOX_PARAM.size
    );
    this.material = new THREE.MeshPhongMaterial({
      color: App3.MATERIAL_PARAM.color,
    });
    for (let i = 0; i < App3.BOX_PARAM.maxCount; i++) {
      // const rotateBox = this.
      // getrotatebox
    }

    // メッシュ
    this.box = new THREE.Mesh(this.boxGeometry, this.material);
    this.scene.add(this.box);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;

    // ヘルパー
    // axesHelper
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // DirectionalLightHelper
    const directionalLightHelperSize = 1;
    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      directionalLightHelperSize
    );
    this.scene.add(this.directionalLightHelper);

    // GUIデバッグ
    this.gui = new GUI();
    const lightGUIGroupe = this.gui.addFolder("Light");
    lightGUIGroupe
      .add(this.directionalLight, "visible")
      .name("DirectionalLight");
    lightGUIGroupe.add(this.ambientLight, "visible").name("AmbientLight");
    const helperGUIGroupe = this.gui.addFolder("Helper");
    helperGUIGroupe.add(this.axesHelper, "visible").name("AxesHelper");
    helperGUIGroupe
      .add(this.directionalLightHelper, "visible")
      .name("DirectionalLightHelper");
  }

  /**
   * 描画処理
   */
  render() {
    requestAnimationFrame(this.render);

    if (this.isDown === true) {
      this.box.rotation.y += 0.02;
    }

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}
