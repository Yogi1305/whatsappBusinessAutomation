import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SmokeEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Colorful wave geometries
    const waveCount = 50;
    const waves = [];

    // Vibrant color palette
    const colors = [
      0xFF6B6B,   // Pastel Red
      0x4ECDC4,   // Teal
      0x45B7D1,   // Sky Blue
      0xFFA07A,   // Light Salmon
      0x98D8AA,   // Mint Green
      0xFFC300,   // Bright Yellow
      0xFF5733,   // Vibrant Orange
      0x6A5ACD,   // Slate Blue
      0xFF1493,   // Deep Pink
      0x00CED1    // Dark Turquoise
    ];

    // Create wave meshes
    for (let i = 0; i < waveCount; i++) {
      const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
      
      // Customize vertex positions to create wave effect
      const positionAttribute = geometry.getAttribute('position');
      for (let j = 0; j < positionAttribute.count; j++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, j);
        
        // Create wave-like distortion
        const waveX = Math.sin(vertex.x * 0.5 + i * 0.5) * 0.5;
        const waveY = Math.cos(vertex.y * 0.5 + i * 0.5) * 0.5;
        
        vertex.z = waveX + waveY;
        
        positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();

      // Create material with dynamic color
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });

      const wave = new THREE.Mesh(geometry, material);
      
      // Position waves in a spiral
      const angle = i * 0.5;
      const radius = i * 0.2;
      wave.position.x = Math.cos(angle) * radius;
      wave.position.y = Math.sin(angle) * radius;
      wave.position.z = -i * 0.1;
      
      // Rotate waves for depth
      wave.rotation.x = Math.random() * Math.PI;
      wave.rotation.y = Math.random() * Math.PI;
      
      scene.add(wave);
      waves.push(wave);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event) => {
      // Normalize mouse coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Subtle camera movement
      camera.position.x = mouse.x * 0.5;
      camera.position.y = mouse.y * 0.5;
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate waves
      waves.forEach((wave, index) => {
        // Pulsing and rotation effect
        wave.rotation.z += 0.005;
        wave.scale.x = 1 + Math.sin(Date.now() * 0.001 + index) * 0.05;
        wave.scale.y = 1 + Math.cos(Date.now() * 0.001 + index) * 0.05;
      });

      // Render scene
      renderer.render(scene, camera);
    };

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      waves.forEach(wave => {
        scene.remove(wave);
        wave.geometry.dispose();
        wave.material.dispose();
      });
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1, 
        pointerEvents: 'none',
        overflow: 'hidden'
      }} 
    />
  );
};

export default SmokeEffect;