
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

const AnimatedGlobe = () => {
    const sphereRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.y = t * 0.2; // Rotate continuously
            sphereRef.current.position.y = Math.sin(t * 0.5) * 0.2; // Float up and down
        }
    });

    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.4}>
            <MeshDistortMaterial
                color="#6366f1" 
                attach="material"
                distort={0.4} // Strength of distortion
                speed={1.5} // Speed of distortion
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

const Earth3D = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#d946ef" intensity={0.5} />
                <AnimatedGlobe />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Earth3D;
