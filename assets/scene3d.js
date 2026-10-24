/* THE GRAND HERO IN 3D — the Annihilators grade, on the house builder.
   Real-time WebGL geometry (three.js, vendored in /assets) layered over
   the hero of the grand front page only: gold frames, orbital rings, the
   pyramid, and the shard field over the grid floor, on the obsidian field.
   Discipline, same as the liquid it succeeds: DPR cap, pause off-screen
   and when the tab hides, one still frame under reduced motion, and the
   liquid stays as the fallback if this module cannot boot. */
(function () {
  var canvas = document.getElementById('scene3d-hero');
  if (!canvas) return;
  var hero = canvas.parentElement;
  if (!hero || !hero.classList.contains('hero-grand')) { canvas.remove(); return; }

  import('/assets/three.module.min.js').then(function (THREE) {
    try { boot(THREE); } catch (e) { /* the liquid carries the hero */ }
  }).catch(function () { /* the liquid carries the hero */ });

  function boot(THREE) {
    var GOLD = 0xD4AF6A, GOLD_DEEP = 0xc79e4d, OBSIDIAN = 0x050814;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(OBSIDIAN, 13, 34);

    var camera = new THREE.PerspectiveCamera(45, 2, 0.1, 80);
    camera.position.set(0, 1.3, 10.5);

    scene.add(new THREE.AmbientLight(0xf5e7c8, 0.18));
    var key = new THREE.DirectionalLight(0xf5e7c8, 1.6);
    key.position.set(6, 10, 4);
    scene.add(key);
    var rim = new THREE.DirectionalLight(GOLD, 0.5);
    rim.position.set(-7, 3, -6);
    scene.add(rim);

    var grid = new THREE.GridHelper(60, 60, GOLD_DEEP, 0x2a2416);
    grid.position.y = -1.9;
    grid.material.transparent = true;
    grid.material.opacity = 0.32;
    scene.add(grid);

    var frameMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.25, emissive: GOLD, emissiveIntensity: 0.12 });
    function makeFrame(w, h, x, y, z, ry) {
      var g = new THREE.Group();
      var t = 0.07;
      var top = new THREE.Mesh(new THREE.BoxGeometry(w, t, t), frameMat);
      var bot = top.clone();
      var lft = new THREE.Mesh(new THREE.BoxGeometry(t, h, t), frameMat);
      var rgt = lft.clone();
      top.position.y = h / 2; bot.position.y = -h / 2;
      lft.position.x = -w / 2; rgt.position.x = w / 2;
      g.add(top, bot, lft, rgt);
      g.position.set(x, y, z); g.rotation.y = ry;
      scene.add(g);
      return g;
    }
    var frames = [
      makeFrame(7.5, 5, 0, 0.4, -2.5, 0),
      makeFrame(5.4, 3.8, -4.6, 0.1, -5.5, 0.5),
      makeFrame(5.4, 3.8, 4.6, 0.1, -5.5, -0.5)
    ];

    var ringMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2, emissive: GOLD, emissiveIntensity: 0.15 });
    var rings = [];
    for (var i = 0; i < 3; i++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(2.6 + i * 0.55, 0.022, 12, 140), ringMat);
      ring.position.y = 0.4;
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.16;
      ring.rotation.y = i * 0.35;
      scene.add(ring);
      rings.push(ring);
    }

    var pyramid = new THREE.Mesh(
      new THREE.ConeGeometry(1.15, 1.7, 4),
      new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.22, emissive: GOLD, emissiveIntensity: 0.18, flatShading: true })
    );
    pyramid.position.y = 0.45;
    scene.add(pyramid);

    var COUNT = 110;
    var dummy = new THREE.Object3D();
    var goldMesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0),
      new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2, emissive: GOLD, emissiveIntensity: 0.15 }), COUNT);
    var darkMesh = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1.3, 0),
      new THREE.MeshPhysicalMaterial({ color: 0x0a090b, metalness: 0.4, roughness: 0.12, clearcoat: 1, flatShading: true }), COUNT);
    scene.add(goldMesh, darkMesh);
    var shards = [];
    var seed = 7;
    function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var s = 0; s < COUNT * 2; s++) {
      shards.push({
        isGold: s % 2 === 0,
        x: (rand() - 0.5) * 17, y: rand() * 6 - 1.6, z: (rand() - 0.5) * 12 - 1.5,
        rx: rand() * 3, ry: rand() * 3, rz: rand() * 3,
        scale: 0.05 + rand() * 0.16,
        spin: 0.15 + rand() * 0.5
      });
    }

    function size() {
      var w = Math.max(2, hero.clientWidth), h = Math.max(2, hero.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();

    /* booted — the liquid hands the hero over */
    if (window.__liquidHero && window.__liquidHero.hide) window.__liquidHero.hide();
    canvas.style.display = 'block';

    var px = 0, py = 0;
    hero.addEventListener('pointermove', function (e) {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    function renderFrame(t) {
      var angle = -0.25 + Math.sin(t * 0.07) * 0.3;
      var radius = 10.5;
      camera.position.x += ((Math.sin(angle) * radius + px * 1.1) - camera.position.x) * 0.05;
      camera.position.y += ((1.1 + Math.sin(t * 0.11) * 0.45 - py * 0.5) - camera.position.y) * 0.05;
      camera.position.z += ((Math.cos(angle) * radius) - camera.position.z) * 0.05;
      camera.lookAt(0, 0.3, 0);
      pyramid.rotation.y = t * 0.25;
      rings.forEach(function (r, i) { r.rotation.z = t * (0.08 + i * 0.03); });
      frames.forEach(function (f, i) { f.position.y = 0.4 + Math.sin(t * 0.4 + i * 1.7) * 0.12; });
      var gi = 0, di = 0;
      for (var k = 0; k < shards.length; k++) {
        var sh = shards[k];
        dummy.position.set(sh.x, sh.y + Math.sin(t * sh.spin + sh.x) * 0.25, sh.z);
        dummy.rotation.set(sh.rx + t * sh.spin * 0.4, sh.ry + t * sh.spin * 0.3, sh.rz);
        dummy.scale.setScalar(sh.scale);
        dummy.updateMatrix();
        if (sh.isGold) goldMesh.setMatrixAt(gi++, dummy.matrix); else darkMesh.setMatrixAt(di++, dummy.matrix);
      }
      goldMesh.count = gi; darkMesh.count = di;
      goldMesh.instanceMatrix.needsUpdate = true;
      darkMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    if (reduced) {
      renderFrame(7.3); /* one still frame, then nothing moves */
      window.addEventListener('resize', function () { size(); renderFrame(7.3); });
      return;
    }

    var running = true, visible = true, raf = 0, start = null;
    function frame(ts) {
      if (!running) return;
      if (start === null) start = ts;
      renderFrame((ts - start) / 1000);
      raf = requestAnimationFrame(frame);
    }
    function play() { if (!running && visible && !document.hidden) { running = true; start = null; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play(); else stop();
      }, { threshold: 0.02 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    window.addEventListener('resize', size);
    raf = requestAnimationFrame(frame);
  }
})();
