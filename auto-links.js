// auto-links.js - À placer dans votre dossier soac1/
document.addEventListener('DOMContentLoaded', function() {
  
  // Mots-clés et leurs pages de destination
  const autoLinks = {
    // Pages principales du menu
    "identifier en tant qu'auteur": "auteur.html",
    "identifiant": "auteur.html",
    "droits d'auteur": "droit.html",
    "droit d'auteur": "droit.html",
    "accès ouvert": "ao.html",
    "open access": "ao.html",
    "archive ouverte": "deposer.html",
    "déposer": "deposer.html",
    "dépôt": "deposer.html",
    "publier en accès ouvert": "publierao.html",
    "publier": "publierao.html",
    "édition": "publierao.html",
    "bibliométrie": "bibliometrie.html",
    "impact de la recherche": "bibliometrie.html",
    "formations": "formation.html",
    "accompagnements": "formation.html",
    
    // Concepts clés de la science ouverte
    "science ouverte": "index.html",
    "HAL": "https://hal.science/",
    "Zotero": "auteur.html",
    "Plan S": "ao.html",
    "loi pour la République Numérique": "droit.html",
    "ANR": "ao.html",
    "embargo": "ao.html"
  };
  
  // Sélectionner la zone de contenu principal
  const contentArea = document.querySelector('main') || 
                      document.querySelector('.content') || 
                      document.querySelector('body');
  
  // Exclure certaines zones (navigation, footer, etc.)
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
        
        // Ne lier que la première occurrence de chaque mot-clé
        if (!linkedWords.has(keyLower)) {
          const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\