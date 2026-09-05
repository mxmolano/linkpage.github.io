(function () {
  var root = document.documentElement;
  var themeButton = document.getElementById("theme-toggle");
  var languageButton = document.getElementById("language-toggle");
  var storageKeys = {
    scheme: "cyber-terminal-scheme",
    language: "cyber-terminal-language"
  };
  var configScheme = root.getAttribute("data-config-scheme") || "auto";
  var schemes = ["auto", "light", "dark"];
  var dictionary = {
    en: {
      shellLabel: "Cyber terminal profile",
      displayControls: "Display controls",
      themeToggleAria: "Switch color theme",
      languageToggleAria: "Switch language",
      themeAuto: "Theme: Auto",
      themeLight: "Theme: Light",
      themeDark: "Theme: Dark",
      languageToggle: "Language: EN",
      identityCommand: "identity --resolve",
      profileImageAlt: "Profile picture",
      profileStatus: "Profile status",
      linksLabel: "Links",
      socialsLabel: "Socials",
      modeLabel: "Mode",
      modeValue: "Online",
      primaryLinks: "Primary links",
      linksCommand: "open ./links",
      latestBadge: "LATEST",
      socialLinks: "Social links",
      socialsCommand: "handshake ./socials",
      footerCommand: "tail ./footer"
    },
    es: {
      shellLabel: "Perfil de terminal cyber",
      displayControls: "Controles de visualización",
      themeToggleAria: "Cambiar tema de color",
      languageToggleAria: "Cambiar idioma",
      themeAuto: "Tema: Auto",
      themeLight: "Tema: Claro",
      themeDark: "Tema: Oscuro",
      languageToggle: "Idioma: ES",
      identityCommand: "identidad --resolver",
      profileImageAlt: "Foto de perfil",
      profileStatus: "Estado del perfil",
      linksLabel: "Enlaces",
      socialsLabel: "Redes",
      modeLabel: "Modo",
      modeValue: "En línea",
      primaryLinks: "Enlaces principales",
      linksCommand: "abrir ./enlaces",
      latestBadge: "NUEVO",
      socialLinks: "Redes sociales",
      socialsCommand: "conectar ./redes",
      footerCommand: "leer ./footer"
    }
  };

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }

  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (error) { /* Storage can be unavailable in private contexts. */ }
  }

  function normalizeScheme(value) {
    return schemes.indexOf(value) === -1 ? "auto" : value;
  }

  function getInitialScheme() {
    return normalizeScheme(safeGet(storageKeys.scheme) || configScheme);
  }

  function getInitialLanguage() {
    var saved = safeGet(storageKeys.language);
    if (saved === "en" || saved === "es") return saved;
    return (root.getAttribute("lang") || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  }

  function applyScheme(scheme) {
    var next = normalizeScheme(scheme);
    root.classList.remove("scheme-light", "scheme-dark");
    if (next === "light") root.classList.add("scheme-light");
    if (next === "dark") root.classList.add("scheme-dark");
    root.setAttribute("data-active-scheme", next);
    safeSet(storageKeys.scheme, next);
    updateThemeButton(next, getInitialLanguage());
  }

  function updateThemeButton(scheme, language) {
    if (!themeButton) return;
    var labels = dictionary[language] || dictionary.en;
    var key = scheme === "light" ? "themeLight" : scheme === "dark" ? "themeDark" : "themeAuto";
    themeButton.textContent = labels[key];
  }

  function applyLanguage(language) {
    var next = language === "es" ? "es" : "en";
    var labels = dictionary[next];
    root.setAttribute("lang", next);
    root.setAttribute("data-active-language", next);

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (labels[key]) node.textContent = labels[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (node) {
      node.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        if (attr && key && labels[key]) node.setAttribute(attr, labels[key]);
      });
    });

    updateThemeButton(root.getAttribute("data-active-scheme") || getInitialScheme(), next);
    safeSet(storageKeys.language, next);
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var current = normalizeScheme(root.getAttribute("data-active-scheme") || "auto");
      var next = schemes[(schemes.indexOf(current) + 1) % schemes.length];
      applyScheme(next);
    });
  }

  if (languageButton) {
    languageButton.addEventListener("click", function () {
      var current = root.getAttribute("data-active-language") === "es" ? "es" : "en";
      applyLanguage(current === "es" ? "en" : "es");
    });
  }

  applyScheme(getInitialScheme());
  applyLanguage(getInitialLanguage());
}());
