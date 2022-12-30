import * as THREE from 'three';
import metaversefile from 'metaversefile';


const {useApp, useFrame, useLoaders, useLocalPlayer} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1'); 
const textureLoader = new THREE.TextureLoader();

const noiseTexture = textureLoader.load(`${baseUrl}textures/Noise28.png`);
noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

export default () => {  
    const app = useApp();
    const localPlayer = app.getComponent('player') || useLocalPlayer();

    const uniforms = {
      uTime: {
        value: 0
      },
      noiseTexture: {
        value: noiseTexture
      }
    };


    (async () => {
      const u = `${baseUrl}./glider2.glb`;
      const glider = await new Promise((accept, reject) => {
          const {gltfLoader} = useLoaders();
          gltfLoader.load(u, accept, function onprogress() {}, reject);
      });
      glider.scene.traverse(o => {
        if (o.isMesh) {
          if (o.name === 'Fabric') {
            const mapTexture = o.material.map;
            o.material = new THREE.MeshStandardMaterial( {map: mapTexture} );
            o.material.onBeforeCompile = shader => {
              shader.uniforms.uTime = uniforms.uTime;
              shader.uniforms.noiseTexture = uniforms.noiseTexture;
              shader.vertexShader = `
                uniform float uTime;
                uniform sampler2D noiseTexture;
              `
              + shader.vertexShader;

              shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>

                  vec4 tempPos = modelMatrix * vec4(transformed, 1.0);
                  float uvScale = 0.1;
                  float speed = 0.1;
                  vec2 texUv = vec2(
                    tempPos.x * uvScale + uTime * speed,
                    tempPos.z * uvScale + uTime * speed
                  );
                  vec4 noise = texture2D(noiseTexture, texUv);
                  float noiseScale = 0.1;
                  transformed.y += noise.r * noiseScale;
                `
              );
              console.log(shader.vertexShader)
            };
          }
          // console.log(o);
        }
      });
      app.add(glider.scene);
    })();
    useFrame(({timestamp}) => {
      uniforms.uTime.value = timestamp / 1000;
      app.updateMatrixWorld();
    });
    return app;
}