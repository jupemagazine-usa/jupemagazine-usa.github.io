/* THE GRAND HERO IN 3D — Round 27: THE MEDALLION.
   The shard field gets its centerpiece: the house medallion struck in
   real geometry — an obsidian disc in a polished gold rim beaded with
   cut diamonds, the B of Jupiter Deco EXTRUDED FROM THE FONT'S OWN
   OUTLINES (the path data below is the glyph, extracted by fontTools;
   no hand redraws a house letter), three orbital rings precessing
   around it, a halo and a pool of light beneath. A procedural studio
   environment (softboxes painted on a canvas, fed to the scene as an
   equirect reflection map) is what turns the gold from flat colour
   into liquid metal. Frames, couture-stone gems, shards and gold dust
   complete the field. Same discipline as ever: DPR cap 1.5, pause
   off-screen and when the tab hides, one still frame under reduced
   motion, and the liquid carries the hero if this cannot boot. */
(function () {
  var canvas = document.getElementById('scene3d-hero');
  if (!canvas) return;
  var hero = canvas.parentElement;
  if (!hero || !hero.classList.contains('hero-grand')) { canvas.remove(); return; }

  import('/assets/three.module.min.js').then(function (THREE) {
    try { boot(THREE); } catch (e) { /* the liquid carries the hero */ }
  }).catch(function () { /* the liquid carries the hero */ });

  /* The Jupiter Deco B, true outlines (font units, y-up, ink 40..546 × -7..767). */
  var B_PATH = "M40 0H70V760H40ZM100 0H130V760H100ZM126 744 306 767H313L350 763L357 762L392 751L398 749L431 732L436 728L464 705L469 700L491 672L495 666L510 635L512 628L520 594L521 587V553L520 546L512 512L510 505L495 474L491 468L469 440L464 435L436 412L431 408L398 391L392 389L357 378L350 377L313 373H314L134 351L126 415L306 437H307L344 440L338 439L374 450L368 448L401 465L395 461L423 484L419 479L441 507L437 501L452 533L450 526L458 560L457 553V587L458 580L450 614L452 607L437 639L441 633L419 661L423 656L395 679L401 675L368 692L374 690L338 701L344 700L307 703H314L134 680ZM125 390 315 417H323L364 413L370 412L409 400L414 398L450 379L455 375L485 350L490 345L514 315L518 309L534 275L537 268L545 231L546 224V186L545 179L537 142L534 135L518 101L514 95L490 65L485 60L455 35L450 31L414 12L409 10L370 -2L364 -3L323 -7H315L125 20L135 84L325 57H317L357 61L351 60L390 71L384 69L420 88L414 84L444 109L440 104L464 135L460 129L477 163L474 157L483 193L482 186V224L483 217L474 253L477 247L460 281L464 275L440 306L444 301L414 326L420 322L384 341L390 339L351 350L357 349L317 353H325L135 326Z";

  function parseContours(d) {
    var toks = d.match(/[MLHVZ]|-?\d+(?:\.\d+)?/g), contours = [], cur = null;
    var cx = 0, cy = 0, cmd = null, i = 0;
    while (i < toks.length) {
      var t = toks[i];
      if (/[MLHVZ]/.test(t)) {
        cmd = t; i++;
        if (cmd === 'Z') { if (cur && cur.length > 2) contours.push(cur); cur = null; }
        continue;
      }
      var v = parseFloat(t);
      if (cmd === 'M') { cx = v; cy = parseFloat(toks[i + 1]); cur = [[cx, cy]]; cmd = 'L'; i += 2; }
      else if (cmd === 'L') { cx = v; cy = parseFloat(toks[i + 1]); cur.push([cx, cy]); i += 2; }
      else if (cmd === 'H') { cx = v; cur.push([cx, cy]); i += 1; }
      else if (cmd === 'V') { cy = v; cur.push([cx, cy]); i += 1; }
      else i++;
    }
    if (cur && cur.length > 2) contours.push(cur);
    return contours;
  }

  function radialSprite(stops, size) {
    var c = document.createElement('canvas'); c.width = c.height = size || 256;
    var x = c.getContext('2d');
    var gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
    x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function boot(THREE) {
    var GOLD = 0xD4AF6A, OBSIDIAN = 0x050814;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    canvas.style.display = 'block'; /* the sheet holds it hidden until the scene boots */

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(OBSIDIAN, 13, 34);

    /* — the studio: a painted environment the metals reflect — */
    (function () {
      var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
      var x = c.getContext('2d');
      var sky = x.createLinearGradient(0, 0, 0, 512);
      sky.addColorStop(0, '#39406B'); sky.addColorStop(0.42, '#131A33');
      sky.addColorStop(0.62, '#0A0E20'); sky.addColorStop(1, '#04050C');
      x.fillStyle = sky; x.fillRect(0, 0, 1024, 512);
      function softbox(cx, cy, w, h, inner, outer) {
        var g = x.createRadialGradient(cx, cy, 4, cx, cy, w);
        g.addColorStop(0, inner); g.addColorStop(1, outer);
        x.save(); x.translate(cx, cy); x.scale(1, h / w); x.translate(-cx, -cy);
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, w, 0, 7); x.fill(); x.restore();
      }
      softbox(268, 128, 190, 92, 'rgba(255,246,216,0.98)', 'rgba(255,246,216,0)');
      softbox(268, 128, 90, 46, 'rgba(255,255,255,1)', 'rgba(255,255,255,0)');
      softbox(772, 108, 150, 76, 'rgba(226,234,255,0.85)', 'rgba(226,234,255,0)');
      softbox(512, 470, 330, 60, 'rgba(245,181,26,0.55)', 'rgba(245,181,26,0)');
      var tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      scene.environment = tex;
    })();

    var camera = new THREE.PerspectiveCamera(45, 2, 0.1, 80);
    camera.position.set(0, 1.3, 10.5);

    scene.add(new THREE.AmbientLight(0xf5e7c8, 0.22));
    var key = new THREE.DirectionalLight(0xffe9bb, 1.35);
    key.position.set(-4, 6, 6); scene.add(key);
    var rim = new THREE.DirectionalLight(0x0F52BA, 0.55);
    rim.position.set(6, 2, -5); scene.add(rim);
    var faceLight = new THREE.PointLight(0xffd98a, 42, 0, 2);
    faceLight.position.set(0.03, 0.7, 4.55); /* local to the stage: world (2.45, 0.7, 3.4) at full size */

    var goldPolished = new THREE.MeshStandardMaterial({ color: 0xE9CB7E, metalness: 1.0, roughness: 0.17, envMapIntensity: 1.25 });
    var goldStruck = new THREE.MeshStandardMaterial({ color: 0xF5B81D, metalness: 1.0, roughness: 0.20, envMapIntensity: 1.5, emissive: 0x140B00 });
    var discFace = new THREE.MeshStandardMaterial({ color: 0x201A38, metalness: 0.95, roughness: 0.30, envMapIntensity: 1.05 });
    var discSide = goldPolished;
    var darkMetal = new THREE.MeshStandardMaterial({ color: 0x11131F, metalness: 0.9, roughness: 0.42, envMapIntensity: 0.8 });

    var world = new THREE.Group(); scene.add(world);
    var stage = new THREE.Group();
    stage.position.set(2.42, 0, -1.15);
    world.add(stage); stage.add(faceLight);

    /* — the floor grid, as ever — */
    var grid = new THREE.GridHelper(46, 46, 0xc79e4d, 0xc79e4d);
    grid.material.transparent = true; grid.material.opacity = 0.10;
    grid.position.y = -2.05; world.add(grid);

    /* — THE MEDALLION — */
    var medallion = new THREE.Group();
    medallion.position.set(0, 0.32, 0);
    stage.add(medallion);

    var halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(radialSprite([[0, 'rgba(245,197,90,0.55)'], [0.4, 'rgba(245,181,26,0.18)'], [1, 'rgba(245,181,26,0)']])),
      transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    halo.scale.set(9.5, 9.5, 1); halo.position.z = -0.9; medallion.add(halo);

    var disc = new THREE.Mesh(new THREE.CylinderGeometry(1.70, 1.70, 0.18, 96), [discSide, discFace, discFace]);
    disc.rotation.x = Math.PI / 2; medallion.add(disc);
    medallion.add(new THREE.Mesh(new THREE.TorusGeometry(1.70, 0.085, 28, 144), goldPolished));
    var hairline = new THREE.Mesh(new THREE.TorusGeometry(1.40, 0.020, 12, 128), goldPolished);
    hairline.position.z = 0.095; medallion.add(hairline);

    /* the rim beaded with cut diamonds — Deco terminals, twenty-four */
    var beadGeo = new THREE.OctahedronGeometry(0.058);
    var beads = new THREE.InstancedMesh(beadGeo, goldStruck, 24);
    var m4 = new THREE.Matrix4();
    for (var b = 0; b < 24; b++) {
      var a = (b / 24) * Math.PI * 2;
      m4.makeTranslation(Math.cos(a) * 1.70, Math.sin(a) * 1.70, 0.02);
      beads.setMatrixAt(b, m4);
    }
    medallion.add(beads);

    /* the B — extruded from the font's own outlines, centred by its ink */
    (function () {
      var contours = parseContours(B_PATH);
      var shapes = contours.map(function (c) {
        return new THREE.Shape(c.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
      });
      var geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 96, bevelEnabled: true, bevelThickness: 12, bevelSize: 9, bevelSegments: 2, steps: 1
      });
      var s = 1.98 / 774; /* ink height 774 font units -> 1.98 world units */
      geo.scale(s, s, s);
      geo.translate(-293 * s, -380 * s, 0.055); /* ink centre (293, 380) to the disc centre */
      var letterMesh = new THREE.Mesh(geo, goldStruck);
      medallion.add(letterMesh);
    })();

    /* the pool of light it floats in */
    var poolTex = new THREE.CanvasTexture(radialSprite([[0, 'rgba(245,197,90,0.5)'], [0.55, 'rgba(245,181,26,0.16)'], [1, 'rgba(245,181,26,0)']]));
    var pool = new THREE.Mesh(new THREE.CircleGeometry(3.1, 48),
      new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(0, -2.02, 0); stage.add(pool);

    /* — the orbital rings, re-centred on the medallion — */
    var pivots = [];
    [[2.28, 0.016], [2.64, 0.013], [3.04, 0.011]].forEach(function (r, i) {
      var pivot = new THREE.Group();
      pivot.position.copy(medallion.position);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(r[0], r[1], 10, 160), goldPolished);
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.22;
      ring.rotation.y = i * 0.5;
      pivot.add(ring); stage.add(pivot); pivots.push(pivot);
    });

    /* — the gold frames, spread wider behind — */
    var frames = [];
    [[3.1, -3.3, 0.7, -2.7], [3.6, -0.7, 2.35, -4.4], [2.5, -1.7, -1.3, -3.4]].forEach(function (f) {
      var fr = new THREE.Mesh(new THREE.BoxGeometry(f[0], f[0], 0.07),
        new THREE.MeshStandardMaterial({ color: 0x0A0E20, metalness: 0.6, roughness: 0.5, envMapIntensity: 0.4 }));
      var edge = new THREE.LineSegments(new THREE.EdgesGeometry(fr.geometry),
        new THREE.LineBasicMaterial({ color: GOLD }));
      var grp = new THREE.Group(); grp.add(fr); grp.add(edge);
      grp.position.set(f[1], f[2], f[3]); world.add(grp); frames.push(grp);
    });

    /* — the shard field, thinned for air — */
    function scatter(count, geo, mat, sMin, sMax) {
      var inst = new THREE.InstancedMesh(geo, mat, count);
      var d = new THREE.Object3D(); var col = new THREE.Color();
      for (var i = 0; i < count; i++) {
        var r = 4.2 + Math.random() * 6.3, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        d.position.set(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.72, r * Math.sin(ph) * Math.sin(th) - 1.5);
        var dxm = d.position.x - 2.42, dym = d.position.y - 0.32;
        if (d.position.z > -3.4 && dxm * dxm + dym * dym < 5.8) d.position.x += (dxm < 0 ? -2.2 : 2.2); /* the medallion's air stays clear */
        d.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        var sc = sMin + Math.random() * (sMax - sMin); d.scale.set(sc, sc, sc);
        d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
        if (mat === gemMat) { col.setHex(GEM_HEX[i % GEM_HEX.length]); inst.setColorAt(i, col); }
      }
      world.add(inst); return inst;
    }
    var GEM_HEX = [0x9966CC, 0x0F52BA, 0xB3122E, 0x0B8A4B, 0xE8A33D];
    var gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0.1, roughness: 0.12, envMapIntensity: 1.3,
      clearcoat: 1.0, clearcoatRoughness: 0.08
    });
    var goldShardMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1.0, roughness: 0.28, envMapIntensity: 1.1, emissive: 0x2A1A04 });
    var goldShards = scatter(84, new THREE.OctahedronGeometry(1), goldShardMat, 0.05, 0.16);
    var darkShards = scatter(84, new THREE.TetrahedronGeometry(1), darkMetal, 0.06, 0.20);
    var gems = scatter(30, new THREE.OctahedronGeometry(1), gemMat, 0.10, 0.26);

    /* — gold dust, for depth — */
    (function () {
      var n = 240, pos = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) {
        var r = 3 + Math.random() * 8.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 1.5;
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var dust = new THREE.Points(g, new THREE.PointsMaterial({
        color: 0xF5D98A, size: 0.045, transparent: true, opacity: 0.5,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
      }));
      dust.name = 'dust'; world.add(dust);
    })();

    /* — stage & choreography (the standing discipline) — */
    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      if (camera.aspect < 0.8) { stage.position.set(1.02, 0.12, -1.4); stage.scale.setScalar(0.8); }
      else if (camera.aspect < 1.15) { stage.position.set(1.9, 0.05, -1.25); stage.scale.setScalar(0.92); }
      else { stage.position.set(2.42, 0, -1.15); stage.scale.setScalar(1); }
    }
    resize();
    window.addEventListener('resize', resize);

    var tx = 0, ty = 0, px = 0, py = 0;
    if (window.matchMedia('(pointer:fine)').matches && !reduced) {
      window.addEventListener('pointermove', function (e) {
        tx = (e.clientX / window.innerWidth - 0.5) * 0.55;
        ty = (e.clientY / window.innerHeight - 0.5) * 0.35;
      }, { passive: true });
    }

    var running = false, inView = false, t0 = performance.now();
    function frame(now) {
      if (!running) return;
      var t = (now - t0) / 1000;
      medallion.position.y = 0.32 + Math.sin(t * 0.5) * 0.07;
      medallion.rotation.y = Math.sin(t * 0.21) * 0.07;
      medallion.rotation.x = Math.sin(t * 0.16) * 0.03;
      pivots.forEach(function (p, i) {
        p.rotation.y = t * (0.05 + i * 0.021);
        p.rotation.z = Math.sin(t * 0.11 + i * 2.1) * 0.10;
      });
      frames.forEach(function (f, i) {
        f.rotation.y = Math.sin(t * 0.07 + i * 2.4) * 0.16;
        f.rotation.x = Math.cos(t * 0.05 + i * 1.7) * 0.08;
      });
      var dust = world.getObjectByName('dust');
      if (dust) dust.rotation.y = t * 0.006;
      gems.rotation.y = t * 0.01;
      goldShards.rotation.y = t * 0.014;
      darkShards.rotation.y = -t * 0.009;
      px += (tx - px) * 0.04; py += (ty - py) * 0.04;
      camera.position.x = px; camera.position.y = 1.3 - py;
      camera.lookAt(0.4, 0.1, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduced) return;
      running = true; t0 = performance.now() - 7300;
      requestAnimationFrame(frame);
    }
    function stop() { running = false; }
    function still() {
      var t = 7.3;
      medallion.position.y = 0.32 + Math.sin(t * 0.5) * 0.07;
      medallion.rotation.y = Math.sin(t * 0.21) * 0.07;
      pivots.forEach(function (p, i) {
        p.rotation.y = t * (0.05 + i * 0.021);
        p.rotation.z = Math.sin(t * 0.11 + i * 2.1) * 0.10;
      });
      gems.rotation.y = t * 0.01;
      goldShards.rotation.y = t * 0.014;
      darkShards.rotation.y = -t * 0.009;
      camera.lookAt(0.4, 0.1, 0);
      renderer.render(scene, camera);
    }

    if (window.__liquidHero) window.__liquidHero.hide();

    if (reduced) { resize(); still(); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView && !document.hidden) start(); else stop();
      }, { threshold: 0.02 }).observe(hero);
    } else inView = true;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (inView) start();
    });
    if (inView) start();
  }
})();
