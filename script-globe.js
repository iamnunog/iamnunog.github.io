class SolarSystemScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;

    this.sunGroup = null;
    this.sun = null;

    this.earth = null;
    this.earthOrbitGroup = null;

    this.moon = null;
    this.moonOrbitGroup = null;

    this.satellites = [];
    this.grid = null;

    this.animationPaused = false;
    this.sunRotationSpeed = 0.0005;
    this.earthOrbitSpeed = 0.0002;
    this.moonOrbitSpeed = 0.0006;
    this.satelliteSpeedMultiplier = 1;

    // FPS limiting variables
    this.targetFPS = 120;
    this.frameInterval = 1000 / this.targetFPS;
    this.lastFrameTime = 0;
    this.deltaTime = 0;

    // Performance monitoring
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateInterval = 1000;
    this.lastFPSUpdate = 0;

    // Store zoom level as instance property for consistency
    this.zoomLevel = 10;

    this.config = {
      sunRadius: 8,
      sunPoints: 10000,
      earthRadius: 2,
      earthPoints: 2000,
      earthOrbitRadius: 15,
      moonRadius: 0.5,
      moonPoints: 500,
      moonOrbitRadius: 4,
      gridSize: 40,
      gridDivisions: 50,
      earthTilt: (23.5 * Math.PI) / 180,
      satelliteConfigs: [
        { radius: 12.2, inclination: 85, color: 0x00ff00, speed: 0.00016 },
        { radius: 9.8, inclination: 10, color: 0x00ff00, speed: 0.00026 },
        { radius: 10.3, inclination: 35, color: 0x00ff00, speed: 0.0002 },
        { radius: 11.7, inclination: 50, color: 0x00ff00, speed: 0.00018 },
        { radius: 10.1, inclination: 65, color: 0x00ff00, speed: 0.00022 },
        { radius: 11.9, inclination: 25, color: 0x00ff00, speed: 0.00019 },
        { radius: 9.9, inclination: 5, color: 0x00ff00, speed: 0.00027 },
        { radius: 12.5, inclination: 95, color: 0x00ff00, speed: 0.00014 },
        { radius: 10.6, inclination: 40, color: 0x00ff00, speed: 0.0002 },
        { radius: 11.3, inclination: 70, color: 0x00ff00, speed: 0.00017 },
        { radius: 10, inclination: 0, color: 0x00ff00, speed: 0.0002 },
        { radius: 11, inclination: 45, color: 0x00ff00, speed: 0.00018 },
        { radius: 12, inclination: 90, color: 0x00ff00, speed: 0.00015 },
        { radius: 10.5, inclination: 30, color: 0x00ff00, speed: 0.00022 },
        { radius: 11.5, inclination: 60, color: 0x00ff00, speed: 0.00017 },
        { radius: 9.5, inclination: 15, color: 0x00ff00, speed: 0.00025 },
        { radius: 10.8, inclination: 75, color: 0x00ff00, speed: 0.00019 },
        { radius: 11.2, inclination: 20, color: 0x00ff00, speed: 0.00021 },
      ],
    };

    this.init();
  }

  init() {
    this.setupScene();
    this.createSun();
    this.createEarth();
    this.createMoon();
    this.createSatellites();
    this.setupEventListeners();
    this.setupLighting();
    this.animate(0);
  }

  setupScene() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = this.zoomLevel;

    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );

    // Adjust camera position based on aspect ratio for better framing
    const cameraDistance = 20;
    this.camera.position.set(cameraDistance, cameraDistance, cameraDistance);

    // Look at the center of the scene (where sun is positioned)
    this.camera.lookAt(0, 2, 0); // Sun is at y=2

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance", // Request high-performance GPU
      stencil: false, // Disable stencil buffer if not needed
      depth: true,
      preserveDrawingBuffer: false, // Better performance
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.sortObjects = false; // Disable if not needed for better performance
    this.container.appendChild(this.renderer.domElement);
  }

  createSun() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(this.config.sunPoints * 3);

    for (let i = 0; i < this.config.sunPoints; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const idx = i * 3;
      vertices[idx] = this.config.sunRadius * Math.sin(phi) * Math.cos(theta);
      vertices[idx + 1] =
        this.config.sunRadius * Math.sin(phi) * Math.sin(theta);
      vertices[idx + 2] = this.config.sunRadius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Optimize geometry
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({
      color: 0xffa500, 
      size: 0.2,
      sizeAttenuation: true,
      transparent: false,
    });

    this.sun = new THREE.Points(geometry, material);
    this.sun.position.y = 2;

    // Enable frustum culling
    this.sun.frustumCulled = true;

    this.sunGroup = new THREE.Group();
    this.sunGroup.add(this.sun);
    this.scene.add(this.sunGroup);
  }

  createEarth() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(this.config.earthPoints * 3);

    for (let i = 0; i < this.config.earthPoints; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const idx = i * 3;
      vertices[idx] = this.config.earthRadius * Math.sin(phi) * Math.cos(theta);
      vertices[idx + 1] =
        this.config.earthRadius * Math.sin(phi) * Math.sin(theta);
      vertices[idx + 2] = this.config.earthRadius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Optimize geometry
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({ 
      color: 0x00ff00, 
      size: 0.15,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      transparent: false,
      opacity: 0.9, 
    });

    this.earth = new THREE.Points(geometry, material);
    this.earth.frustumCulled = true;

    // Add Earth's axial tilt
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = this.config.earthTilt;
    earthGroup.add(this.earth);

    this.earthOrbitGroup = new THREE.Group();
    earthGroup.position.set(this.config.earthOrbitRadius, 3, 0);
    this.earthOrbitGroup.add(earthGroup);
    this.scene.add(this.earthOrbitGroup);

    this.createEarthOrbitLine();
  }

  createMoon() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(this.config.moonPoints * 3);

    for (let i = 0; i < this.config.moonPoints; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const idx = i * 3;
      vertices[idx] = this.config.moonRadius * Math.sin(phi) * Math.cos(theta);
      vertices[idx + 1] =
        this.config.moonRadius * Math.sin(phi) * Math.sin(theta);
      vertices[idx + 2] = this.config.moonRadius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({
      color: 0xffffff, // White color
      size: 0.1,
      sizeAttenuation: true,
      // blending: THREE.AdditiveBlending, // Commented out - removes glow
      transparent: false,
      // opacity: 0.9, // Not needed when transparent is false
    });

    this.moon = new THREE.Points(geometry, material);
    this.moon.frustumCulled = true;

    // Create moon orbit group with slight inclination
    this.moonOrbitGroup = new THREE.Group();
    this.moonOrbitGroup.rotation.z = (5 * Math.PI) / 180; // 5-degree inclination
    
    this.moon.position.set(this.config.moonOrbitRadius, 0, 0);
    this.moonOrbitGroup.add(this.moon);
    
    // Add moon orbit to Earth (not to Earth's orbit group)
    this.earthOrbitGroup.children[0].add(this.moonOrbitGroup);

    this.createMoonOrbitLine();
  }

  createEarthOrbitLine() {
    const geometry = new THREE.BufferGeometry();
    const points = new Float32Array(303); // 101 points * 3 coordinates

    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const idx = i * 3;
      points[idx] = this.config.earthOrbitRadius * Math.cos(angle);
      points[idx + 1] = 3;
      points[idx + 2] = this.config.earthOrbitRadius * Math.sin(angle);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));

    // Optimize geometry
    geometry.computeBoundingSphere();

    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00, // Green color for Earth's orbit
      opacity: 0.3,
      transparent: true,
    });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = true;
    this.scene.add(line);
  }

  createMoonOrbitLine() {
    const orbitPoints = 100;
    const points = [];

    for (let i = 0; i <= orbitPoints; i++) {
      const angle = (i / orbitPoints) * Math.PI * 2;
      const x = this.config.moonOrbitRadius * Math.cos(angle);
      const z = this.config.moonOrbitRadius * Math.sin(angle);
      const y = 0;

      points.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff, // White color for Moon's orbit
      opacity: 0.5,
      transparent: true,
      linewidth: 1,
    });

    const orbitLine = new THREE.Line(geometry, material);
    this.moonOrbitGroup.add(orbitLine);
  }

  createSatellites() {
    // Create a single geometry and material to reuse
    const geometry = new THREE.SphereGeometry(0.04, 6, 6);
    geometry.computeBoundingSphere();

    this.config.satelliteConfigs.forEach((cfg, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = cfg.radius;
      mesh.frustumCulled = true;

      const group = new THREE.Group();
      group.add(mesh);
      group.rotation.x = (cfg.inclination * Math.PI) / 180;
      group.rotation.y = (index * 45 * Math.PI) / 180;
      group.position.y = 2;

      this.scene.add(group);
      this.satellites.push({
        group,
        mesh,
        config: cfg,
        angle: Math.random() * Math.PI * 2,
      });
    });
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(10, 10, 10);
    
    // Add point light at sun position for more realistic lighting
    const sunLight = new THREE.PointLight(0xffa500, 2, 100);
    sunLight.position.set(0, 2, 0);
    
    this.scene.add(ambientLight, directionalLight, sunLight);
  }

  animateSatellites(deltaMultiplier) {
    this.satellites.forEach((sat) => {
      sat.angle +=
        sat.config.speed * this.satelliteSpeedMultiplier * deltaMultiplier;
      sat.mesh.position.x = sat.config.radius * Math.cos(sat.angle);
      sat.mesh.position.z = sat.config.radius * Math.sin(sat.angle);
    });
  }

  animate = (currentTime) => {
    requestAnimationFrame(this.animate);

    // Skip rendering if tab is not visible
    if (document.hidden) {
      return;
    }

    // Calculate time since last frame
    this.deltaTime = currentTime - this.lastFrameTime;

    // Only render if enough time has passed for target FPS
    if (this.deltaTime >= this.frameInterval) {
      // Calculate delta multiplier for smooth animation regardless of framerate
      const deltaMultiplier = this.deltaTime / 16.67; // Normalize to 60fps baseline

      if (!this.animationPaused) {
        this.sunGroup.rotation.y += this.sunRotationSpeed * deltaMultiplier;
        this.earthOrbitGroup.rotation.y += this.earthOrbitSpeed * deltaMultiplier;
        this.earthOrbitGroup.children[0].children[0].rotation.y += 0.001 * deltaMultiplier; // Earth rotation
        this.moonOrbitGroup.rotation.y += this.moonOrbitSpeed * deltaMultiplier;
        this.animateSatellites(deltaMultiplier);
      }

      this.renderer.render(this.scene, this.camera);

      // Update FPS counter
      this.frameCount++;
      if (currentTime - this.lastFPSUpdate >= this.fpsUpdateInterval) {
        this.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastFPSUpdate)
        );
        this.frameCount = 0;
        this.lastFPSUpdate = currentTime;
      }
      this.lastFrameTime = currentTime - (this.deltaTime % this.frameInterval);
    }
  };

  updateSatelliteSize(size) {
    this.satellites.forEach((sat) => {
      sat.mesh.scale.set(size, size, size);
    });
  }

  setZoom(zoomLevel) {
    this.zoomLevel = zoomLevel;
    const aspect = window.innerWidth / window.innerHeight;
    const d = this.zoomLevel;

    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
  }

  resetView() {
    const cameraDistance = 20;
    this.camera.position.set(cameraDistance, cameraDistance, cameraDistance);
    this.camera.lookAt(0, 2, 0); // Look at sun center

    this.setZoom(15);

    this.sunRotationSpeed = 0.00005;
    this.earthOrbitSpeed = 0.00002;
    this.satelliteSpeedMultiplier = 1;
    this.updateSatelliteSize(0.5);
  }

  setupEventListeners() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.onWindowResize();
      }, 250);
    });

    document.addEventListener("visibilitychange", () => {
      this.animationPaused = document.hidden;
    });
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = this.zoomLevel;

    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setTargetFPS(fps) {
    this.targetFPS = fps;
    this.frameInterval = 1000 / this.targetFPS;
  }

  getCurrentFPS() {
    return this.fps;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const solarSystem = new SolarSystemScene("globeContainer");
  window.solarSystem = solarSystem;
});
