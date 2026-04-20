// auto-links.js - dossier soac1/
document.addEventListener('DOMContentLoaded', function() {

  // Page courante (ex: "auteur.html", "formation.html", etc.)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Mots-clés → page thématique
  // Le lien n'est PAS créé si on est déjà sur la page de destination
  const autoLinks = {

    // ── Identifiants → auteur.html ─────────────────────────────────────────
    "HAL":                        "auteur.html",
    "IdHAL":                      "auteur.html",
    "idHAL":                      "auteur.html",
    "ORCID":                      "auteur.html",
    "Web of Science":             "auteur.html",
    "Scopus":                     "auteur.html",
    "DOI":                        "auteur.html",

    // ── APC → ao.html ──────────────────────────────────────────────────────
    "APC":                        "ao.html",
    "Article Processing Charges": "ao.html",

    // ── Bibliographie → bibliometrie.html ──────────────────────────────────
    "Zotero":                     "bibliometrie.html",
    "Ramus":                      "bibliometrie.html",
    "OpenAlex":                   "bibliometrie.html",
    "impact de la recherche":     "bibliometrie.html",

    // ── Données / formations → formation.html ──────────────────────────────
    "DMP":                         "formation.html",
    "PGD":                         "formation.html",
    "plan de gestion des données": "formation.html",
    "Plan de gestion des données": "formation.html",
    "données de la recherche":     "formation.html",

    // ── Navigation générale ────────────────────────────────────────────────
    "science ouverte":          "index.html",
    "droits d'auteur":          "droit.html",
    "droit d'auteur":           "droit.html",
    "accès ouvert":             "ao.html",
    "open access":              "ao.html",
    "archive ouverte":          "deposer.html",
    "déposer":                  "deposer.html",
    "dépôt":                    "deposer.html",
    "Plan S":                   "ao.html",
    "ANR":                      "ao.html",
    "embargo":                  "ao.html",
    "publier en accès ouvert":  "publierao.html",
    "bibliométrie":             "bibliometrie.html"
  };

  // Sélectionner la zone de contenu principal
  const contentArea = document.querySelector('main') ||
                      document.querySelector('.content') ||
                      document.querySelector('body');

  // Exclure certaines zones (navigation, footer, liens existants, etc.)
  const excludedSelectors = ['nav', 'header', 'footer', '.menu', 'a', 'script', 'style'];

  function shouldProcessNode(node) {
    let parent = node.parentElement;
    while (parent) {
      if (excludedSelectors.includes(parent.tagName.toLowerCase()) ||
          excludedSelectors.some(sel => parent.matches && parent.matches(sel))) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  }

  function linkifyContent(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!shouldProcessNode(node) || !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToReplace = [];
    while (walker.nextNode()) {
      nodesToReplace.push(walker.currentNode);
    }

    // Garder trace des mots déjà liés sur cette page
    const linkedWords = new Set();

    nodesToReplace.forEach(node => {
      let text = node.textContent;
      let modified = false;
      let newHTML = text;

      // Trier par longueur décroissante pour éviter les conflits
      const sortedKeywords = Object.keys(autoLinks).sort((a, b) => b.length - a.length);

      sortedKeywords.forEach(keyword => {
        const keyLower = keyword.toLowerCase();
        const destination = autoLinks[keyword];

        // ← Ne pas créer de lien si on est déjà sur la page de destination
        if (destination === currentPage) return;

        // Ne lier que la première occurrence de chaque mot-clé
        if (!linkedWords.has(keyLower)) {
          const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');

          if (regex.test(newHTML)) {
            newHTML = newHTML.replace(regex, `<a href="${destination}" class="auto-link" title="En savoir plus sur ${keyword}">$1</a>`);
            linkedWords.add(keyLower);
            modified = true;
          }
        }
      });

      if (modified) {
        const span = document.createElement('span');
        span.innerHTML = newHTML;

        const fragment = document.createDocumentFragment();
        while (span.firstChild) {
          fragment.appendChild(span.firstChild);
        }
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  if (contentArea) {
    linkifyContent(contentArea);
  }
});
