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
