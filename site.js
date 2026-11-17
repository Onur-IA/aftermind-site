// Aftermind : petites animations et fiches des membres.
(function () {
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  // 1. Photos privées : si le fichier n'est pas en ligne, la case disparaît.
  document.querySelectorAll("figure[data-prive] img").forEach(function (img) {
    function retirer() { img.closest("figure").remove(); }
    if (img.complete && img.naturalWidth === 0) retirer();
    img.addEventListener("error", retirer);
  });

  // 2. Fiches des membres.
  var membres = window.MEMBRES || [];
  // En ligne : seulement les membres qui ont donné leur accord. En local : tout le monde, pour l'aperçu.
  var visibles = local ? membres : membres.filter(function (m) { return m.accord; });
  if (visibles.length) {
    var grid = document.getElementById("fiches-grid");
    visibles.forEach(function (m) {
      var initiales = m.nom.split(/[\s-]+/).map(function (p) { return p[0]; }).slice(0, 2).join("");
      var li = document.createElement("li");
      li.className = "fiche" + (m.accord ? "" : " sans-accord");
      li.innerHTML =
        (m.photo ? '<img class="avatar" alt="" loading="lazy">' : '<span class="avatar" aria-hidden="true"></span>') +
        '<span class="fiche-txt"><strong></strong><span></span></span>';
      if (m.photo) { li.querySelector(".avatar").src = m.photo; } else { li.querySelector(".avatar").textContent = initiales; }
      // Photo LinkedIn en priorité, si elle existe dans img/linkedin/.
      (function (li, m, initiales) {
        var slug = m.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
        var test = new Image();
        test.onload = function () {
          var av = li.querySelector(".avatar");
          if (av.tagName !== "IMG") { var img = document.createElement("img"); img.className = "avatar"; img.alt = ""; av.replaceWith(img); av = img; }
          av.src = test.src;
        };
        test.src = "img/linkedin/" + slug + ".jpg";
      })(li, m, initiales);
      li.querySelector("strong").textContent = m.nom;
      li.querySelector(".fiche-txt span").textContent = m.activite;
      if (m.linkedin) {
        var a = document.createElement("a");
        a.href = m.linkedin; a.target = "_blank"; a.rel = "noopener";
        a.className = "fiche-link"; a.textContent = "LinkedIn";
        a.setAttribute("aria-label", "LinkedIn de " + m.nom);
        li.appendChild(a);
      }
      grid.appendChild(li);
    });
    var sansAccord = visibles.filter(function (m) { return !m.accord; }).length;
    document.getElementById("fiches-note").textContent = local && sansAccord
      ? "Aperçu local : " + visibles.length + " fiches. Les fiches en pointillé attendent l'accord du membre et ne seront pas en ligne."
      : "";
    document.getElementById("fiches").hidden = false;
  }

  // 2 ter. Mur de visages.
  var mur = document.getElementById("faces");
  if (mur && membres.length) {
    membres.filter(function (m) { return m.accord; }).forEach(function (m, i) {
      var slug = m.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
      var img = document.createElement("img");
      img.src = "img/linkedin/" + slug + ".jpg"; img.alt = m.nom; img.title = m.nom; img.loading = "lazy";
      img.style.animationDelay = (i * 40) + "ms";
      img.onerror = function () { img.remove(); };
      mur.appendChild(img);
    });
  }

  // 2 bis. Citations : photo LinkedIn si disponible.
  document.querySelectorAll(".q-av[data-slug]").forEach(function (box) {
    var test = new Image();
    test.onload = function () { box.innerHTML = ""; var img = document.createElement("img"); img.alt = ""; img.src = test.src; box.appendChild(img); };
    test.src = "img/linkedin/" + box.dataset.slug + ".jpg";
  });

  // 3. Apparition douce au défilement.
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cibles = document.querySelectorAll(".reveal");
  if (reduit || !("IntersectionObserver" in window)) {
    cibles.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    document.documentElement.classList.add("anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    cibles.forEach(function (el) { io.observe(el); });
  }

  // 4. Compteurs des chiffres.
  if (!reduit && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, fin = +el.dataset.count, t0 = null;
        co.unobserve(el);
        function pas(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1100, 1);
          el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(pas);
        }
        requestAnimationFrame(pas);
      });
    });
    document.querySelectorAll("[data-count]").forEach(function (el) { co.observe(el); });
  }
})();

// Diaporama de l'histoire et boutons « Copier ».
(function () {
  var story = document.getElementById("story");
  if (story) {
    var slides = story.querySelectorAll(".slide");
    var dots = document.getElementById("story-dots");
    slides.forEach(function () { dots.appendChild(document.createElement("i")); });
    function majPoints() {
      var w = slides[0].getBoundingClientRect().width + 20;
      var i = Math.round(story.scrollLeft / w);
      [].forEach.call(dots.children, function (d, k) { d.classList.toggle("on", k === i); });
    }
    story.addEventListener("scroll", function () { requestAnimationFrame(majPoints); });
    majPoints();
    document.querySelectorAll(".story-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var w = slides[0].getBoundingClientRect().width + 20;
        story.scrollBy({ left: w * +b.dataset.dir, behavior: "smooth" });
      });
    });
    story.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") story.scrollBy({ left: 300 });
      if (e.key === "ArrowLeft") story.scrollBy({ left: -300 });
    });
  }
  document.querySelectorAll(".btn-copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = document.getElementById(b.dataset.target).textContent;
      var fin = function () { var old = b.textContent; b.textContent = "Copié"; b.classList.add("done"); setTimeout(function () { b.textContent = old; b.classList.remove("done"); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(fin, fin); else fin();
    });
  });
})();

// Recherche et filtres des membres.
(function () {
  var q = document.getElementById("finder-q"), chips = document.querySelectorAll(".chip");
  if (!q) return;
  var filtre = "";
  var norm = function (t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var compte = document.createElement("p"); compte.className = "fiches-count";
  var grid = document.getElementById("fiches-grid"); grid.parentNode.insertBefore(compte, grid);
  function appliquer() {
    var t = norm(q.value.trim()), re = filtre ? new RegExp(norm(filtre)) : null, n = 0;
    grid.querySelectorAll(".fiche").forEach(function (f) {
      var txt = norm(f.textContent);
      var ok = (!t || txt.indexOf(t) > -1) && (!re || re.test(txt));
      f.classList.toggle("hide", !ok); if (ok) n++;
    });
    compte.textContent = n + (n > 1 ? " membres" : " membre");
  }
  q.addEventListener("input", appliquer);
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on");
      filtre = c.dataset.f; appliquer();
    });
  });
  appliquer();
})();

// Diaporama des soirées.
(function () {
  var reel = document.getElementById("reel");
  if (!reel) return;
  document.querySelectorAll(".reel-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var w = reel.querySelector(".reel-item").getBoundingClientRect().width + 20;
      reel.scrollBy({ left: w * +b.dataset.dir, behavior: "smooth" });
    });
  });
})();

// Sécurité : révéler au défilement même si l'observateur ne se déclenche pas.
(function () {
  function verifier() {
    var h = window.innerHeight;
    document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.95 && r.bottom > 0) el.classList.add("is-in");
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(verifier); }, { passive: true });
  window.addEventListener("load", verifier);
  setTimeout(verifier, 300);
})();
