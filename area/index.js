import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp} = metaversefile;

//

const localVector = new THREE.Vector3();
const localMatrix = new THREE.Matrix4();

//

const _makePlaneGeometry = (width, height) => {
  return new THREE.PlaneBufferGeometry(width, height)
    .applyMatrix4(localMatrix.makeTranslation(0, height/2, 0));
};
const _makeAreaMesh = (width, height, depth) => {
  const geometries = [
    _makePlaneGeometry(width, height)
      .applyMatrix4(localMatrix.makeTranslation(0, 0, depth/2)),
    _makePlaneGeometry(depth, height)
      .applyMatrix4(localMatrix.makeTranslation(0, 0, width/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI/2)),
    _makePlaneGeometry(width, height)
      .applyMatrix4(localMatrix.makeTranslation(0, 0, depth/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI)),
    _makePlaneGeometry(depth, height)
      .applyMatrix4(localMatrix.makeTranslation(0, 0, width/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI*3/2)),

    _makePlaneGeometry(width, height)
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(1, 0, 0), Math.PI/4))
      .applyMatrix4(localMatrix.makeTranslation(0, 0, depth/2)),
    _makePlaneGeometry(depth, height)
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(1, 0, 0), Math.PI/4))
      .applyMatrix4(localMatrix.makeTranslation(0, 0, width/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI/2)),
    _makePlaneGeometry(width, height)
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(1, 0, 0), Math.PI/4))
      .applyMatrix4(localMatrix.makeTranslation(0, 0, depth/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI)),
    _makePlaneGeometry(depth, height)
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(1, 0, 0), Math.PI/4))
      .applyMatrix4(localMatrix.makeTranslation(0, 0, width/2))
      .applyMatrix4(localMatrix.makeRotationAxis(localVector.set(0, 1, 0), Math.PI*3/2)),
  ];
  const material = new THREE.MeshNormalMaterial({
    side: THRE,
    opacity: 0.5,
};

export default () => {
  const app = useApp();

  app.name = 'area';

  const sizeArray = app.getComponent('size') ?? [4, 2, 4];
  const [width, height, depth] = sizeArray;

  const mesh = _makeAreaMesh(width, height, depth);
  app.add(mesh);
  mesh.updateMatrixWorld();

  /* useFrame(({timestamp, timeDiff}) => {
    // XXX
  }); */

  return app;
};