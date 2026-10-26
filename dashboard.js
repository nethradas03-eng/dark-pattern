/**
 * ClickTrap - Companion Web Dashboard Controller
 * Simple, direct website scanner, report inspector, history manager, and dark pattern handbook.
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // Navigation Items
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');
  const pageHeading = document.getElementById('page-title');
  const pageSubheading = document.getElementById('page-sub');

  // Scanner Form Elements
  const urlScanForm = document.getElementById('url-scan-form');
  const targetUrlInput = document.getElementById('target-url-input');
  const btnSubmitUrlScan = document.getElementById('btn-submit-url-scan');
  const scanBtnIcon = document.getElementById('scan-btn-icon');
  const scanBtnText = document.getElementById('scan-btn-text');
  const scanStatusAlert = document.getElementById('scan-status-alert');

  // HTML Paste Elements
  const btnTogglePaste = document.getElementById('btn-toggle-paste');
  const pasteHtmlContainer = document.getElementById('paste-html-container');
  const rawHtmlInput = document.getElementById('raw-html-input');
  const btnScanRawHtml = document.getElementById('btn-scan-raw-html');

  // Quick Test Fixture Pills
  const samplePillBtns = document.querySelectorAll('.sample-pill-btn');

  // Modals & Triggers
  const guideModal = document.getElementById('guide-modal');
  const btnQuickScanGuide = document.getElementById('btn-quick-scan-guide');
  const btnCloseGuide = document.getElementById('btn-close-guide');

  // Overview Stats
  const statTotalScans = document.getElementById('stat-total-scans');
  const statUniqueSites = document.getElementById('stat-unique-sites');
  const statTotalFindings = document.getElementById('stat-total-findings');
  const statAvgScore = document.getElementById('stat-avg-score');
  const categoryBarsContainer = document.getElementById('category-bars-container');
  const riskDistributionContainer = document.getElementById('risk-distribution-container');
  const overviewRecentTableBody = document.getElementById('overview-recent-table-body');

  // History Elements
  const historySearchInput = document.getElementById('history-search-input');
  const historyRiskFilter = document.getElementById('history-risk-filter');
  const historyTableBody = document.getElementById('history-table-body');
  const btnExportHistory = document.getElementById('btn-export-history');
  const btnClearHistoryPage = document.getElementById('btn-clear-history-page');

  // Report Elements
  const reportEmptyState = document.getElementById('report-empty-state');
  const reportActiveContainer = document.getElementById('report-active-container');
  const reportDomain = document.getElementById('report-domain');
  const reportUrl = document.getElementById('report-url');
  const reportTimestamp = document.getElementById('report-timestamp');
  const reportScoreNum = document.getElementById('report-score-num');
  const reportRiskBadge = document.getElementById('report-risk-badge');
  const reportRawPoints = document.getElementById('report-raw-points');
  const reportSummaryText = document.getElementById('report-summary-text');
  const reportCategoryTags = document.getElementById('report-category-tags');
  const reportFindingsCount = document.getElementById('report-findings-count');
  const reportFindingsList = document.getElementById('report-findings-list');

  // Settings Elements
  const dashPrefHighlight = document.getElementById('dash-pref-highlight');
  const dashPrefHistory = document.getElementById('dash-pref-history');
  const btnDashClearData = document.getElementById('btn-dash-clear-data');

  // Initialize Detector in browser
  let detector = null;
  if (typeof window.ClickTrapDetector === 'function' && window.ClickTrapRules) {
    detector = new window.ClickTrapDetector(window.ClickTrapRules);
  }

  function getDetector() {
    if (!detector && typeof window.ClickTrapDetector === 'function' && window.ClickTrapRules) {
      detector = new window.ClickTrapDetector(window.ClickTrapRules);
    }
    return detector;
  }

  // Pre-compiled synthetic fixtures for instant 100% offline & GitHub Pages testing
  const EMBEDDED_FIXTURES = {
    'test-pages/fake-urgency.html': `<!DOCTYPE html>
<html><head><title>FlashSale Direct</title></head><body>
<div class="countdown-box">
  <h3>⚡ FLASH SALE ENDS SOON! ⚡</h3>
  <p>Offer expires in 2 minutes! Prices increase in 10 minutes!</p>
  <div class="timer" id="demo-timer">01:58</div>
  <p>Buy now before the timer ends!</p>
</div>
<div>
  <h2>AcousticPro Noise-Canceling Headphones</h2>
  <span style="color:#16A34A; font-size:24px;">$49.99</span>
  <span style="text-decoration:line-through; color:#94A3B8;">$199.99</span>
  <p style="color:#DC2626; font-weight:600;">Last chance to purchase! Time is running out!</p>
  <button class="btn btn-danger">Claim Deal Now (Before Timer Ends)</button>
</div>
</body></html>`,

    'test-pages/scarcity.html': `<!DOCTYPE html>
<html><head><title>Skyline Suites Booking</title></head><body>
<h2>Skyline Luxury Suite – Sea View</h2>
<div class="stock-alert">🔥 High Demand: Only 1 room left in stock at this discounted rate! Almost sold out!</div>
<div style="background:#EFF6FF; padding:10px;">👁️ Popular choice: 18 people are viewing this right now! Booked 8 times in the last hour!</div>
<button class="btn btn-primary">Reserve Now – Only 1 item left</button>
</body></html>`,

    'test-pages/cookie-consent.html': `<!DOCTYPE html>
<html><head><title>GlobalNews Portal Privacy</title></head><body>
<div class="cookie-banner" id="cookie-banner">
  <h4>We Value Your Browsing Privacy</h4>
  <p>We and our 428 third-party ad partners store cookies on your device. I accept for the best experience.</p>
  <label><input type="checkbox" id="track-cb" checked /> Marketing and Behavioral Profiling Tracking</label>
  <div class="cookie-actions">
    <a href="#" class="link-secondary">Manage Options</a>
    <button class="btn btn-success" style="padding:12px 28px;">Accept All Cookies</button>
  </div>
</div>
</body></html>`,

    'test-pages/hidden-costs.html': `<!DOCTYPE html>
<html><head><title>Express Tickets Checkout</title></head><body>
<h2>Order Review & Final Payment</h2>
<div>General Admission Ticket: $45.00</div>
<div style="color:#DC2626;">Mandatory service fee added at checkout: $14.50</div>
<div style="color:#DC2626;">Cleaning fee: $8.00</div>
<label><input type="checkbox" checked /> Add Ticket Damage Protection Warranty for $5.99</label>
<p>* VIP club membership renews automatically at $19 per month after trial.</p>
<button class="btn btn-primary">Complete Order ($73.49)</button>
</body></html>`,

    'test-pages/confirmshaming.html': `<!DOCTYPE html>
<html><head><title>TrendyStyle Fashion Discount</title></head><body>
<div class="modal-content">
  <h3>Wait! Get 25% Off Your Entire Order!</h3>
  <button class="btn btn-primary">Claim My 25% Discount</button>
  <a href="#">No thanks, I don't care about saving money</a>
  <a href="#">No, I prefer paying full price and missing out</a>
  <label><input type="checkbox" /> Uncheck this box if you do not wish to receive 3 daily promotional marketing calls.</label>
</div>
</body></html>`,

    'test-pages/cancellation-obstacles.html': `<!DOCTYPE html>
<html><head><title>CloudStream Media Account Settings</title></head><body>
<h3>Subscription Status: Active</h3>
<div style="background:#FEF2F2; color:#DC2626;">⚠️ Are you sure? You will lose all your benefits and saved data forever!</div>
<p style="color:#DC2626; font-weight:600;">To cancel, please call our 1-800 support line between 9am - 10am EST Monday through Wednesday.</p>
<p>Alternatively, cancellation requires mailing a written letter via certified post to our corporate headquarters in Delaware.</p>
<button class="btn btn-primary">Keep Plan (Pause subscription instead of canceling)</button>
</body></html>`,

    'test-pages/normal-marketing.html': `<!DOCTYPE html>
<html><head><title>CleanTech Living Desk Lamp</title></head><body>
<h2>Smart Ambient LED Desk Lamp</h2>
<div>Product Item: $39.99</div>
<div>Standard Estimated Shipping: $4.99 (Free for orders over $50)</div>
<div>Estimated Total: $44.98</div>
<p>All items include a hassle-free 30-day money-back guarantee. You can cancel your subscription at any time with one click from your account dashboard.</p>
<div class="cookie-banner" id="clean-cookie-banner">
  <h4>Cookie & Privacy Preferences</h4>
  <button class="btn btn-outline">Reject All</button>
  <button class="btn btn-success">Accept All</button>
</div>
</body></html>`,

    'simulated-store': `<!DOCTYPE html>
<html><head><title>ApexCart Luxury Electronics</title></head><body>
<div class="flash-sale-banner" style="background:#FEF2F2; padding:12px; border:2px solid #FCA5A5;">
  <span style="color:#DC2626; font-weight:800;">⚡ MEGA FLASH SALE! </span>
  <span>Offer expires in 2 minutes! Prices increase in 10 minutes!</span>
  <span class="timer" style="font-family:monospace; font-weight:bold; color:#DC2626;">01:54</span>
  <p style="font-size:12px; margin-top:4px;">Buy now before the timer ends! Time is running out!</p>
</div>
<div class="product-box" style="margin-top:20px;">
  <h2>ApexVision 4K OLED Smart Display (55")</h2>
  <div class="stock-warning" style="background:#FFFBEB; padding:10px; margin:12px 0; color:#B45309; font-weight:bold;">
    🔥 High Demand: Only 1 item left in stock at this discounted rate! Almost sold out!
  </div>
  <div style="background:#EFF6FF; padding:8px; color:#1E40AF; margin-bottom:12px;">
    👁️ 24 shoppers are viewing this deal right now! Booked 9 times in the last hour!
  </div>
  <div class="price-section" style="margin-bottom:12px;">
    <span style="font-size:26px; font-weight:bold; color:#16A34A;">$399.00</span>
    <span style="text-decoration:line-through; color:#94A3B8; margin-left:8px;">$999.00</span>
    <span style="background:#FEE2E2; color:#DC2626; padding:2px 6px; font-weight:bold; font-size:12px;">60% OFF</span>
  </div>
  <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; margin:12px 0;">
    <div style="color:#DC2626; font-weight:bold;">Mandatory service fee added at checkout: $28.50</div>
    <div style="color:#DC2626; font-size:13px;">Cleaning fee: $12.00</div>
    <label style="display:flex; align-items:center; gap:8px; margin-top:8px; font-size:13px; color:#1E40AF;">
      <input type="checkbox" checked /> Automatically add 2-Year Extended Screen Replacement Warranty for $24.99
    </label>
    <p style="font-size:11px; color:#64748B; margin-top:4px;">* VIP club membership renews automatically at $19 per month after trial.</p>
  </div>
  <button class="btn btn-primary" style="padding:14px 28px; font-size:16px;">
    Claim Deal Now (Before Timer Ends)
  </button>
  <div style="margin-top:14px;">
    <a href="#" style="color:#94A3B8; font-size:12px; text-decoration:underline;">No thanks, I don't care about saving money</a>
  </div>
</div>
</body></html>`
  };

  // State
  let storedScans = [];
  let userSettings = { highlightingEnabled: true, historyEnabled: true };
  let selectedScanReport = null;

  // -------------------------------------------------------------
  // 1. DATA ACCESS & STORAGE ADAPTER
  // -------------------------------------------------------------
  async function loadData() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      try {
        const data = await chrome.storage.local.get(['scanHistory', 'settings']);
        storedScans = data.scanHistory || [];
        userSettings = data.settings || userSettings;
      } catch (err) {
        fallbackLocalStorage();
      }
    } else {
      fallbackLocalStorage();
    }

    if (dashPrefHighlight) dashPrefHighlight.checked = userSettings.highlightingEnabled !== false;
    if (dashPrefHistory) dashPrefHistory.checked = userSettings.historyEnabled !== false;

    renderOverview();
    renderHistoryTable();
  }

  function fallbackLocalStorage() {
    try {
      const scansStr = localStorage.getItem('clicktrap_scans');
      storedScans = scansStr ? JSON.parse(scansStr) : [];
      const setStr = localStorage.getItem('clicktrap_settings');
      userSettings = setStr ? JSON.parse(setStr) : userSettings;
    } catch (e) {
      storedScans = [];
    }
  }

  async function persistScans() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ scanHistory: storedScans });
    } else {
      localStorage.setItem('clicktrap_scans', JSON.stringify(storedScans));
    }
    renderOverview();
    renderHistoryTable();
  }

  async function persistSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ settings: userSettings });
    } else {
      localStorage.setItem('clicktrap_settings', JSON.stringify(userSettings));
    }
  }

  // -------------------------------------------------------------
  // 2. NAVIGATION & TABS
  // -------------------------------------------------------------
  const pageTitles = {
    scanner: { title: 'Scan Any Website', sub: 'Enter a website URL or select a test page to inspect deceptive UI patterns.' },
    overview: { title: 'Overview Dashboard', sub: 'Real-time telemetry and deceptive pattern distribution across inspected websites.' },
    report: { title: 'Forensic Scan Report', sub: 'In-depth evidence, element selectors, and actionable advice for a specific webpage.' },
    history: { title: 'Local Scan History', sub: 'Filter, inspect, and manage forensic scans stored securely on your machine.' },
    learn: { title: 'Dark Pattern Defense Handbook', sub: 'Educational cards and defense strategies for all six recognized deception categories.' },
    settings: { title: 'Settings & Privacy Transparency', sub: 'Client-side permission breakdowns, storage controls, and data erasure.' }
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageKey = item.getAttribute('data-page');
      switchPage(pageKey);
    });
  });

  function switchPage(pageKey) {
    navItems.forEach(n => n.classList.toggle('active', n.getAttribute('data-page') === pageKey));
    viewPanels.forEach(p => p.classList.toggle('active', p.id === `page-${pageKey}`));

    if (pageTitles[pageKey]) {
      if (pageHeading) pageHeading.textContent = pageTitles[pageKey].title;
      if (pageSubheading) pageSubheading.textContent = pageTitles[pageKey].sub;
    }

    if (pageKey === 'overview') renderOverview();
    if (pageKey === 'history') renderHistoryTable();
    if (pageKey === 'learn') renderEducationalCards();
  }

  // -------------------------------------------------------------
  // 3. SCANNER ENGINE: SCAN ANY WEBSITE
  // -------------------------------------------------------------
  if (urlScanForm) {
    urlScanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetUrl = targetUrlInput.value.trim();
      if (!targetUrl) return;
      await executeWebsiteScan(targetUrl);
    });
  }

  // Quick sample pill buttons
  samplePillBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const sampleUrl = btn.getAttribute('data-url');
      if (sampleUrl) {
        targetUrlInput.value = sampleUrl;
        await executeWebsiteScan(sampleUrl);
      }
    });
  });

  // Simulated Live Store button
  const btnSimStore = document.getElementById('btn-sim-store');
  if (btnSimStore) {
    btnSimStore.addEventListener('click', () => {
      targetUrlInput.value = 'https://demo.apex-store.local/deal';
      scanHtmlLocally(EMBEDDED_FIXTURES['simulated-store'], 'Simulated Online MegaStore (Live Demo)');
    });
  }

  // File Upload handling
  const btnUploadFile = document.getElementById('btn-upload-file');
  const htmlFileInput = document.getElementById('html-file-input');
  if (btnUploadFile && htmlFileInput) {
    btnUploadFile.addEventListener('click', () => {
      htmlFileInput.click();
    });

    htmlFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (readEvt) => {
        const content = readEvt.target.result;
        targetUrlInput.value = file.name;
        scanHtmlLocally(content, file.name);
      };
      reader.onerror = () => {
        showScanAlert('Could not read the uploaded HTML file.', 'error');
      };
      reader.readAsText(file);
    });
  }

  // Drag and Drop HTML files on hero card
  const scannerHeroCard = document.querySelector('.scanner-hero-card');
  if (scannerHeroCard) {
    scannerHeroCard.addEventListener('dragover', (e) => {
      e.preventDefault();
      scannerHeroCard.classList.add('drag-over');
    });
    scannerHeroCard.addEventListener('dragleave', (e) => {
      e.preventDefault();
      scannerHeroCard.classList.remove('drag-over');
    });
    scannerHeroCard.addEventListener('drop', (e) => {
      e.preventDefault();
      scannerHeroCard.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (readEvt) => {
          const content = readEvt.target.result;
          targetUrlInput.value = file.name;
          scanHtmlLocally(content, file.name);
        };
        reader.readAsText(file);
      }
    });
  }

  // Toggle HTML paste box
  if (btnTogglePaste && pasteHtmlContainer) {
    btnTogglePaste.addEventListener('click', () => {
      pasteHtmlContainer.classList.toggle('hidden');
      btnTogglePaste.textContent = pasteHtmlContainer.classList.contains('hidden')
        ? 'Show HTML Paste Box'
        : 'Hide HTML Paste Box';
    });
  }

  // Scan raw HTML button
  if (btnScanRawHtml && rawHtmlInput) {
    btnScanRawHtml.addEventListener('click', () => {
      const rawHtml = rawHtmlInput.value.trim();
      if (!rawHtml) {
        showScanAlert('Please paste some HTML code to inspect.', 'error');
        return;
      }
      scanHtmlLocally(rawHtml, 'Pasted HTML Snippet');
    });
  }

  /**
   * Safe timeout signal creator compatible with all browsers
   */
  function createTimeoutSignal(timeoutMs) {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      const id = setTimeout(() => {
        try { controller.abort(); } catch (e) {}
      }, timeoutMs);
      return { signal: controller.signal, cleanup: () => clearTimeout(id) };
    }
    return { signal: undefined, cleanup: () => {} };
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  /**
   * Main scan routine: Handles live remote websites, local server API, and local test files
   */
  async function executeWebsiteScan(rawUrl) {
    let targetUrl = (rawUrl || '').trim();
    if (!targetUrl) return;

    // 1. Direct check against embedded synthetic fixtures (100% offline & instant)
    const normalizedKey = targetUrl.replace(/^\.\.\//, '').replace(/^\.\//, '');
    if (EMBEDDED_FIXTURES[normalizedKey]) {
      setScanLoading(true, `Analyzing test fixture...`);
      setTimeout(() => {
        scanHtmlLocally(EMBEDDED_FIXTURES[normalizedKey], normalizedKey);
        setScanLoading(false);
      }, 100);
      return;
    }

    // 2. If URL is a local test fixture or relative file
    if (targetUrl.includes('test-pages/') || targetUrl.endsWith('.html')) {
      const cleanPath = targetUrl.replace(/^\.\.\//, '');
      if (EMBEDDED_FIXTURES[cleanPath]) {
        setScanLoading(true, `Analyzing test fixture...`);
        setTimeout(() => {
          scanHtmlLocally(EMBEDDED_FIXTURES[cleanPath], cleanPath);
          setScanLoading(false);
        }, 100);
        return;
      }

      try {
        setScanLoading(true, `Loading local test page...`);
        const resp = await fetch(cleanPath);
        if (resp.ok) {
          const html = await resp.text();
          scanHtmlLocally(html, cleanPath);
          setScanLoading(false);
          return;
        }
      } catch (fileErr) {
        // Fallback to embedded fixture if available
        if (EMBEDDED_FIXTURES[cleanPath]) {
          scanHtmlLocally(EMBEDDED_FIXTURES[cleanPath], cleanPath);
          setScanLoading(false);
          return;
        }
      }
    }

    // Ensure full URL scheme
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setScanLoading(true, `Connecting to ${targetUrl}...`);
    showScanAlert(`Connecting to ${targetUrl}...`, 'info');

    // 3. If running with ClickTrap local backend server (server.js on localhost)
    try {
      const { signal, cleanup } = createTimeoutSignal(8000);
      const apiResponse = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
        signal
      });
      cleanup();

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        if (result.report) {
          handleScanSuccess(result.report);
          setScanLoading(false);
          return;
        }
      }
    } catch (serverErr) {
      // Local server not running, continue to client fallback
    }

    // 4. Direct browser fetch (works if target domain enables CORS)
    try {
      const { signal, cleanup } = createTimeoutSignal(5000);
      const directResp = await fetch(targetUrl, { signal });
      cleanup();

      if (directResp.ok) {
        const html = await directResp.text();
        if (html && html.length > 50) {
          scanHtmlLocally(html, targetUrl);
          setScanLoading(false);
          return;
        }
      }
    } catch (corsErr) {
      // Direct CORS blocked, proceed to proxies
    }

    // 5. Waterfall of reliable CORS proxies for static hosting (GitHub Pages)
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        setScanLoading(true, `Inspecting via security proxy (${i + 1}/${proxies.length})...`);
        const { signal, cleanup } = createTimeoutSignal(8000);
        const proxyResp = await fetch(proxies[i], { signal });
        cleanup();

        if (proxyResp.ok) {
          const html = await proxyResp.text();
          if (html && html.trim().length > 100 && !html.includes('allorigins: error')) {
            scanHtmlLocally(html, targetUrl);
            setScanLoading(false);
            return;
          }
        }
      } catch (proxyErr) {
        // Try next proxy
      }
    }

    // 6. Graceful, helpful recovery when external live fetch is restricted
    setScanLoading(false);
    showScanAlertHtml(`
      <div style="margin-bottom:6px;">
        <strong>⚠️ Cannot directly load "${escapeHtml(targetUrl)}" due to browser cross-origin policy (CORS) on static GitHub Pages.</strong>
      </div>
      <p style="font-size:12px; opacity:0.9; margin-bottom:10px;">
        Commercial websites (Amazon, Booking, Nike) block third-party proxies. You can inspect it immediately using any of these simple methods:
      </p>
      <div class="scan-alert-actions">
        <button type="button" class="btn btn-primary btn-sm" id="alert-btn-sim">⚡ Test with Live Simulation Store</button>
        <button type="button" class="btn btn-secondary btn-sm" id="alert-btn-paste">📋 Paste Webpage HTML</button>
        <button type="button" class="btn btn-secondary btn-sm" id="alert-btn-file">📁 Upload .html File</button>
      </div>
    `, 'error');

    // Connect alert actions
    const alertBtnSim = document.getElementById('alert-btn-sim');
    const alertBtnPaste = document.getElementById('alert-btn-paste');
    const alertBtnFile = document.getElementById('alert-btn-file');

    if (alertBtnSim) {
      alertBtnSim.onclick = () => {
        targetUrlInput.value = 'https://demo.apex-store.local/deal';
        scanHtmlLocally(EMBEDDED_FIXTURES['simulated-store'], 'Simulated Online MegaStore (Live Demo)');
      };
    }
    if (alertBtnPaste && pasteHtmlContainer) {
      alertBtnPaste.onclick = () => {
        pasteHtmlContainer.classList.remove('hidden');
        if (rawHtmlInput) rawHtmlInput.focus();
        pasteHtmlContainer.scrollIntoView({ behavior: 'smooth' });
      };
    }
    if (alertBtnFile && htmlFileInput) {
      alertBtnFile.onclick = () => {
        htmlFileInput.click();
      };
    }
  }

  /**
   * Parse HTML string in browser DOM and run detector engine
   */
  function scanHtmlLocally(htmlString, sourceUrl) {
    try {
      const engine = getDetector();
      if (!engine) {
        showScanAlert('Detector engine is loading. Please try again in a moment.', 'error');
        return;
      }

      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(htmlString, 'text/html');
      const report = engine.scanDocument(parsedDoc, sourceUrl);

      // Clean serialized report
      const cleanReport = {
        id: `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        domain: report.domain || 'webpage',
        url: sourceUrl,
        timestamp: new Date().toISOString(),
        score: report.score,
        rawScore: report.rawScore,
        level: report.level,
        findingsCount: report.findingsCount,
        summary: report.summary,
        categoryDistribution: report.categoryDistribution,
        findings: report.findings.map(f => ({
          id: f.id,
          ruleId: f.ruleId,
          ruleName: f.ruleName,
          category: f.category,
          categoryName: f.categoryName,
          severity: f.severity,
          weight: f.weight,
          evidence: f.evidence,
          explanation: f.explanation,
          recommendedAction: f.recommendedAction
        }))
      };

      handleScanSuccess(cleanReport);
    } catch (e) {
      showScanAlert(`Failed to analyze HTML: ${e.message}`, 'error');
    }
  }

  /**
   * Save successful scan, notify user, and transition to report view
   */
  async function handleScanSuccess(report) {
    showScanAlert(`Scan complete! Found ${report.findingsCount} signals (${report.level.label}). Opening report...`, 'success');

    // Add to history
    storedScans = [report, ...storedScans.filter(s => s.url !== report.url)].slice(0, 100);
    await persistScans();

    setTimeout(() => {
      openReport(report);
      scanStatusAlert.classList.add('hidden');
    }, 500);
  }

  function setScanLoading(loading, message = 'Scanning...') {
    if (loading) {
      btnSubmitUrlScan.disabled = true;
      scanBtnIcon.textContent = '⏳';
      scanBtnText.textContent = message;
    } else {
      btnSubmitUrlScan.disabled = false;
      scanBtnIcon.textContent = '🔍';
      scanBtnText.textContent = 'Scan Website Now';
    }
  }

  function showScanAlert(text, type = 'info') {
    scanStatusAlert.textContent = text;
    scanStatusAlert.className = `scan-alert ${type}`;
    scanStatusAlert.classList.remove('hidden');
  }

  function showScanAlertHtml(html, type = 'info') {
    scanStatusAlert.innerHTML = html;
    scanStatusAlert.className = `scan-alert ${type}`;
    scanStatusAlert.classList.remove('hidden');
  }

  // -------------------------------------------------------------
  // 4. OVERVIEW STATS & CHARTS
  // -------------------------------------------------------------
  function renderOverview() {
    const total = storedScans.length;
    const uniqueDomains = new Set(storedScans.map(s => s.domain)).size;
    let totalFindings = 0;
    let scoreSum = 0;

    const catCounts = {
      fake_urgency: 0,
      scarcity_manipulation: 0,
      cookie_consent: 0,
      hidden_costs: 0,
      confirmshaming: 0,
      obstructive_cancellation: 0
    };

    const riskTiers = { low: 0, moderate: 0, high: 0, 'very-high': 0 };

    storedScans.forEach(scan => {
      scoreSum += (scan.score || 0);
      totalFindings += (scan.findingsCount || 0);

      const levelKey = scan.level?.level || 'low';
      if (riskTiers[levelKey] !== undefined) riskTiers[levelKey]++;

      if (scan.categoryDistribution) {
        Object.keys(scan.categoryDistribution).forEach(k => {
          if (catCounts[k] !== undefined) catCounts[k] += scan.categoryDistribution[k];
        });
      }
    });

    const avgScore = total > 0 ? Math.round(scoreSum / total) : 0;

    if (statTotalScans) statTotalScans.textContent = total;
    if (statUniqueSites) statUniqueSites.textContent = uniqueDomains;
    if (statTotalFindings) statTotalFindings.textContent = totalFindings;
    if (statAvgScore) statAvgScore.textContent = `${avgScore}/100`;

    // Render Category Distribution Bars
    if (categoryBarsContainer) {
      categoryBarsContainer.innerHTML = '';
      const categoriesDef = window.ClickTrapRules.CATEGORIES;
      const maxCount = Math.max(1, ...Object.values(catCounts));

      Object.keys(categoriesDef).forEach(k => {
        const cat = categoriesDef[k];
        const count = catCounts[cat.id] || 0;
        const pct = Math.round((count / maxCount) * 100);

        const row = document.createElement('div');
        row.className = 'cat-bar-item';
        row.innerHTML = `
          <div class="cat-bar-meta">
            <span class="cat-bar-name">${cat.name}</span>
            <span class="cat-bar-count">${count} detected</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${pct}%; background-color: ${cat.color};"></div>
          </div>
        `;
        categoryBarsContainer.appendChild(row);
      });
    }

    // Render Risk Tiers Grid
    if (riskDistributionContainer) {
      riskDistributionContainer.innerHTML = `
        <div class="risk-tier-box tier-low">
          <span class="risk-tier-label" style="color: var(--risk-low);">Low Suspicion (0-24)</span>
          <span class="risk-tier-count">${riskTiers['low']}</span>
        </div>
        <div class="risk-tier-box tier-moderate">
          <span class="risk-tier-label" style="color: var(--risk-mod);">Moderate Suspicion (25-49)</span>
          <span class="risk-tier-count">${riskTiers['moderate']}</span>
        </div>
        <div class="risk-tier-box tier-high">
          <span class="risk-tier-label" style="color: var(--risk-high);">High Suspicion (50-74)</span>
          <span class="risk-tier-count">${riskTiers['high']}</span>
        </div>
        <div class="risk-tier-box tier-very-high">
          <span class="risk-tier-label" style="color: var(--risk-very-high);">Very High (75-100)</span>
          <span class="risk-tier-count">${riskTiers['very-high']}</span>
        </div>
      `;
    }

    // Render Recent Table (Last 5)
    if (overviewRecentTableBody) {
      overviewRecentTableBody.innerHTML = '';
      const recentScans = storedScans.slice(0, 5);

      if (recentScans.length === 0) {
        overviewRecentTableBody.innerHTML = `
          <tr><td colspan="6" class="text-center text-muted">No scan history recorded yet. Enter a website URL on the Scan Website tab to start.</td></tr>
        `;
      } else {
        recentScans.forEach(scan => {
          const tr = document.createElement('tr');
          const dateStr = scan.timestamp ? new Date(scan.timestamp).toLocaleDateString() : 'Recent';
          const badgeClass = scan.level?.badgeClass || 'badge-low';
          const badgeLabel = scan.level?.label || 'Low Suspicion';

          tr.innerHTML = `
            <td class="domain-cell">${escapeHtml(scan.domain || 'webpage')}</td>
            <td>${dateStr}</td>
            <td><strong>${scan.score || 0}</strong></td>
            <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
            <td>${scan.findingsCount || 0}</td>
            <td>
              <button class="btn btn-secondary btn-sm inspect-btn">Inspect Report</button>
            </td>
          `;

          tr.querySelector('.inspect-btn').addEventListener('click', () => {
            openReport(scan);
          });

          overviewRecentTableBody.appendChild(tr);
        });
      }
    }
  }

  // -------------------------------------------------------------
  // 5. SCAN REPORT VIEW
  // -------------------------------------------------------------
  function openReport(scan) {
    selectedScanReport = scan;
    switchPage('report');

    if (!scan) {
      reportEmptyState.classList.remove('hidden');
      reportActiveContainer.classList.add('hidden');
      return;
    }

    reportEmptyState.classList.add('hidden');
    reportActiveContainer.classList.remove('hidden');

    reportDomain.textContent = scan.domain || 'Scanned Domain';
    reportUrl.textContent = scan.url || scan.domain || '';
    reportTimestamp.textContent = `Scanned on ${scan.timestamp ? new Date(scan.timestamp).toLocaleString() : 'Recent'}`;

    const score = scan.score || 0;
    reportScoreNum.textContent = score;

    const level = scan.level || window.ClickTrapRules.getRiskLevel(score);
    reportRiskBadge.textContent = level.label;
    reportRiskBadge.className = `badge ${level.badgeClass}`;
    reportRawPoints.textContent = `Raw weight: ${scan.rawScore || score} pts`;

    const dial = document.querySelector('.report-dial');
    if (dial) dial.style.borderColor = level.color;

    reportSummaryText.textContent = scan.summary || 'Scan completed.';
    reportFindingsCount.textContent = scan.findingsCount || 0;

    // Render Category Tags
    reportCategoryTags.innerHTML = '';
    if (scan.categoryDistribution) {
      Object.keys(scan.categoryDistribution).forEach(catId => {
        const count = scan.categoryDistribution[catId];
        if (count > 0) {
          const catDef = Object.values(window.ClickTrapRules.CATEGORIES).find(c => c.id === catId);
          const tag = document.createElement('span');
          tag.className = 'cat-tag-pill';
          tag.textContent = `${catDef ? catDef.name : catId} (${count})`;
          reportCategoryTags.appendChild(tag);
        }
      });
    }

    // Render Itemized Findings List
    reportFindingsList.innerHTML = '';
    if (!scan.findings || scan.findings.length === 0) {
      reportFindingsList.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-secondary);">
          Clean layout verified. No manipulative interface signals were detected during this scan.
        </div>
      `;
    } else {
      scan.findings.forEach(finding => {
        const fCard = document.createElement('div');
        fCard.className = 'forensic-card';

        fCard.innerHTML = `
          <div class="forensic-header">
            <span class="forensic-rule-name">${escapeHtml(finding.ruleName || finding.ruleId)}</span>
            <span class="badge ${finding.severity === 'high' ? 'badge-very-high' : finding.severity === 'medium' ? 'badge-high' : 'badge-low'}">
              ${escapeHtml(finding.severity || 'Medium')}
            </span>
          </div>
          ${finding.evidence ? `<div class="evidence-quote">"${escapeHtml(finding.evidence)}"</div>` : ''}
          <p class="forensic-desc">${escapeHtml(finding.explanation)}</p>
          ${finding.recommendedAction ? `
            <div class="forensic-action-box">
              <strong>Consumer Defense Tip:</strong> ${escapeHtml(finding.recommendedAction)}
            </div>
          ` : ''}
        `;
        reportFindingsList.appendChild(fCard);
      });
    }
  }

  // -------------------------------------------------------------
  // 6. SCAN HISTORY TABLE & ACTIONS
  // -------------------------------------------------------------
  function renderHistoryTable() {
    if (!historyTableBody) return;
    historyTableBody.innerHTML = '';

    const query = (historySearchInput?.value || '').trim().toLowerCase();
    const filterTier = historyRiskFilter?.value || 'all';

    let filtered = storedScans.filter(s => {
      const matchesQuery = !query ||
        (s.domain && s.domain.toLowerCase().includes(query)) ||
        (s.url && s.url.toLowerCase().includes(query)) ||
        (s.summary && s.summary.toLowerCase().includes(query));

      const matchesTier = filterTier === 'all' || s.level?.level === filterTier;
      return matchesQuery && matchesTier;
    });

    if (filtered.length === 0) {
      historyTableBody.innerHTML = `
        <tr><td colspan="6" class="text-center text-muted">No scans matching criteria.</td></tr>
      `;
      return;
    }

    filtered.forEach(scan => {
      const tr = document.createElement('tr');
      const dateStr = scan.timestamp ? new Date(scan.timestamp).toLocaleString() : 'Unknown';
      const badgeClass = scan.level?.badgeClass || 'badge-low';
      const badgeLabel = scan.level?.label || 'Low Suspicion';

      tr.innerHTML = `
        <td>
          <span class="domain-cell">${escapeHtml(scan.domain)}</span>
          <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(scan.url || '')}</div>
        </td>
        <td>${dateStr}</td>
        <td><strong>${scan.score}</strong>/100</td>
        <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
        <td>${scan.findingsCount} signals</td>
        <td>
          <div class="action-row-btns">
            <button class="btn btn-secondary btn-sm btn-view-rep">Report</button>
            <button class="btn btn-danger-outline btn-sm btn-del-scan" title="Delete entry">&times;</button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-view-rep').addEventListener('click', () => openReport(scan));
      tr.querySelector('.btn-del-scan').addEventListener('click', async () => {
        if (confirm(`Delete scan for ${scan.domain}?`)) {
          storedScans = storedScans.filter(s => s.id !== scan.id);
          await persistScans();
        }
      });

      historyTableBody.appendChild(tr);
    });
  }

  if (historySearchInput) historySearchInput.addEventListener('input', renderHistoryTable);
  if (historyRiskFilter) historyRiskFilter.addEventListener('change', renderHistoryTable);

  if (btnClearHistoryPage) {
    btnClearHistoryPage.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete all stored scan history? This action cannot be reversed.')) {
        storedScans = [];
        await persistScans();
      }
    });
  }

  if (btnExportHistory) {
    btnExportHistory.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storedScans, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `clicktrap-scan-history-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // -------------------------------------------------------------
  // 7. LEARN ABOUT DARK PATTERNS & INTERACTIVE QUIZ
  // -------------------------------------------------------------
  const EDU_DATA = [
    {
      category: 'fake_urgency',
      name: 'Fake Urgency',
      color: '#FF6B6B',
      definition: 'Artificial time limits or countdown timers that simulate imminent expiration to induce purchase panic without an authentic operational cutoff.',
      example: '"Offer expires in 01:59 minutes! Buy now before the timer ends!"',
      psychology: 'Exploits Scarcity Heuristic and Loss Aversion. Urgency narrows cognitive focus, suppressing deliberative price comparisons.',
      howToSpot: 'Notice if refreshing the browser resets the clock or if identical deals persist hours later.',
      defense: 'Recognize the adrenaline spike as an engineered trigger. Bookmark the item and return after 30 minutes to evaluate rational necessity.'
    },
    {
      category: 'scarcity_manipulation',
      name: 'Scarcity Manipulation',
      color: '#FFA94D',
      definition: 'Fabricated or exaggerated claims of minimal remaining stock, limited seats, or competing real-time viewers.',
      example: '"Only 1 room left at this price! 18 people are viewing this right now!"',
      psychology: 'Triggers Social Proof and Fear of Missing Out (FOMO). We subconsciously equate high demand with superior value.',
      howToSpot: 'Look for generalized alerts that appear instantaneously on every single product page without real inventory variation.',
      defense: 'Assume social proof counters are unverified marketing assertions. Check secondary retailer listings to verify true inventory.'
    },
    {
      category: 'cookie_consent',
      name: 'Cookie Consent Manipulation',
      color: '#748FFC',
      definition: 'Interface asymmetry in privacy dialogs where accepting tracking is a 1-click prominent action, while rejecting is buried in nested menus.',
      example: 'A vibrant green "Accept All" button paired with a tiny, low-contrast gray text link labeled "Manage Options".',
      psychology: 'Exploits Friction Asymmetry and Status Quo Bias. Users choose the path of least physical effort when fatigued by popups.',
      howToSpot: 'Examine whether rejecting tracking takes equal or more clicks than accepting.',
      defense: 'Click "Manage Preferences" and ensure advertising and profiling cookies are toggled off.'
    },
    {
      category: 'hidden_costs',
      name: 'Hidden or Late-Disclosed Costs (Drip Pricing)',
      color: '#F59F00',
      definition: 'Revealing compulsory service fees, handling surcharges, or pre-checking paid add-ons at the final stage of payment.',
      example: '$35 room advertised, but a mandatory $18 resort fee and $5.99 pre-checked insurance are appended at payment.',
      psychology: 'Exploits Sunk Cost Fallacy. After investing 15 minutes entering shipping details, users feel reluctant to abandon the checkout.',
      howToSpot: 'Compare the initial advertised search price against the final invoice line item total.',
      defense: 'Calculate the true all-inclusive cost before providing credit card information.'
    },
    {
      category: 'confirmshaming',
      name: 'Confirmshaming & Manipulative Language',
      color: '#E64980',
      definition: 'Emotionally manipulative opt-out language designed to make users feel foolish, reckless, or guilty for declining an offer.',
      example: '"No thanks, I don\'t care about saving money" or "No, I prefer paying full price".',
      psychology: 'Appeals to Social Approval and Ego Preservation. Declining is framed as an admission of personal deficiency.',
      howToSpot: 'Refusal links phrased as negative first-person admissions ("I hate discounts", "I don\'t want success").',
      defense: 'Decline without emotional hesitation; this is an automated manipulation script designed by marketing behavioral teams.'
    },
    {
      category: 'obstructive_cancellation',
      name: 'Obstructive Cancellation (Roach Motel)',
      color: '#9775FA',
      definition: 'Interfaces that make entering a recurring paid subscription instant and frictionless online, but make canceling arduous.',
      example: 'Sign up in 30 seconds online, but cancellation requires calling a restricted phone desk or sending postal mail.',
      psychology: 'Exploits Procedural Friction. Making cancellation tedious causes subscribers to delay action, paying months of unused fees.',
      howToSpot: 'Review cancellation terms before entering payment credentials during signup.',
      defense: 'Document all cancellation attempts. If blocked by artificial barriers, contact payment providers to halt recurring authorization.'
    }
  ];

  function renderEducationalCards() {
    const container = document.getElementById('edu-cards-container');
    if (!container) return;
    container.innerHTML = '';

    EDU_DATA.forEach(item => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.innerHTML = `
        <div class="edu-cat-header">
          <span class="edu-color-pip" style="background-color: ${item.color};"></span>
          <h3>${escapeHtml(item.name)}</h3>
        </div>
        <p class="edu-def">${escapeHtml(item.definition)}</p>

        <div class="edu-section-title">Realistic Deceptive Example</div>
        <div class="edu-example-box">${escapeHtml(item.example)}</div>

        <div class="edu-section-title">Cognitive Mechanism</div>
        <p class="edu-desc-item">${escapeHtml(item.psychology)}</p>

        <div class="edu-section-title">Red Flag Identification</div>
        <p class="edu-desc-item">${escapeHtml(item.howToSpot)}</p>

        <div class="edu-tip-box">
          <strong>Recommended Defense:</strong> ${escapeHtml(item.defense)}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Interactive Quiz
  const QUIZ_QUESTIONS = [
    {
      q: 'You are reserving a hotel room. A banner says "Only 1 room left! 14 people are viewing this right now." Which pattern is this?',
      options: ['Fake Urgency', 'Scarcity Manipulation', 'Obstructive Cancellation', 'Confirmshaming'],
      correct: 1,
      explanation: 'Scarcity Manipulation leverages artificial inventory limitations and fake social viewer counts to induce FOMO.'
    },
    {
      q: 'A newsletter modal asks for your email. The decline button reads "No thanks, I prefer paying full price." Which pattern is this?',
      options: ['Confirmshaming', 'Hidden Costs', 'Cookie Manipulation', 'Fake Urgency'],
      correct: 0,
      explanation: 'Confirmshaming uses guilt-inducing or humiliating language on opt-out buttons to coerce compliance.'
    },
    {
      q: 'A cookie banner offers a giant green "Accept All" button, but the only way to decline is a tiny gray link labeled "Settings". Which pattern is this?',
      options: ['Drip Pricing', 'Cookie Consent Manipulation (Asymmetry)', 'Roach Motel', 'Sneak into Basket'],
      correct: 1,
      explanation: 'Visual asymmetry nudges users into accepting pervasive tracking by making the reject option visually subdued.'
    },
    {
      q: 'You can subscribe to a magazine online with 1 click, but the cancellation terms state "Cancellations only accepted via physical letter to our headquarters." What is this?',
      options: ['Obstructive Cancellation (Roach Motel)', 'Scarcity Manipulation', 'Confirmshaming', 'Ethical Marketing'],
      correct: 0,
      explanation: 'The Roach Motel makes joining effortless while placing severe friction hurdles on cancellation.'
    }
  ];

  let currentQuizIdx = 0;
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const btnNextQuiz = document.getElementById('btn-next-quiz');

  function renderQuizQuestion() {
    if (!quizQuestion || !quizOptions) return;
    const qData = QUIZ_QUESTIONS[currentQuizIdx];
    quizQuestion.textContent = `${currentQuizIdx + 1}. ${qData.q}`;
    quizOptions.innerHTML = '';
    quizFeedback.classList.add('hidden');
    btnNextQuiz.classList.add('hidden');

    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.onclick = () => selectQuizAnswer(idx, qData);
      quizOptions.appendChild(btn);
    });
  }

  function selectQuizAnswer(selectedIdx, qData) {
    const buttons = quizOptions.querySelectorAll('.quiz-opt-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.correct) btn.classList.add('correct');
      else if (idx === selectedIdx) btn.classList.add('incorrect');
    });

    const isCorrect = selectedIdx === qData.correct;
    quizFeedback.classList.remove('hidden');
    quizFeedback.style.backgroundColor = isCorrect ? 'rgba(53, 214, 194, 0.15)' : 'rgba(255, 107, 107, 0.15)';
    quizFeedback.style.border = `1px solid ${isCorrect ? 'var(--accent-teal)' : 'var(--risk-very-high)'}`;
    quizFeedback.style.color = isCorrect ? 'var(--accent-teal)' : 'var(--risk-very-high)';
    quizFeedback.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${qData.explanation}`;

    btnNextQuiz.classList.remove('hidden');
  }

  if (btnNextQuiz) {
    btnNextQuiz.addEventListener('click', () => {
      currentQuizIdx = (currentQuizIdx + 1) % QUIZ_QUESTIONS.length;
      renderQuizQuestion();
    });
  }

  // -------------------------------------------------------------
  // 8. SETTINGS & GUIDE CONTROLS
  // -------------------------------------------------------------
  if (btnQuickScanGuide) btnQuickScanGuide.addEventListener('click', () => guideModal.classList.remove('hidden'));
  if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => guideModal.classList.add('hidden'));
  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) guideModal.classList.add('hidden');
    });
  }

  if (dashPrefHighlight) {
    dashPrefHighlight.addEventListener('change', async () => {
      userSettings.highlightingEnabled = dashPrefHighlight.checked;
      await persistSettings();
    });
  }

  if (dashPrefHistory) {
    dashPrefHistory.addEventListener('change', async () => {
      userSettings.historyEnabled = dashPrefHistory.checked;
      await persistSettings();
    });
  }

  if (btnDashClearData) {
    btnDashClearData.addEventListener('click', async () => {
      if (confirm('Are you sure you want to erase all ClickTrap data, scans, and settings?')) {
        storedScans = [];
        userSettings = { highlightingEnabled: true, historyEnabled: true };
        await persistScans();
        await persistSettings();
        alert('All local ClickTrap data has been erased.');
      }
    });
  }

  // Utility to escape HTML strings safely
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Load
  await loadData();
  renderQuizQuestion();
  renderEducationalCards();
});
