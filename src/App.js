import { Suspense, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Mask,
  useMask,
  Float,
  OrbitControls,
  MeshDistortMaterial,
} from "@react-three/drei";
import { ARButton, XR, Interactive } from "@react-three/xr";

const images = [
  "cyberpunk.jpg",
  "fantasy.jpg",
  "tech.jpg"
];

function MaskedContent({ invert, image, maskId }) {
  const stencil = useMask(maskId, invert);
  const texture = useLoader(THREE.TextureLoader, image);
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} {...stencil} />
    </mesh>
  );
}

function Portal({ position, image, maskId }) {
  const [invert, setInvert] = useState(false);
  const [colorWrite, setColorWrite] = useState(true);
  const depthWrite = false;

  const onSelect = () => {
    setInvert(!invert);
    setColorWrite(!colorWrite);
  };

  return (
    <Interactive onSelect={onSelect}>
      <Float floatIntensity={3} rotationIntensity={1} speed={5} position={position}>
        <Mask id={maskId} colorWrite={colorWrite} depthWrite={depthWrite}>
          {(spread) => (
            <>
              <planeGeometry args={[1, 3, 128, 128]} />
              <MeshDistortMaterial distort={0.5} radius={1} speed={10} {...spread} />
            </>
          )}
        </Mask>
      </Float>
      <MaskedContent invert={invert} image={image} maskId={maskId} />
    </Interactive>
  );
}

export function App() {
  return (
    <>
      <ARButton />
      <Canvas camera={{ position: [0, 0, 5] }}>
        <XR>
          <hemisphereLight intensity={1} groundColor="red" />
          <Suspense fallback={null}>
            <Portal position={[-3, 1, -2]} image={images[0]} maskId={1} />
            <Portal position={[0, 1, -2]} image={images[1]} maskId={2} />
            <Portal position={[3, 1, -2]} image={images[2]} maskId={3} />
            <OrbitControls makeDefault />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}
