import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MarchingCubes, MarchingCube, Environment, Sky, Bounds } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, RigidBodyApi } from "@react-three/rapier";
import { Shader } from "../shader";

import { ResizeObserver } from "@juggle/resize-observer";

const vec = new THREE.Vector3();

function MetaBall({ ...props }: { position: [number, number, number] }) {
  const api = useRef<RigidBodyApi>(null);
  useFrame((_, delta) => {
    api.current?.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiplyScalar(delta * -0.05)
    );
  });
  return (
    <RigidBody
      ref={api}
      colliders={false}
      linearDamping={4}
      angularDamping={0.95}
      type="dynamic"
      {...props}
    >
      <MarchingCube strength={0.35} subtract={6} />
      <BallCollider args={[0.1]} />
    </RigidBody>
  );
}

export default function Scene() {

  // https://github.com/react-spring/react-use-measure/#resize-observer-polyfills
  // useMemo(() => {
  //   if(window) {
  //     window.ResizeObserver = ResizeObserver;
  //   }
  // }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 30 }} gl={{ alpha: true }}>
      <Physics gravity={[0, 0, 0]}>
        <MarchingCubes resolution={64} maxPolyCount={20000} enableUvs={false} enableColors={true}>
          <shaderMaterial attach="material" {...Shader} />
          <MetaBall position={[1, 1, 0.5]} />
          <MetaBall position={[-1, -1, -0.5]} />
          <MetaBall position={[0.5, 0.5, 0.5]} />
          <MetaBall position={[-0.5, -0.5, -0.5]} />
          <MetaBall position={[0.6, 0.6, 0.5]} />
          <MetaBall position={[-0.6, -0.3, -0.5]} />
          <Pointer />
        </MarchingCubes>
      </Physics>
      {/* Zoom to fit a 1/1/1 box to match the marching cubes */}
      <Bounds fit clip observe margin={1}>
        <mesh visible={false}>
          <boxGeometry />
        </mesh>
      </Bounds>
    </Canvas>
  );
}

function Pointer() {
  const [hover, setHover] = useState(true);
  const ref = useRef<RigidBodyApi>(null);

  const { gl } = useThree();

  useEffect(() => {
    gl.domElement.addEventListener("pointermove", () => setHover(true));
    gl.domElement.addEventListener("pointerleave", () => setHover(false));
  }, []);

  useFrame(({ mouse, viewport }, delta) => {
    if (!ref.current) return;

    const { width, height } = viewport.getCurrentViewport();
    vec.copy(ref.current.translation());
    const speed = 400 * delta;

    if (hover) {
      ref.current?.setLinvel(
        new THREE.Vector3(
          (mouse.x * (width / 2) - vec.x) * speed,
          (mouse.y * (height / 2) - vec.y) * speed,
          vec.z * -0.5
        )
      );
      return;
    }

    ref.current.applyImpulse(
      vec
        .copy(ref.current.translation())
        .normalize()
        .multiplyScalar(delta * -0.05)
    );
  });

  return (
    <RigidBody
      type="dynamic"
      // colliders={false}
      ref={ref}
      linearDamping={4}
      angularDamping={0.95}
      position={[0, 0, 0]}
    >
      <MarchingCube strength={0.35} subtract={6} />
      <BallCollider args={[0.1]} />
    </RigidBody>
  );
}
