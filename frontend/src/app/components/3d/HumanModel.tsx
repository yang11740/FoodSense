
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model() {
  // 加载glb模型
  const { scene } = useGLTF('/src/app/components/3d/realistic_human_base.glb');

  // 可以在这里对加载的模型进行调整，例如缩放、旋转、材质等
  scene.scale.set(1.5, 1.5, 1.5); // 根据需要调整模型大小
  scene.position.set(0, -1.5, 0); // 根据需要调整模型位置

  return <primitive object={scene} />;
}

// 预加载模型
useGLTF.preload('/src/app/components/3d/realistic_human_base.glb')

export default function HumanModel() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 50 }}
      style={{
        background: 'linear-gradient(to bottom right, #e0f7fa, #e8f5e9, #e0f7fa)',
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} />

      <Model />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}
