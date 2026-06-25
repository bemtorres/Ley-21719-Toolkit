// Translation Catalog
const TRANSLATIONS = {
  es: {
    "app-subtitle": "Auditor de Cumplimiento TI",
    "dimensions": "Dimensiones",
    "completion": "Progreso",
    "reset-audit": "Reiniciar",
    "nav-prev": "Anterior",
    "nav-next": "Siguiente",
    "nav-finish": "Ver Informe",
    "report-title": "Informe Meticuloso de Cumplimiento",
    "report-subtitle": "Resultados del diagnóstico del sistema de software frente a la ley.",
    "compliance-pct": "Cumplimiento",
    "stat-lbl-complies": "Cumple",
    "stat-lbl-partial": "Parcial",
    "stat-lbl-fails": "No Cumple",
    "tab-summary": "Resumen por Dimensión",
    "tab-actions": "Acciones Técnicas (Código)",
    "tab-governance": "Gobernanza y Ley",
    "breakdown-title": "Análisis de Cumplimiento por Dimensión",
    "tech-actions-title": "Recomendaciones de Desarrollo e Infraestructura",
    "tech-actions-desc": "Acciones concretas a implementar por el equipo de software en base de datos, backend y arquitectura.",
    "gov-title": "Acciones Organizativas y Gobernanza de Datos",
    "gov-desc": "Modelos de prevención de infracciones, DPO y políticas contractuales exigidas.",
    "btn-print": "Imprimir / Guardar PDF",
    "btn-back-edit": "Volver a Editar",
    "html-title": "Auditor de Cumplimiento Ley 21.719 - Chile",
    "complies-btn": "Cumple",
    "partial-btn": "Parcial",
    "fails-btn": "No Cumple",
    "criticality-label": "Criticidad:",
    "actions-list-label": "Acciones Técnicas de Refactorización:",
    "risk-high": "Riesgo Alto",
    "risk-medium": "Riesgo Medio",
    "risk-low": "Riesgo Bajo",
    "risk-high-desc": "El sistema expone graves brechas de cumplimiento con la Ley 21.719. Se arriesgan sanciones de hasta 20.000 UTM. Se requiere mitigación inmediata.",
    "risk-medium-desc": "El sistema cuenta con algunas salvaguardas, pero adolece de brechas técnicas de seguridad o derechos ARCO-P. Requiere refactorización planificada.",
    "risk-low-desc": "El sistema cumple de manera sólida con los estándares regulatorios. Se recomienda mantener auditorías periódicas y mantener el MPI certificado.",
    "dimension-txt": "Dimensión",
    "unanswered-alert": "Por favor responde todas las preguntas de esta dimensión antes de continuar.",
    "print-date-prefix": "Fecha de Auditoría: "
  },
  en: {
    "app-subtitle": "IT Compliance Auditor",
    "dimensions": "Dimensions",
    "completion": "Progress",
    "reset-audit": "Reset",
    "nav-prev": "Previous",
    "nav-next": "Next",
    "nav-finish": "View Report",
    "report-title": "Meticulous Compliance Report",
    "report-subtitle": "Diagnostic results of the software system against the law.",
    "compliance-pct": "Compliance",
    "stat-lbl-complies": "Complies",
    "stat-lbl-partial": "Partial",
    "stat-lbl-fails": "Does Not Comply",
    "tab-summary": "Summary by Dimension",
    "tab-actions": "Technical Actions (Code)",
    "tab-governance": "Governance & Law",
    "breakdown-title": "Compliance Analysis by Dimension",
    "tech-actions-title": "Development & Infrastructure Recommendations",
    "tech-actions-desc": "Concrete actions to implement by the software team in database, backend, and architecture.",
    "gov-title": "Organizational Actions & Data Governance",
    "gov-desc": "Infraction prevention models, DPO, and required contractual policies.",
    "btn-print": "Print / Save PDF",
    "btn-back-edit": "Back to Editor",
    "html-title": "Ley 21.719 IT Compliance Auditor - Chile",
    "complies-btn": "Complies",
    "partial-btn": "Partial",
    "fails-btn": "Fails",
    "criticality-label": "Criticality:",
    "actions-list-label": "Technical Refactoring Actions:",
    "risk-high": "High Risk",
    "risk-medium": "Medium Risk",
    "risk-low": "Low Risk",
    "risk-high-desc": "The system exposes severe compliance gaps under Ley 21.719. High risk of penalties up to 20,000 UTM. Immediate mitigation is required.",
    "risk-medium-desc": "The system has basic safeguards but lacks key technical controls for security or ARCO-P rights. Needs structured refactoring.",
    "risk-low-desc": "The system complies robustly with regulatory standards. Regular periodic audits and maintaining the certified MPI are recommended.",
    "dimension-txt": "Dimension",
    "unanswered-alert": "Please answer all questions in this dimension before proceeding.",
    "print-date-prefix": "Audit Date: "
  }
};

// Application State
let currentLanguage = "es";
let currentDimensionIndex = 0;
let answers = {}; // Maps question ID to "complies" | "partial" | "fails"

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load answers from localStorage if available
  const savedAnswers = localStorage.getItem("ley21719_audit_answers");
  if (savedAnswers) {
    try {
      answers = JSON.parse(savedAnswers);
    } catch (e) {
      answers = {};
    }
  }

  // Load language preference
  const savedLang = localStorage.getItem("ley21719_audit_lang");
  if (savedLang && (savedLang === "es" || savedLang === "en")) {
    currentLanguage = savedLang;
  }

  // Set initial UI elements
  setLanguage(currentLanguage);
  buildSidebarMenu();
  renderDimension();
  updateProgressBar();
  
  // Set default printing date
  const dateObj = new Date();
  const formattedDate = dateObj.toLocaleDateString(currentLanguage === "es" ? "es-CL" : "en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById("print-date").innerText = TRANVAL("print-date-prefix") + formattedDate;
});

// Switch Language
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("ley21719_audit_lang", lang);
  
  // Toggle Language Buttons
  document.getElementById("btn-lang-es").classList.toggle("active", lang === "es");
  document.getElementById("btn-lang-en").classList.toggle("active", lang === "en");
  
  // Translate static text marked with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      element.innerText = TRANSLATIONS[lang][key];
    }
  });

  // Translate document title
  document.title = TRANSLATIONS[lang]["html-title"];
  document.getElementById("html-title").innerText = TRANSLATIONS[lang]["html-title"];
  
  // Refresh dynamic contents
  buildSidebarMenu();
  renderDimension();
  updateProgressBar();

  // If report view is active, update report elements
  if (document.getElementById("report-view").classList.contains("active")) {
    generateReport();
  }
}

// Build Left Sidebar Menu items
function buildSidebarMenu() {
  const sidebarContainer = document.getElementById("sidebar-menu");
  sidebarContainer.innerHTML = "";
  
  window.AUDIT_FRAMEWORK.categories.forEach((category, index) => {
    const li = document.createElement("li");
    li.className = `sidebar-item ${index === currentDimensionIndex ? "active" : ""}`;
    
    // Check if all questions in this category are answered
    const categoryQuestions = category.questions;
    const isCategoryCompleted = categoryQuestions.every(q => answers[q.id] !== undefined);
    if (isCategoryCompleted) {
      li.classList.add("completed");
    }
    
    li.onclick = () => {
      // Allow switching directly to any category if we are in edit mode
      if (document.getElementById("wizard-view").classList.contains("active")) {
        currentDimensionIndex = index;
        renderDimension();
      }
    };
    
    const iconSpan = document.createElement("span");
    iconSpan.className = "sidebar-icon";
    if (isCategoryCompleted) {
      iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-success"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else {
      iconSpan.innerHTML = `<span>${index + 1}</span>`;
    }
    
    const textSpan = document.createElement("span");
    textSpan.innerText = category.title[currentLanguage];
    
    li.appendChild(iconSpan);
    li.appendChild(textSpan);
    sidebarContainer.appendChild(li);
  });
}

// Render Dimension Questions
function renderDimension() {
  const categories = window.AUDIT_FRAMEWORK.categories;
  const currentCategory = categories[currentDimensionIndex];
  
  // Update Header labels
  document.getElementById("current-dim-badge").innerText = `${TRANSLATIONS[currentLanguage]["dimension-txt"]} ${currentDimensionIndex + 1} / 6`;
  document.getElementById("current-dim-title").innerText = currentCategory.title[currentLanguage];
  document.getElementById("current-dim-desc").innerText = currentCategory.description[currentLanguage];
  
  // Update navigation buttons
  document.getElementById("btn-prev").disabled = currentDimensionIndex === 0;
  
  const nextBtn = document.getElementById("btn-next");
  if (currentDimensionIndex === categories.length - 1) {
    nextBtn.innerText = TRANSLATIONS[currentLanguage]["nav-finish"];
  } else {
    nextBtn.innerText = TRANSLATIONS[currentLanguage]["nav-next"];
  }
  
  // Load questions
  const questionsContainer = document.getElementById("questions-container");
  questionsContainer.innerHTML = "";
  
  currentCategory.questions.forEach(q => {
    const qItem = document.createElement("div");
    qItem.className = "question-item";
    qItem.id = `q-card-${q.id}`;
    
    // Header row
    const qHeader = document.createElement("div");
    qHeader.className = "question-header";
    
    const textSpan = document.createElement("span");
    textSpan.className = "question-text";
    textSpan.innerText = q.text[currentLanguage];
    
    const tagArea = document.createElement("div");
    tagArea.className = "question-tag-area";
    
    const codeBadge = document.createElement("span");
    codeBadge.className = "code-badge";
    codeBadge.innerText = q.code;
    
    const critBadge = document.createElement("span");
    critBadge.className = `criticality-badge ${q.criticality}`;
    critBadge.innerText = q.criticality;
    
    // Trigger code modal button
    const codeBtn = document.createElement("button");
    codeBtn.className = "btn-show-code";
    codeBtn.onclick = (e) => {
      e.preventDefault();
      openModal(q.id);
    };
    codeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
      <span>${currentLanguage === 'es' ? 'Código' : 'Code'}</span>
    `;
    
    tagArea.appendChild(codeBadge);
    tagArea.appendChild(critBadge);
    tagArea.appendChild(codeBtn);
    
    qHeader.appendChild(tagArea);
    qHeader.appendChild(textSpan);
    qItem.appendChild(qHeader);
    
    // Options grid (Modern segmented buttons)
    const optionsGrid = document.createElement("div");
    optionsGrid.className = "options-grid";
    
    const values = [
      { id: "complies", score: 100, label: "complies-btn" },
      { id: "partial", score: 50, label: "partial-btn" },
      { id: "fails", score: 0, label: "fails-btn" }
    ];
    
    values.forEach(val => {
      const label = document.createElement("label");
      label.className = "option-btn";
      
      const isSelected = answers[q.id] === val.id;
      if (isSelected) {
        label.classList.add(`selected-${val.id}`);
      }
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `question-${q.id}`;
      radio.value = val.id;
      radio.checked = isSelected;
      radio.onchange = () => selectOption(q.id, val.id);
      
      const titleSpan = document.createElement("span");
      titleSpan.className = "option-title";
      titleSpan.innerText = TRANSLATIONS[currentLanguage][val.label];
      
      const pointsSpan = document.createElement("span");
      pointsSpan.className = "option-points";
      pointsSpan.innerText = `${val.score}%`;
      
      label.appendChild(radio);
      label.appendChild(titleSpan);
      label.appendChild(pointsSpan);
      optionsGrid.appendChild(label);
    });
    
    qItem.appendChild(optionsGrid);
    questionsContainer.appendChild(qItem);
  });
  
  // Highlight active sidebar item
  buildSidebarMenu();
}

// User selects an option
function selectOption(questionId, value) {
  answers[questionId] = value;
  localStorage.setItem("ley21719_audit_answers", JSON.stringify(answers));
  
  // Re-render immediately to update styles
  renderDimension();
  updateProgressBar();
}

// Calculate Progress Percentage
function updateProgressBar() {
  let totalQuestions = 0;
  let answeredQuestions = 0;
  
  window.AUDIT_FRAMEWORK.categories.forEach(category => {
    category.questions.forEach(q => {
      totalQuestions++;
      if (answers[q.id] !== undefined) {
        answeredQuestions++;
      }
    });
  });
  
  const progressPct = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  
  document.getElementById("progress-pct").innerText = `${progressPct}%`;
  document.getElementById("progress-bar-fill").style.width = `${progressPct}%`;
  document.getElementById("progress-questions-stat").innerText = 
    currentLanguage === "es" 
      ? `${answeredQuestions} de ${totalQuestions} preguntas` 
      : `${answeredQuestions} of ${totalQuestions} questions`;
}

// Previous Step Button action
function prevDimension() {
  if (currentDimensionIndex > 0) {
    currentDimensionIndex--;
    renderDimension();
    window.scrollTo(0, 0);
  }
}

// Next Step / View Report Button action
function nextDimension() {
  const categories = window.AUDIT_FRAMEWORK.categories;
  const currentCategory = categories[currentDimensionIndex];
  
  // Validate that all questions in the current category are answered
  const isComplete = currentCategory.questions.every(q => answers[q.id] !== undefined);
  
  if (!isComplete) {
    alert(TRANSLATIONS[currentLanguage]["unanswered-alert"]);
    return;
  }
  
  if (currentDimensionIndex < categories.length - 1) {
    currentDimensionIndex++;
    renderDimension();
    window.scrollTo(0, 0);
  } else {
    // Audit completed, show report
    showReport();
  }
}

// Show Report view and hide wizard
function showReport() {
  document.getElementById("wizard-view").classList.remove("active");
  document.getElementById("report-view").classList.add("active");
  generateReport();
  window.scrollTo(0, 0);
}

// Back to Editor from Report view
function editAudit() {
  document.getElementById("report-view").classList.remove("active");
  document.getElementById("wizard-view").classList.add("active");
  renderDimension();
}

// Reset Audit state
function resetAudit() {
  if (confirm(currentLanguage === "es" ? "¿Seguro que deseas borrar todas las respuestas?" : "Are you sure you want to reset all answers?")) {
    answers = {};
    localStorage.removeItem("ley21719_audit_answers");
    currentDimensionIndex = 0;
    
    // Reset view to wizard
    document.getElementById("report-view").classList.remove("active");
    document.getElementById("wizard-view").classList.add("active");
    
    updateProgressBar();
    renderDimension();
    window.scrollTo(0, 0);
  }
}

// Tab switcher for report
function switchTab(tabId) {
  // Toggle buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.id === `tab-${tabId}`);
  });
  
  // Toggle content panes
  document.querySelectorAll(".tab-content").forEach(pane => {
    pane.classList.toggle("active", pane.id === `tab-content-${tabId}`);
  });
}

// Calculate score, risks, and generate detailed report markup
function generateReport() {
  let totalWeight = 0;
  let userScorePoints = 0;
  
  let countComplies = 0;
  let countPartial = 0;
  let countFails = 0;
  
  // Data lists to populate
  const dimensionsBreakdown = [];
  const techActions = [];
  const govActions = [];
  
  window.AUDIT_FRAMEWORK.categories.forEach(category => {
    let catTotalWeight = 0;
    let catUserPoints = 0;
    let catFailsOrPartials = [];
    
    category.questions.forEach(q => {
      totalWeight += q.weight;
      catTotalWeight += q.weight;
      
      const answerVal = answers[q.id];
      let multiplier = 0;
      
      if (answerVal === "complies") {
        multiplier = 1.0;
        countComplies++;
      } else if (answerVal === "partial") {
        multiplier = 0.5;
        countPartial++;
        catFailsOrPartials.push({ q, type: "partial" });
      } else {
        multiplier = 0.0;
        countFails++;
        catFailsOrPartials.push({ q, type: "fails" });
      }
      
      userScorePoints += (q.weight * multiplier);
      catUserPoints += (q.weight * multiplier);
    });
    
    const catScorePct = catTotalWeight > 0 ? Math.round((catUserPoints / catTotalWeight) * 100) : 0;
    dimensionsBreakdown.push({
      id: category.id,
      title: category.title[currentLanguage],
      score: catScorePct,
      answeredCount: category.questions.filter(q => answers[q.id] !== undefined).length
    });
    
    // Sort failed actions into technical and governance lists
    catFailsOrPartials.forEach(item => {
      const q = item.q;
      const isGov = q.code.startsWith("GOV");
      const listToPush = isGov ? govActions : techActions;
      
      listToPush.push({
        id: q.id,
        code: q.code,
        category: category.title[currentLanguage],
        text: q.text[currentLanguage],
        recommendation: q.recommendation[currentLanguage],
        actions: q.actions.map(act => act[currentLanguage]),
        criticality: q.criticality,
        type: item.type
      });
    });
  });
  
  // Calculate final score
  const finalScorePct = totalWeight > 0 ? Math.round((userScorePoints / totalWeight) * 100) : 0;
  
  // Update dashboard values
  document.getElementById("score-number").innerText = `${finalScorePct}%`;
  document.getElementById("stat-complies").innerText = countComplies;
  document.getElementById("stat-partial").innerText = countPartial;
  document.getElementById("stat-fails").innerText = countFails;
  
  // Set risk assessment text
  const riskTitle = document.getElementById("risk-level-title");
  const riskDesc = document.getElementById("risk-level-desc");
  const radialGauge = document.querySelector(".score-radial");
  
  if (finalScorePct >= 85) {
    riskTitle.innerText = TRANVAL("risk-low");
    riskTitle.className = "text-success";
    riskDesc.innerText = TRANVAL("risk-low-desc");
    radialGauge.style.borderColor = "var(--color-success)";
  } else if (finalScorePct >= 50) {
    riskTitle.innerText = TRANVAL("risk-medium");
    riskTitle.className = "text-warning";
    riskDesc.innerText = TRANVAL("risk-medium-desc");
    radialGauge.style.borderColor = "var(--color-warning)";
  } else {
    riskTitle.innerText = TRANVAL("risk-high");
    riskTitle.className = "text-danger";
    riskDesc.innerText = TRANVAL("risk-high-desc");
    radialGauge.style.borderColor = "var(--color-danger)";
  }
  
  // Render Tab 1: Dimensions breakdown
  const breakdownList = document.getElementById("dimensions-breakdown-list");
  breakdownList.innerHTML = "";
  dimensionsBreakdown.forEach(dim => {
    const row = document.createElement("div");
    row.className = "breakdown-row";
    
    const info = document.createElement("div");
    info.className = "breakdown-info";
    
    const titleLbl = document.createElement("span");
    titleLbl.className = "breakdown-title-lbl";
    titleLbl.innerText = dim.title;
    
    const countLbl = document.createElement("span");
    countLbl.className = "breakdown-count";
    countLbl.innerText = `${dim.answeredCount} / 4 ${currentLanguage === "es" ? "controles completados" : "controls checked"}`;
    
    info.appendChild(titleLbl);
    info.appendChild(countLbl);
    
    const barFill = document.createElement("div");
    barFill.className = "breakdown-bar-bg";
    const fillInner = document.createElement("div");
    fillInner.className = "breakdown-bar-fill";
    fillInner.style.width = `${dim.score}%`;
    
    // Color thresholds for category bars
    if (dim.score >= 85) fillInner.style.backgroundColor = "var(--color-success)";
    else if (dim.score >= 50) fillInner.style.backgroundColor = "var(--color-warning)";
    else fillInner.style.backgroundColor = "var(--color-danger)";
    
    barFill.appendChild(fillInner);
    
    const scoreVal = document.createElement("span");
    scoreVal.className = "breakdown-score";
    scoreVal.innerText = `${dim.score}%`;
    
    row.appendChild(info);
    row.appendChild(barFill);
    row.appendChild(scoreVal);
    breakdownList.appendChild(row);
  });
  
  // Render Tab 2: Technical Refactoring Recommendations
  renderActionsTab(techActions, "tech-actions-list");
  
  // Render Tab 3: Governance Recommendations
  renderActionsTab(govActions, "gov-actions-list");
}

// Sub-render function to output audit cards into tabs
function renderActionsTab(actionsList, targetId) {
  const container = document.getElementById(targetId);
  container.innerHTML = "";
  
  if (actionsList.length === 0) {
    const cleanMsg = document.createElement("p");
    cleanMsg.className = "text-success font-semibold";
    cleanMsg.innerText = currentLanguage === "es" 
      ? "✓ ¡Excelente! No se encontraron brechas abiertas en esta sección." 
      : "✓ Excellent! No open compliance gaps detected in this section.";
    container.appendChild(cleanMsg);
    return;
  }
  
  actionsList.forEach(item => {
    const card = document.createElement("div");
    card.className = `action-card ${item.criticality}-risk`;
    
    const header = document.createElement("div");
    header.className = "action-card-header";
    
    const code = document.createElement("span");
    code.className = "code-badge";
    code.innerText = item.code;
    
    const crit = document.createElement("span");
    crit.className = `criticality-badge ${item.criticality}`;
    crit.innerText = `${TRANVAL("criticality-label")} ${item.criticality}`;
    
    const title = document.createElement("h4");
    title.className = "action-card-title";
    title.innerText = item.text;
    
    header.appendChild(code);
    header.appendChild(crit);
    header.appendChild(title);
    card.appendChild(header);
    
    const desc = document.createElement("p");
    desc.className = "action-desc-text";
    desc.innerHTML = `<strong>${currentLanguage === "es" ? "Acción recomendada: " : "Recommended action: "}</strong>${item.recommendation}`;
    card.appendChild(desc);
    
    // Steps lists
    const stepsTitle = document.createElement("div");
    stepsTitle.className = "action-steps-title";
    stepsTitle.innerText = TRANVAL("actions-list-label");
    card.appendChild(stepsTitle);
    
    const stepsList = document.createElement("ul");
    stepsList.className = "action-steps-list";
    
    item.actions.forEach(action => {
      const li = document.createElement("li");
      li.className = "action-step-item";
      li.innerText = action;
      stepsList.appendChild(li);
    });
    
    card.appendChild(stepsList);
    
    // Trigger code modal button in report
    const reportCodeBtn = document.createElement("button");
    reportCodeBtn.className = "btn-show-code-report";
    reportCodeBtn.onclick = (e) => {
      e.preventDefault();
      openModal(item.id);
    };
    reportCodeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
      <span>${currentLanguage === 'es' ? 'Ver Ejemplo de Código' : 'View Code Example'}</span>
    `;
    card.appendChild(reportCodeBtn);
    
    container.appendChild(card);
  });
}

// Quick translation helper
function TRANVAL(key) {
  return TRANSLATIONS[currentLanguage][key] || key;
}

// ==========================================================================
// Modal & Code Exporter Operations Logic
// ==========================================================================
let activeModalQuestionId = null;
let activeModalLanguage = "python";

// Open the explanation/code modal
function openModal(questionId) {
  // Find question in framework
  let foundQuestion = null;
  window.AUDIT_FRAMEWORK.categories.forEach(category => {
    category.questions.forEach(q => {
      if (q.id === questionId || q.code === questionId) {
        foundQuestion = q;
      }
    });
  });
  
  if (!foundQuestion) return;
  
  activeModalQuestionId = foundQuestion.id;
  
  // Set modal texts
  document.getElementById("modal-code-badge").innerText = foundQuestion.code;
  document.getElementById("modal-title").innerText = foundQuestion.text[currentLanguage];
  document.getElementById("modal-explanation-text").innerText = foundQuestion.recommendation[currentLanguage];
  
  // Render active language code
  renderModalCode();
  
  // Open modal
  document.getElementById("code-modal").classList.add("active");
}

// Close the modal
function closeModal() {
  document.getElementById("code-modal").classList.remove("active");
  activeModalQuestionId = null;
}

// Switch code language inside the modal
function switchModalLanguage(lang) {
  activeModalLanguage = lang;
  
  // Update tabs active state
  const languages = ["python", "js", "php", "go"];
  languages.forEach(l => {
    document.getElementById(`btn-tab-${l}`).classList.toggle("active", l === lang);
  });
  
  renderModalCode();
}

// Render the code snippet for the active language
function renderModalCode() {
  let foundQuestion = null;
  window.AUDIT_FRAMEWORK.categories.forEach(category => {
    category.questions.forEach(q => {
      if (q.id === activeModalQuestionId) {
        foundQuestion = q;
      }
    });
  });
  
  if (!foundQuestion || !foundQuestion.snippets) return;
  
  const snippet = foundQuestion.snippets[activeModalLanguage] || "";
  
  // Update filename tag
  const extensions = { python: "main.py", js: "app.js", php: "index.php", go: "main.go" };
  document.getElementById("editor-filename").innerText = extensions[activeModalLanguage] || "code.txt";
  
  // Load and apply basic markup highlighting
  const codeContentArea = document.getElementById("code-content-area");
  codeContentArea.innerHTML = highlightSyntax(snippet.trim());
}

// Simple syntax highlighters for visual editor look
function highlightSyntax(code) {
  // 1. Escapes HTML tags
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    
  const comments = [];
  const strings = [];
  
  // 2. Extract comments and replace with placeholders
  escaped = escaped.replace(/(#.*|\/\/.*)/g, (match) => {
    comments.push(match);
    return `__COMMENT_PLACEHOLDER_${comments.length - 1}__`;
  });
  
  // 3. Extract strings and replace with placeholders
  escaped = escaped.replace(/(["'`])(.*?)\1/g, (match) => {
    strings.push(match);
    return `__STRING_PLACEHOLDER_${strings.length - 1}__`;
  });
  
  // 4. Highlight keywords in a single pass to avoid double-tag replacement
  const keywords = [
    "def", "class", "import", "from", "return", "if", "not", "else", "elif", "try", "except", "finally", "raise",
    "const", "let", "function", "async", "await", "export", "var",
    "prepare", "execute", "select", "insert", "delete", "update", "where", "values",
    "package", "type", "struct", "func", "nil", "defer", "go"
  ];
  
  const keywordsRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  escaped = escaped.replace(keywordsRegex, '<span class="keyword">$1</span>');
  
  // Highlight php PDO object
  escaped = escaped.replace(/(\$pdo)/g, '<span class="keyword">$1</span>');
  
  // 5. Restore strings
  strings.forEach((str, index) => {
    escaped = escaped.replace(`__STRING_PLACEHOLDER_${index}__`, `<span class="string">${str}</span>`);
  });
  
  // 6. Restore comments
  comments.forEach((com, index) => {
    escaped = escaped.replace(`__COMMENT_PLACEHOLDER_${index}__`, `<span class="comment">${com}</span>`);
  });
  
  return escaped;
}

// Copy Code to Clipboard
function copyCodeToClipboard() {
  const codeArea = document.getElementById("code-content-area");
  if (!codeArea) return;
  const codeText = codeArea.innerText;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeText)
      .then(() => showCopyFeedback())
      .catch(() => fallbackCopy(codeText));
  } else {
    fallbackCopy(codeText);
  }
}

function fallbackCopy(text) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  tempTextArea.style.top = "0";
  tempTextArea.style.left = "0";
  tempTextArea.style.position = "fixed";
  document.body.appendChild(tempTextArea);
  tempTextArea.focus();
  tempTextArea.select();
  
  try {
    document.execCommand("copy");
  } catch (err) {
    console.warn("Fallback copy failed: ", err);
  }
  
  document.body.removeChild(tempTextArea);
  showCopyFeedback();
}

function showCopyFeedback() {
  const copyBtnText = document.getElementById("btn-copy-text");
  if (!copyBtnText) return;
  
  const originalText = copyBtnText.innerText;
  copyBtnText.innerText = currentLanguage === "es" ? "¡Copiado!" : "Copied!";
  
  const copyBtn = document.querySelector(".btn-copy-code");
  if (copyBtn) copyBtn.disabled = true;
  
  setTimeout(() => {
    copyBtnText.innerText = originalText;
    if (copyBtn) copyBtn.disabled = false;
  }, 1500);
}
