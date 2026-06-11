/* ==========================================================================
   GoDados.cam — Brand Website behavior
   Vanilla JS, no dependencies. Tabs, accordion, mobile drawer,
   IntersectionObserver reveals, GA4 lead events.
   ========================================================================== */
(function () {
  "use strict";

  /* --- Centralized config (mutable values live here only) ----------------- */
  var CONFIG = {
    GA4_ID: "G-XXXXXXXXXX",
    WHATSAPP: "5511999999999", // international format, digits only
    EMAIL: "contato@godados.cam",
    WHATSAPP_TEXT: "Olá, quero entender como a GoDados lê minhas câmeras",
    EMAIL_SUBJECT: "Quero conhecer a GoDados",
  };

  var WHATSAPP_URL =
    "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(CONFIG.WHATSAPP_TEXT);
  var EMAIL_URL =
    "mailto:" + CONFIG.EMAIL + "?subject=" + encodeURIComponent(CONFIG.EMAIL_SUBJECT);

  /* --- Analytics helper (no-op if gtag absent) ---------------------------- */
  function trackLead(method) {
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { method: method });
    }
  }

  /* --- Wire contact links from CONFIG -------------------------------------
     Rule: links whose href is "#" (or empty) become direct WhatsApp/email
     deep links. Links that already point to a section anchor (e.g. "#contato")
     keep scrolling there — we only attach lead tracking to them. */
  function wireContactLinks() {
    document.querySelectorAll('[data-lead="whatsapp"]').forEach(function (el) {
      var href = el.getAttribute("href");
      if (href === "#" || href === "" || href === null) {
        el.setAttribute("href", WHATSAPP_URL);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      el.addEventListener("click", function () { trackLead("whatsapp"); });
    });

    document.querySelectorAll('[data-lead="email"]').forEach(function (el) {
      var href = el.getAttribute("href");
      if (href === "#" || href === "" || href === null) {
        el.setAttribute("href", EMAIL_URL);
      }
      el.addEventListener("click", function () { trackLead("email"); });
    });
  }

  /* --- Mobile drawer ------------------------------------------------------ */
  function initDrawer() {
    var toggle = document.getElementById("menuToggle");
    var drawer = document.getElementById("mobileDrawer");
    var closeBtn = document.getElementById("menuClose");
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.remove("hidden");
      drawer.classList.add("flex");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var firstLink = drawer.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }
    function close() {
      drawer.classList.add("hidden");
      drawer.classList.remove("flex");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      toggle.focus();
    }

    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.querySelectorAll(".drawer-link").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !drawer.classList.contains("hidden")) close();
    });
  }

  /* --- Use case tabs ------------------------------------------------------ */
  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function activate(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.setAttribute("tabindex", selected ? "0" : "-1");
        t.classList.toggle("border-cyan-elec", selected);
        t.classList.toggle("text-ink-900", selected);
        t.classList.toggle("border-transparent", !selected);
        t.classList.toggle("text-ink-600", !selected);
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("hidden", !selected);
      });
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        var next;
        if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          activate(next);
          next.focus();
        }
      });
    });
  }

  /* --- Accordion (one open at a time) ------------------------------------- */
  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion-item");
        var isOpen = item.classList.contains("is-open");

        // close all
        document.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
          openItem.classList.remove("is-open");
          var btn = openItem.querySelector(".accordion-trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        // open this one if it was closed
        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* --- IntersectionObserver reveals --------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll(".reveal, .step-connector");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* --- Init --------------------------------------------------------------- */
  function init() {
    wireContactLinks();
    initDrawer();
    initTabs();
    initAccordion();
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
