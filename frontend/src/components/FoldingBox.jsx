/**
 * FoldingBox.jsx
 * Faithful port of the Threejs-folding-cardboard-box-tutorial by ksenia-k.
 * Adapted for React + Three.js v0.186 (mergeGeometries API).
 *
 * Features:
 *  - Faithful corrugated flute + folding geometry with 3-ply sandwich
 *  - Bold, prominent AL LULU PACKAGING branding on both sides with high contrast
 *  - Top adhesive security tape that seals the box when closed (progress > 0.85)
 *  - Smooth 60fps lerping synchronized with external scroll progress
 *  - Safe fallback for WebGL-restricted environments
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";

// ─── WebGL support check ───────────────────────────────────────────────────
function isWebGLAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch (_) {
    return false;
  }
}

// ─── 2-D SVG fallback (shown only when WebGL cannot start) ─────────────────
function BoxSVGFallback({ progress, className }) {
  const stage = progress < 0.25 ? 0 : progress < 0.55 ? 1 : progress < 0.88 ? 2 : 3;
  const titles = ["Flat Die-Cut Blank", "Walls Rising 90°", "Base Flaps Interlocked", "Sealed & Ready"];
  const wallH = Math.min(1, progress * 3) * 50;
  const flapBot = Math.min(1, Math.max(0, (progress - 0.35) / 0.25)) * 50;
  const flapTop = Math.min(1, Math.max(0, (progress - 0.6) / 0.35)) * 50;

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-4 select-none ${className}`}
      data-testid="folding-box-fallback"
    >
      <div className="w-full max-w-md rounded-2xl border border-bone/15 bg-charcoal/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between border-b border-bone/10 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-tape">
            Schematic · Stage {stage + 1} / 4
          </span>
          <span className="font-mono text-[10px] text-bone/50">{Math.round(progress * 100)}%</span>
        </div>

        <div className="flex justify-center py-4">
          <svg viewBox="0 0 240 180" className="h-44 w-72" fill="none">
            <polygon points="60,140 120,160 180,140 120,120" fill="#c39d6e30" stroke="#c39d6e" strokeWidth="1.5" />
            <polygon points={`60,${140 - wallH} 60,140 120,160 120,${160 - wallH}`} fill="#c39d6e40" stroke="#c39d6e" strokeWidth="1.5" />
            <polygon points={`120,${160 - wallH} 120,160 180,140 180,${140 - wallH}`} fill="#c39d6e55" stroke="#c39d6e" strokeWidth="1.5" />
            <polygon points={`60,${140 - wallH} 120,${120 - wallH} 180,${140 - wallH} 120,${160 - wallH}`} fill="#c39d6e20" stroke="#c39d6e" strokeWidth="1.5" />
            {flapBot > 0 && (
              <>
                <polygon points={`75,${160 - flapBot} 75,160 110,160 110,${160 - flapBot}`} fill="#b8936a60" stroke="#b8936a" strokeWidth="1" strokeDasharray="3 2" />
                <polygon points={`130,${160 - flapBot} 130,160 165,160 165,${160 - flapBot}`} fill="#b8936a60" stroke="#b8936a" strokeWidth="1" strokeDasharray="3 2" />
              </>
            )}
            {flapTop > 0 && (
              <>
                <polygon points={`75,${160 - wallH} 75,${160 - wallH - flapTop} 110,${160 - wallH - flapTop} 110,${160 - wallH}`} fill="#c39d6e50" stroke="#c39d6e" strokeWidth="1.5" />
                <polygon points={`130,${160 - wallH} 130,${160 - wallH - flapTop} 165,${160 - wallH - flapTop} 165,${160 - wallH}`} fill="#c39d6e50" stroke="#c39d6e" strokeWidth="1.5" />
              </>
            )}
            {flapTop > 40 && (
              <line x1="75" y1={160 - wallH} x2="165" y2={160 - wallH} stroke="#f6c445" strokeWidth="4" />
            )}
            {wallH > 20 && (
              <text x="120" y={160 - wallH / 2 + 5} fill="#ebd5b3" fontSize="8" fontFamily="monospace" textAnchor="middle">
                AL LULU PACKAGING
              </text>
            )}
          </svg>
        </div>

        <p className="text-center font-display text-sm font-bold text-bone">{titles[stage]}</p>
        <p className="mt-1 text-center font-mono text-[10px] text-bone/50">
          760 × 270 × 440 mm • 3-Ply Corrugated RSC
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function FoldingBox({
  progress = 0,
  autoRotate = false,
  zoomLevel = 1,
  className = "",
}) {
  const mountRef = useRef(null);
  const [webglError, setWebglError] = useState(null);
  const sceneStateRef = useRef(null);

  // ── Mount scene ──────────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setWebglError("no-webgl");
      return;
    }

    let teardown = () => {};
    try {
      teardown = buildScene(container, sceneStateRef, setWebglError);
    } catch (err) {
      console.error("[FoldingBox] scene init failed:", err);
      setWebglError(String(err));
    }
    return () => {
      try {
        teardown();
      } catch (_) {}
    };
  }, []);

  // ── Sync progress ────────────────────────────────────────────────────────
  useEffect(() => {
    const s = sceneStateRef.current;
    if (s) {
      s.targetProgress = Math.max(0, Math.min(1, progress));
    }
  }, [progress]);

  // ── Sync autoRotate ──────────────────────────────────────────────────────
  useEffect(() => {
    const s = sceneStateRef.current;
    if (s && s.orbit) s.orbit.autoRotate = autoRotate;
  }, [autoRotate]);

  // ── Sync zoom ────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = sceneStateRef.current;
    if (s && s.camera) {
      gsap.to(s.camera, {
        duration: 0.25,
        zoom: zoomLevel,
        onUpdate: () => s.camera.updateProjectionMatrix(),
      });
    }
  }, [zoomLevel]);

  if (webglError) {
    return <BoxSVGFallback progress={progress} className={className} />;
  }

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full cursor-grab select-none active:cursor-grabbing ${className}`}
      data-testid="threejs-folding-box-canvas"
    />
  );
}

// ─── Three.js Scene Builder ────────────────────────────────────────────────
function buildScene(container, sceneStateRef, setWebglError) {
  // ── Box params (matches tutorial for realistic RSC proportions) ──────────
  const params = {
    width: 28,
    length: 78,
    depth: 44,
    thickness: 0.6,
    fluteFreq: 5,
    flapGap: 0.9,
    stampSize: [32, 14],
  };

  // ── Animated angles state (GSAP tweens these) ────────────────────────────
  const animated = {
    openingAngle: 0.02 * Math.PI,
    flapAngles: {
      backHalf: {
        width: { top: 0, bottom: 0 },
        length: { top: 0, bottom: 0 },
      },
      frontHalf: {
        width: { top: 0, bottom: 0 },
        length: { top: 0, bottom: 0 },
      },
    },
  };

  // ── Panel mesh hierarchy (mirrors tutorial) ──────────────────────────────
  const els = {
    group: new THREE.Group(),
    backHalf: {
      width: { top: new THREE.Mesh(), side: new THREE.Mesh(), bottom: new THREE.Mesh() },
      length: { top: new THREE.Mesh(), side: new THREE.Mesh(), bottom: new THREE.Mesh() },
    },
    frontHalf: {
      width: { top: new THREE.Mesh(), side: new THREE.Mesh(), bottom: new THREE.Mesh() },
      length: { top: new THREE.Mesh(), side: new THREE.Mesh(), bottom: new THREE.Mesh() },
    },
  };

  // ── Renderer ─────────────────────────────────────────────────────────────
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });
  } catch (err) {
    setWebglError(String(err));
    return () => {};
  }

  const W = container.clientWidth || 800;
  const H = container.clientHeight || 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const onContextLost = (e) => {
    e.preventDefault();
    setWebglError("context-lost");
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);

  // ── Scene & Camera ───────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 10, 1000);
  camera.position.set(48, 82, 118);

  // ── Lighting ─────────────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.7);
  scene.add(ambientLight);

  const lightHolder = new THREE.Group();
  const topLight = new THREE.PointLight(0xfff0da, 0.7);
  topLight.position.set(-25, 280, 20);
  lightHolder.add(topLight);

  const sideLight = new THREE.PointLight(0xffeedd, 0.85);
  sideLight.position.set(60, 20, 160);
  lightHolder.add(sideLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(-80, 40, -60);
  lightHolder.add(fillLight);

  scene.add(lightHolder);

  // ── Authentic UAE Kraft Cardboard Material ───────────────────────────────
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xbba078),
    roughness: 0.82,
    metalness: 0.03,
    side: THREE.DoubleSide,
  });

  // ── OrbitControls ────────────────────────────────────────────────────────
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = false;
  orbit.enablePan = false;
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.06;
  orbit.autoRotate = false;
  orbit.autoRotateSpeed = 0.3;

  // ── Geometry Generators (3-Ply Corrugation) ──────────────────────────────
  function createSideGeometry(baseGeometry, size, folds, hasMiddleLayer) {
    const geometriesToMerge = [];

    function getLayerGeometry(offset) {
      const layerGeometry = baseGeometry.clone();
      const positionAttr = layerGeometry.attributes.position;
      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i);
        const y = positionAttr.getY(i);
        let z = positionAttr.getZ(i) + offset(x);
        z = applyFolds(x, y, z);
        positionAttr.setXYZ(i, x, y, z);
      }
      positionAttr.needsUpdate = true;
      return layerGeometry;
    }

    function applyFolds(x, y, z) {
      const modifier = (c, s) => 1.0 - Math.pow(c / (0.5 * s), 10.0);
      if ((x > 0 && folds[1]) || (x < 0 && folds[3])) z *= modifier(x, size[0]);
      if ((y > 0 && folds[0]) || (y < 0 && folds[2])) z *= modifier(y, size[1]);
      return z;
    }

    geometriesToMerge.push(
      getLayerGeometry((v) => -0.5 * params.thickness + 0.01 * Math.sin(params.fluteFreq * v))
    );
    geometriesToMerge.push(
      getLayerGeometry((v) => 0.5 * params.thickness + 0.01 * Math.sin(params.fluteFreq * v))
    );
    if (hasMiddleLayer) {
      geometriesToMerge.push(
        getLayerGeometry((v) => 0.5 * params.thickness * Math.sin(params.fluteFreq * v))
      );
    }

    const merged = mergeGeometries(geometriesToMerge, false);
    if (!merged) return baseGeometry.clone();
    merged.computeVertexNormals();
    return merged;
  }

  function setGeometryHierarchy() {
    els.group.add(
      els.frontHalf.width.side,
      els.frontHalf.length.side,
      els.backHalf.width.side,
      els.backHalf.length.side
    );
    els.frontHalf.width.side.add(els.frontHalf.width.top, els.frontHalf.width.bottom);
    els.frontHalf.length.side.add(els.frontHalf.length.top, els.frontHalf.length.bottom);
    els.backHalf.width.side.add(els.backHalf.width.top, els.backHalf.width.bottom);
    els.backHalf.length.side.add(els.backHalf.length.top, els.backHalf.length.bottom);
  }

  function createBoxElements() {
    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const half = halfIdx ? "frontHalf" : "backHalf";
        const side = sideIdx ? "width" : "length";

        const sideWidth = side === "width" ? params.width : params.length;
        const flapWidth = sideWidth - 2 * params.flapGap;
        const flapHeight = 0.5 * params.width - 0.75 * params.flapGap;

        const sidePlaneGeometry = new THREE.PlaneGeometry(
          sideWidth,
          params.depth,
          Math.floor(5 * sideWidth),
          Math.floor(0.2 * params.depth)
        );
        const flapPlaneGeometry = new THREE.PlaneGeometry(
          flapWidth,
          flapHeight,
          Math.floor(5 * flapWidth),
          Math.max(1, Math.floor(0.2 * flapHeight))
        );

        const sideGeometry = createSideGeometry(
          sidePlaneGeometry,
          [sideWidth, params.depth],
          [true, true, true, true],
          false
        );
        const topGeometry = createSideGeometry(
          flapPlaneGeometry,
          [flapWidth, flapHeight],
          [false, false, true, false],
          true
        );
        const bottomGeometry = createSideGeometry(
          flapPlaneGeometry,
          [flapWidth, flapHeight],
          [true, false, false, false],
          true
        );

        topGeometry.translate(0, 0.5 * flapHeight, 0);
        bottomGeometry.translate(0, -0.5 * flapHeight, 0);

        els[half][side].top.geometry = topGeometry;
        els[half][side].side.geometry = sideGeometry;
        els[half][side].bottom.geometry = bottomGeometry;

        els[half][side].top.material = material;
        els[half][side].side.material = material;
        els[half][side].bottom.material = material;

        els[half][side].top.position.y = 0.5 * params.depth;
        els[half][side].bottom.position.y = -0.5 * params.depth;
      }
    }
    updatePanelsTransform();
  }

  // ── Al Lulu Packaging High-Contrast Branding Stamp (1024×480) ────────────
  const STAMP_W = 1024;
  const STAMP_H = 480;

  function createStampCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = STAMP_W;
    canvas.height = STAMP_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Crisp card base
    ctx.fillStyle = "#faf5ea";
    ctx.fillRect(0, 0, STAMP_W, STAMP_H);

    // Thick industrial dark outline
    ctx.strokeStyle = "#1b140b";
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, STAMP_W - 12, STAMP_H - 12);

    // Top Header Banner (Deep rich charcoal)
    ctx.fillStyle = "#151009";
    ctx.fillRect(6, 6, STAMP_W - 12, 175);

    // Gold/Amber dividing accent line
    ctx.fillStyle = "#d49a2a";
    ctx.fillRect(6, 181, STAMP_W - 12, 10);

    // Tagline in amber inside header
    ctx.fillStyle = "#e0ad3d";
    ctx.font = "bold 28px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SHARJAH, U.A.E.  •  EST. 2013", 40, 58);

    // High-visibility Company Name (large, bold, sharp)
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 78px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText("AL LULU PACKAGING", 40, 142);

    // Subtitle badge on the right of header
    ctx.fillStyle = "#d49a2a";
    ctx.fillRect(STAMP_W - 220, 28, 180, 40);
    ctx.fillStyle = "#151009";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GRADE A • 3-PLY", STAMP_W - 130, 55);

    // Body content: Industrial shipping markings
    ctx.fillStyle = "#1b140b";
    ctx.textAlign = "left";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("↑↑  THIS SIDE UP  /  HANDLE WITH CARE", 40, 260);

    ctx.font = "bold 28px monospace";
    ctx.fillStyle = "#3d2b18";
    ctx.fillText("SPEC: RSC CORRUGATED CONTAINER • HEAVY DUTY", 40, 315);

    // Barcode lines
    ctx.fillStyle = "#1b140b";
    let bx = 40;
    const bws = [4,3,8,3,6,4,10,3,5,7,3,9,4,3,8,5,3,6,10,4,7,3,5,10,4,6,3,8,5,7];
    for (const bw of bws) {
      ctx.fillRect(bx, 350, bw, 55);
      bx += bw + 5;
    }

    ctx.font = "22px monospace";
    ctx.fillText("BATCH: ALP-SHJ-2026", 40, 440);
    ctx.fillText("MAX GROSS WT: 45 KG", 420, 440);

    // Stamp emblem circle on bottom right
    ctx.strokeStyle = "#b58228";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(STAMP_W - 100, 350, 65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#b58228";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("QUALITY", STAMP_W - 100, 335);
    ctx.fillText("PASSED", STAMP_W - 100, 355);
    ctx.fillText("SHARJAH", STAMP_W - 100, 375);

    return canvas;
  }

  // Create Front & Back Stamp Meshes
  let frontStamp = null;
  let backStamp = null;
  const stampCanvas = createStampCanvas();
  if (stampCanvas) {
    const stampTexture = new THREE.CanvasTexture(stampCanvas);
    stampTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const stampGeom = new THREE.PlaneGeometry(
      params.length * 0.72,
      params.depth * 0.65
    );
    const stampMat = new THREE.MeshBasicMaterial({
      map: stampTexture,
      transparent: false,
      depthWrite: true,
    });

    frontStamp = new THREE.Mesh(stampGeom, stampMat);
    scene.add(frontStamp);

    const backStampMat = new THREE.MeshBasicMaterial({
      map: stampTexture,
      transparent: false,
      depthWrite: true,
    });
    backStamp = new THREE.Mesh(stampGeom, backStampMat);
    backStamp.rotation.y = Math.PI;
    scene.add(backStamp);
  }

  // ── Top Sealing Tape Mesh (appears when closed) ───────────────────────────
  let tapeMesh = null;
  const tapeCanvas = document.createElement("canvas");
  tapeCanvas.width = 512;
  tapeCanvas.height = 64;
  const tCtx = tapeCanvas.getContext("2d");
  if (tCtx) {
    // Amber kraft tape texture
    tCtx.fillStyle = "#cfa058";
    tCtx.fillRect(0, 0, 512, 64);
    // Darker borders
    tCtx.fillStyle = "#b5853f";
    tCtx.fillRect(0, 0, 512, 3);
    tCtx.fillRect(0, 61, 512, 3);
    // Security text
    tCtx.fillStyle = "#2c1c0a";
    tCtx.font = "bold 18px monospace";
    tCtx.textAlign = "center";
    tCtx.fillText("🔒 AL LULU PACKAGING • SEALED & SECURED •", 256, 38);

    const tapeTexture = new THREE.CanvasTexture(tapeCanvas);
    tapeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tapeTexture.wrapS = THREE.RepeatWrapping;
    tapeTexture.repeat.set(2, 1);

    const tapeGeom = new THREE.PlaneGeometry(params.length * 0.95, 7.5);
    const tapeMat = new THREE.MeshStandardMaterial({
      map: tapeTexture,
      transparent: true,
      opacity: 0,
      roughness: 0.5,
    });
    tapeMesh = new THREE.Mesh(tapeGeom, tapeMat);
    tapeMesh.rotation.x = -Math.PI * 0.5;
    tapeMesh.position.y = 0.5 * params.depth + params.thickness + 0.2;
    scene.add(tapeMesh);
  }

  // ── Transform logic ──────────────────────────────────────────────────────
  function updatePanelsTransform() {
    // Place width-sides at ends of length-sides
    els.frontHalf.width.side.position.x = 0.5 * params.length;
    els.backHalf.width.side.position.x = -0.5 * params.length;

    // Rotate width-sides 0 → 90 deg
    els.frontHalf.width.side.rotation.y = animated.openingAngle;
    els.backHalf.width.side.rotation.y = animated.openingAngle;

    // Move length-sides to keep box centered
    const cos = Math.cos(animated.openingAngle);
    els.frontHalf.length.side.position.x = -0.5 * cos * params.width;
    els.backHalf.length.side.position.x = 0.5 * cos * params.width;

    // Move length-sides to define box inner space
    const sin = Math.sin(animated.openingAngle);
    els.frontHalf.length.side.position.z = 0.5 * sin * params.width;
    els.backHalf.length.side.position.z = -0.5 * sin * params.width;

    // Flap rotations
    els.frontHalf.width.top.rotation.x = -animated.flapAngles.frontHalf.width.top;
    els.frontHalf.length.top.rotation.x = -animated.flapAngles.frontHalf.length.top;
    els.frontHalf.width.bottom.rotation.x = animated.flapAngles.frontHalf.width.bottom;
    els.frontHalf.length.bottom.rotation.x = animated.flapAngles.frontHalf.length.bottom;

    els.backHalf.width.top.rotation.x = animated.flapAngles.backHalf.width.top;
    els.backHalf.length.top.rotation.x = animated.flapAngles.backHalf.length.top;
    els.backHalf.width.bottom.rotation.x = -animated.flapAngles.backHalf.width.bottom;
    els.backHalf.length.bottom.rotation.x = -animated.flapAngles.backHalf.length.bottom;

    // Front stamp tracks front panel
    if (frontStamp) {
      frontStamp.position.copy(els.frontHalf.length.side.position);
      frontStamp.position.z += params.thickness + 0.15;
    }

    // Back stamp tracks back panel
    if (backStamp) {
      backStamp.position.copy(els.backHalf.length.side.position);
      backStamp.position.z -= params.thickness + 0.15;
    }
  }

  // ── Build Scene Graph ────────────────────────────────────────────────────
  scene.add(els.group);
  setGeometryHierarchy();
  createBoxElements();

  // ── GSAP Timeline (drives the box folding & closing sequence) ────────────
  const timeline = gsap.timeline({
    paused: true,
    onUpdate: updatePanelsTransform,
  });

  timeline
    // 1. Box walls rise up 90° into upright structure
    .to(animated, {
      duration: 1,
      openingAngle: 0.5 * Math.PI,
      ease: "power1.inOut",
    })
    // 2. Bottom width flaps fold inwards
    .to(
      [animated.flapAngles.backHalf.width, animated.flapAngles.frontHalf.width],
      { duration: 0.6, bottom: 0.6 * Math.PI, ease: "back.in(3)" },
      0.9
    )
    // 3. Bottom back length flap folds
    .to(
      animated.flapAngles.backHalf.length,
      { duration: 0.7, bottom: 0.5 * Math.PI, ease: "back.in(2)" },
      1.1
    )
    // 4. Bottom front length flap folds shut & locks floor
    .to(
      animated.flapAngles.frontHalf.length,
      { duration: 0.8, bottom: 0.49 * Math.PI, ease: "back.in(3)" },
      1.4
    )
    // 5. Top width flaps fold down
    .to(
      [animated.flapAngles.backHalf.width, animated.flapAngles.frontHalf.width],
      { duration: 0.6, top: 0.6 * Math.PI, ease: "back.in(3)" },
      1.4
    )
    // 6. Top back length flap folds down
    .to(
      animated.flapAngles.backHalf.length,
      { duration: 0.7, top: 0.5 * Math.PI, ease: "back.in(3)" },
      1.7
    )
    // 7. Top front length flap folds down flush to close the box
    .to(
      animated.flapAngles.frontHalf.length,
      { duration: 0.9, top: 0.49 * Math.PI, ease: "back.in(4)" },
      1.8
    );

  // ── Render Loop with 60fps Dampening/Lerping ──────────────────────────────
  let targetProgress = 0;
  let currentProgress = 0;
  let rafId;

  const render = () => {
    rafId = requestAnimationFrame(render);

    // Smooth lerp external scroll progress into timeline
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0005) {
      currentProgress += diff * 0.12;
      timeline.progress(currentProgress);

      // Fade in top sealing tape when closed
      if (tapeMesh) {
        const tapeAlpha = Math.max(0, Math.min(0.95, (currentProgress - 0.84) / 0.14));
        tapeMesh.material.opacity = tapeAlpha;
      }
    }

    orbit.update();
    lightHolder.quaternion.copy(camera.quaternion);
    renderer.render(scene, camera);
  };
  render();

  // ── Resize ─────────────────────────────────────────────────────────
  const handleResize = () => {
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  // Expose state controller
  const stateObj = {
    set targetProgress(val) {
      targetProgress = val;
    },
    orbit,
    camera,
    renderer,
  };
  sceneStateRef.current = stateObj;

  // ── Teardown ─────────────────────────────────────────────────────────────
  return () => {
    window.removeEventListener("resize", handleResize);
    if (rafId) cancelAnimationFrame(rafId);
    try {
      timeline.kill();
    } catch (_) {}
    try {
      orbit.dispose();
    } catch (_) {}
    if (renderer.domElement) {
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    }
    try {
      renderer.dispose();
    } catch (_) {}
    material.dispose();
    els.group.traverse((obj) => {
      if (obj.geometry) try { obj.geometry.dispose(); } catch (_) {}
    });
    if (frontStamp) {
      try { frontStamp.geometry.dispose(); } catch (_) {}
      try { frontStamp.material.map.dispose(); } catch (_) {}
      try { frontStamp.material.dispose(); } catch (_) {}
    }
    if (backStamp) {
      try { backStamp.geometry.dispose(); } catch (_) {}
      try { backStamp.material.map.dispose(); } catch (_) {}
      try { backStamp.material.dispose(); } catch (_) {}
    }
    if (tapeMesh) {
      try { tapeMesh.geometry.dispose(); } catch (_) {}
      try { tapeMesh.material.map.dispose(); } catch (_) {}
      try { tapeMesh.material.dispose(); } catch (_) {}
    }
  };
}
