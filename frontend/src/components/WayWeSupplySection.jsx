import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Promises list ─── */
const PROMISES = [
  "On-time dispatch from Sharjah",
  "Formal quotation within 24 hours",
  "Full-range supply under one roof",
  "Quality checked before it leaves",
];

/* ─── 01 02 03 supply steps ─── */
const STEPS = [
  {
    num: "01",
    title: "One supplier. The full range.",
    text: "Corrugated products, boxes, tapes, protective films and accessories — the catalogue our customers rely on, all under one roof.",
  },
  {
    num: "02",
    title: "Rooted in Sharjah industry.",
    text: "Operating from Industrial Area #5 since 2013, close to the UAE's manufacturing and logistics corridors.",
  },
  {
    num: "03",
    title: "Supply built for business.",
    text: "Quotation-based B2B supply. Tell us the product, the size and the quantity — our team responds with a formal quotation.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Three.js Folding Cardboard Box Canvas
   Ported from: github.com/uuuulala/Threejs-folding-cardboard-box-tutorial
   Changes from tutorial:
     - mergeGeometries (Three.js ≥ r150) instead of mergeBufferGeometries
     - Kraft-brown colour palette to match site
     - ScrollTrigger scoped to section element (not full page)
     - No copyright mesh / GUI controls
     - Fully React-lifecycle-safe with cleanup
   ───────────────────────────────────────────────────────────────────────────── */
function FoldingBoxCanvas({ sectionRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sectionRef?.current) return;

    /* ── Box parameters ── */
    const params = {
      width: 27,
      length: 80,
      depth: 45,
      thickness: 0.6,
      fluteFreq: 5,
      flapGap: 1,
    };

    /* ── Animated state (mutated directly by GSAP) ── */
    const animated = {
      openingAngle: 0.02 * Math.PI, // start nearly flat, opens to 0.5π
      flapAngles: {
        backHalf: {
          width:  { top: 0, bottom: 0 },
          length: { top: 0, bottom: 0 },
        },
        frontHalf: {
          width:  { top: 0, bottom: 0 },
          length: { top: 0, bottom: 0 },
        },
      },
    };

    /* ── Mesh elements ── */
    const mkMesh = () => new THREE.Mesh();
    const els = {
      group: new THREE.Group(),
      backHalf: {
        width:  { top: mkMesh(), side: mkMesh(), bottom: mkMesh() },
        length: { top: mkMesh(), side: mkMesh(), bottom: mkMesh() },
      },
      frontHalf: {
        width:  { top: mkMesh(), side: mkMesh(), bottom: mkMesh() },
        length: { top: mkMesh(), side: mkMesh(), bottom: mkMesh() },
      },
    };

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      10,
      1000
    );
    camera.position.set(40, 90, 110);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const lightHolder = new THREE.Group();
    const topLight = new THREE.PointLight(0xffffff, 0.5);
    topLight.position.set(-30, 300, 0);
    lightHolder.add(topLight);
    const sideLight = new THREE.PointLight(0xffffff, 0.7);
    sideLight.position.set(50, 0, 150);
    lightHolder.add(sideLight);
    scene.add(lightHolder);

    /* ── Build mesh hierarchy ── */
    scene.add(els.group);
    els.group.add(
      els.frontHalf.width.side,
      els.frontHalf.length.side,
      els.backHalf.width.side,
      els.backHalf.length.side
    );
    els.frontHalf.width.side.add(els.frontHalf.width.top,   els.frontHalf.width.bottom);
    els.frontHalf.length.side.add(els.frontHalf.length.top, els.frontHalf.length.bottom);
    els.backHalf.width.side.add(els.backHalf.width.top,     els.backHalf.width.bottom);
    els.backHalf.length.side.add(els.backHalf.length.top,   els.backHalf.length.bottom);

    function createCorrugatedTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 72;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "#DFD3C5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(
          x + 4, 8,
          x + 4, 28,
          x + 9, 72
        );
        ctx.lineTo(x + 9, 72);
        ctx.lineTo(x, 72);
        ctx.closePath();
        ctx.fillStyle = x % 20 === 0 ? "rgba(118, 92, 68, 0.16)" : "rgba(255,255,255,0.18)";
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(104, 82, 63, 0.18)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= canvas.height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(canvas.width, y + 0.5);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 2);
      texture.needsUpdate = true;
      return texture;
    }

    const corrugatedTexture = createCorrugatedTexture();
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xDFD3C5),
      map: corrugatedTexture,
      roughness: 0.88,
      metalness: 0.03,
      side: THREE.DoubleSide,
    });
    els.group.traverse((c) => {
      if (c.isMesh) c.material = material;
    });

    /* ── Geometry helpers ── */

    /**
     * Build one corrugated face geometry.
     * folds: [top, right, bottom, left] — which edges taper to zero.
     * hasMiddleLayer: adds the sinusoidal fluting layer for extra thickness.
     */
    function createSideGeometry(basePlane, size, folds, hasMiddleLayer) {
      const layers = [];

      function makeLayer(offsetFn) {
        const g = basePlane.clone();
        const pos = g.attributes.position;
        const taper = (coord, span) =>
          1.0 - Math.pow(coord / (0.5 * span), 10.0);

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          let z = pos.getZ(i) + offsetFn(x);
          if ((x > 0 && folds[1]) || (x < 0 && folds[3])) z *= taper(x, size[0]);
          if ((y > 0 && folds[0]) || (y < 0 && folds[2])) z *= taper(y, size[1]);
          pos.setXYZ(i, x, y, z);
        }
        return g;
      }

      const freq = params.fluteFreq;
      const t    = params.thickness;
      layers.push(makeLayer((x) => -0.5 * t + 0.01 * Math.sin(freq * x)));
      layers.push(makeLayer((x) =>  0.5 * t + 0.01 * Math.sin(freq * x)));
      if (hasMiddleLayer) {
        layers.push(makeLayer((x) => 0.5 * t * Math.sin(freq * x)));
      }

      const merged = mergeGeometries(layers, false);
      merged.computeVertexNormals();
      return merged;
    }

    /** Build/rebuild all panel geometries (runs once on mount). */
    function createBoxElements() {
      for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
        for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
          const half = halfIdx ? "frontHalf" : "backHalf";
          const side = sideIdx ? "width"     : "length";

          const sw = side === "width" ? params.width : params.length;
          const fw = sw - 2 * params.flapGap;
          const fh = 0.5 * params.width - 0.75 * params.flapGap;

          const sidePlane = new THREE.PlaneGeometry(
            sw, params.depth,
            Math.floor(5 * sw),      Math.floor(0.2 * params.depth)
          );
          const flapPlane = new THREE.PlaneGeometry(
            fw, fh,
            Math.floor(5 * fw),      Math.floor(0.2 * fh)
          );

          const sideGeo = createSideGeometry(sidePlane, [sw, params.depth], [true,  true,  true,  true],  false);
          const topGeo  = createSideGeometry(flapPlane, [fw, fh],           [false, false, true,  false], true);
          const botGeo  = createSideGeometry(flapPlane, [fw, fh],           [true,  false, false, false], true);

          topGeo.translate(0,  0.5 * fh, 0);
          botGeo.translate(0, -0.5 * fh, 0);

          els[half][side].top.geometry    = topGeo;
          els[half][side].side.geometry   = sideGeo;
          els[half][side].bottom.geometry = botGeo;

          els[half][side].top.position.y    =  0.5 * params.depth;
          els[half][side].bottom.position.y = -0.5 * params.depth;
        }
      }
    }

    /** Apply animated angles to all panels — called every GSAP tick. */
    function updatePanelsTransform() {
      const { openingAngle, flapAngles } = animated;

      // Width sides — fixed X position, rotated by opening angle
      els.frontHalf.width.side.position.x =  0.5 * params.length;
      els.backHalf.width.side.position.x  = -0.5 * params.length;
      els.frontHalf.width.side.rotation.y =  openingAngle;
      els.backHalf.width.side.rotation.y  =  openingAngle;

      // Length sides — follow opening angle
      const cos = Math.cos(openingAngle);
      const sin = Math.sin(openingAngle);
      els.frontHalf.length.side.position.x = -0.5 * cos * params.width;
      els.backHalf.length.side.position.x  =  0.5 * cos * params.width;
      els.frontHalf.length.side.position.z =  0.5 * sin * params.width;
      els.backHalf.length.side.position.z  = -0.5 * sin * params.width;

      // Flap rotations
      els.frontHalf.width.top.rotation.x     = -flapAngles.frontHalf.width.top;
      els.frontHalf.length.top.rotation.x    = -flapAngles.frontHalf.length.top;
      els.frontHalf.width.bottom.rotation.x  =  flapAngles.frontHalf.width.bottom;
      els.frontHalf.length.bottom.rotation.x =  flapAngles.frontHalf.length.bottom;

      els.backHalf.width.top.rotation.x      =  flapAngles.backHalf.width.top;
      els.backHalf.length.top.rotation.x     =  flapAngles.backHalf.length.top;
      els.backHalf.width.bottom.rotation.x   = -flapAngles.backHalf.width.bottom;
      els.backHalf.length.bottom.rotation.x  = -flapAngles.backHalf.length.bottom;

      if (sealMesh) {
        sealMesh.position.copy(els.frontHalf.length.side.position);
        sealMesh.position.x += 0;
        sealMesh.position.y += 0;
        sealMesh.position.z += params.depth * 0.82;
      }
    }

    function createSealMesh() {
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 260;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "#f3eadc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1e140d";
      ctx.fillRect(0, 0, canvas.width, 82);
      ctx.fillStyle = "#d6a94e";
      ctx.fillRect(0, 82, canvas.width, 8);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 52px sans-serif";
      ctx.fillText("AL LULU", 32, 60);
      ctx.fillStyle = "#d6a94e";
      ctx.font = "700 18px monospace";
      ctx.fillText("PACKAGING", 32, 110);

      ctx.fillStyle = "#1e140d";
      ctx.font = "600 24px sans-serif";
      ctx.fillText("SECURE • SEALED • READY", 32, 168);
      ctx.font = "18px monospace";
      ctx.fillText("SHARJAH, UAE • EST. 2013", 32, 206);

      const texture = new THREE.CanvasTexture(canvas);
      const materialSeal = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: true,
      });

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(params.length * 0.72, params.depth * 0.55),
        materialSeal
      );
      mesh.position.set(0, 0, params.depth * 0.9);
      mesh.rotation.y = Math.PI;
      scene.add(mesh);
      return mesh;
    }

    const sealMesh = createSealMesh();

    createBoxElements();
    updatePanelsTransform();

    /* ── OrbitControls (auto-rotate, no zoom/pan) ── */
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableZoom = false;
    orbit.enablePan  = false;
    orbit.enableDamping  = true;
    orbit.autoRotate     = true;
    orbit.autoRotateSpeed = 0.5;

    /* ── GSAP ScrollTrigger fold animation ──
       Timeline mirrors the tutorial sequence:
         1. Sides swing open      (openingAngle 0.02π → 0.5π)
         2. Bottom flaps close
         3. Top flaps close
       Scrub is tied to the section element so the fold tracks scroll
       only while the section is in the viewport.                       */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "+=520",
        scrub: 0.8,
      },
      onUpdate: updatePanelsTransform,
    });

    tl.to(animated, {
        duration: 1,
        openingAngle: 0.5 * Math.PI,
        ease: "power1.inOut",
      })
      .to(
        [animated.flapAngles.backHalf.width, animated.flapAngles.frontHalf.width],
        { duration: 0.6, bottom: 0.6 * Math.PI, ease: "back.in(3)" },
        0.9
      )
      .to(animated.flapAngles.backHalf.length, {
        duration: 0.7, bottom: 0.5 * Math.PI, ease: "back.in(2)"
      }, 1.1)
      .to(animated.flapAngles.frontHalf.length, {
        duration: 0.8, bottom: 0.49 * Math.PI, ease: "back.in(3)"
      }, 1.4)
      .to(
        [animated.flapAngles.backHalf.width, animated.flapAngles.frontHalf.width],
        { duration: 0.6, top: 0.6 * Math.PI, ease: "back.in(3)" },
        1.4
      )
      .to(animated.flapAngles.backHalf.length, {
        duration: 0.7, top: 0.5 * Math.PI, ease: "back.in(3)"
      }, 1.7)
      .to(animated.flapAngles.frontHalf.length, {
        duration: 0.9, top: 0.49 * Math.PI, ease: "back.in(4)"
      }, 1.8)
      .to(sealMesh.material, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out",
      }, 2.2);

    /* ── Render loop ── */
    let rafId;
    function render() {
      rafId = requestAnimationFrame(render);
      orbit.update();
      lightHolder.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    }
    render();

    /* ── Resize handler ── */
    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      tl.scrollTrigger?.kill();
      tl.kill();
      orbit.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: 380, position: "relative" }}
      aria-hidden="true"
    />
  );
}

/* ─── Main section component ─── */
export default function WayWeSupplySection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="grain bg-charcoal text-bone overflow-hidden"
      data-testid="way-we-supply-section"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-start">

          {/* ── LEFT: 01 02 03 ── */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tape mb-4">
              Why Al Lulu
            </p>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl mb-14">
              The way<br />we supply
            </h2>

            <div className="divide-y divide-bone/10">
              {STEPS.map((s) => (
                <div key={s.num} className="flex items-start gap-8 py-9">
                  <span
                    className="font-display font-extrabold shrink-0 leading-none select-none"
                    style={{ fontSize: "clamp(3rem,5.5vw,4.2rem)", color: "rgba(248,246,240,0.08)" }}
                  >
                    {s.num}
                  </span>
                  <div className="flex-1 border-l-2 border-kraft pl-7">
                    <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-bone/60">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Three.js Box + Promises (sticky) ── */}
          <div className="flex flex-col items-center gap-10 lg:pt-16 lg:sticky lg:top-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tape self-start lg:self-center">
              Promises we deliver
            </p>

            {/* Three.js folding box canvas */}
            <FoldingBoxCanvas sectionRef={sectionRef} />

            {/* Promises */}
            <div className="w-full max-w-xs">
              <ul className="flex flex-col gap-3 border border-bone/12 bg-bone/5 p-5">
                {PROMISES.map((promise, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-kraft flex items-center justify-center"
                      style={{ background: "rgba(160,90,44,0.12)" }}
                    >
                      <span className="block h-1.5 w-1.5 rounded-full bg-kraft" />
                    </span>
                    <span className="text-sm leading-snug text-bone/75">{promise}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
