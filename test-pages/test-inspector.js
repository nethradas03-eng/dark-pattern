/**
 * ClickTrap Synthetic Test Fixtures - Interactive In-Page Inspector
 * Allows running the ClickTrap detection engine directly on any test fixture
 * without requiring the Chrome extension to be installed.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Instantiate detector if scripts are loaded
  let detector = null;
  if (typeof window.ClickTrapDetector === 'function' && window.ClickTrapRules) {
    detector = new window.ClickTrapDetector(window.ClickTrapRules);
  }

  // Inject or upgrade the top bar with interactive detection trigger
  const existingBanner = document.querySelector('.synthetic-banner');
  const bar = document.createElement('div');
  bar.className = 'ct-inspector-bar';
  bar.innerHTML = `
    <div class="ct-inspector-left">
      <span style="font-size: 16px;">🛡️</span>
      <strong>ClickTrap Security Lab:</strong>
      <span style="opacity: 0.9;">Synthetic Dark Pattern Fixture</span>
    </div>
    <div class="ct-inspector-actions">
      <button type="button" id="btn-run-fixture-scan" class="ct-inspector-btn">
        ⚡ Run Detection On This Page
      </button>
      <a href="../index.html" class="ct-inspector-link">📊 Open Web Dashboard</a>
      <a href="index.html" class="ct-inspector-link">&larr; All Fixtures</a>
    </div>
  `;

  if (existingBanner) {
    existingBanner.replaceWith(bar);
  } else {
    document.body.prepend(bar);
  }

  const btnScan = document.getElementById('btn-run-fixture-scan');
  if (btnScan) {
    btnScan.addEventListener('click', () => runInPageScan());
  }

  function runInPageScan() {
    if (!detector && typeof window.ClickTrapDetector === 'function' && window.ClickTrapRules) {
      detector = new window.ClickTrapDetector(window.ClickTrapRules);
    }

    if (!detector) {
      alert('ClickTrap engine is initializing. Please ensure rules.js and detector.js are loaded.');
      return;
    }

    // Clean previous highlights
    document.querySelectorAll('.ct-highlighted-target, .ct-highlighted-clean').forEach(el => {
      el.classList.remove('ct-highlighted-target', 'ct-highlighted-clean');
    });
    document.querySelectorAll('.ct-finding-badge').forEach(el => el.remove());

    const report = detector.scanDocument(document, window.location.href);

    // Highlight findings
    if (report.findings && report.findings.length > 0) {
      report.findings.forEach(f => {
        let el = f.targetElement;
        if (!el && f.selector) {
          try { el = document.querySelector(f.selector); } catch (e) {}
        }
        if (el) {
          el.classList.add('ct-highlighted-target');
          const badge = document.createElement('div');
          badge.className = 'ct-finding-badge';
          badge.textContent = `⚠️ Flagged: ${f.ruleName || f.categoryName}`;
          el.insertAdjacentElement('beforebegin', badge);
        }
      });
    } else {
      // Mark card as clean
      const mainCard = document.querySelector('.fixture-card');
      if (mainCard) mainCard.classList.add('ct-highlighted-clean');
    }

    // Save scan to localStorage so it syncs with Web Dashboard
    try {
      const cleanReport = {
        id: `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        domain: report.domain || 'synthetic-fixture',
        url: window.location.href,
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

      const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      const updated = [cleanReport, ...existingHistory.filter(s => s.url !== cleanReport.url)].slice(0, 100);
      localStorage.setItem('scanHistory', JSON.stringify(updated));
    } catch (e) {
      // Ignore storage errors
    }

    // Show floating results drawer
    showResultsDrawer(report);
  }

  function showResultsDrawer(report) {
    let drawer = document.getElementById('ct-results-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'ct-results-drawer';
      drawer.className = 'ct-results-drawer';
      document.body.appendChild(drawer);
    }

    const isClean = report.score === 0;
    const badgeClass = isClean ? 'ct-score-clean' : (report.score >= 50 ? 'ct-score-high' : 'ct-score-mod');

    let findingsHtml = '';
    if (report.findings && report.findings.length > 0) {
      findingsHtml = report.findings.map(f => `
        <div class="ct-finding-item">
          <div class="ct-finding-title">${escapeHtml(f.ruleName)} (${f.severity.toUpperCase()})</div>
          <div class="ct-finding-desc"><strong>Evidence:</strong> "${escapeHtml(f.evidence)}"</div>
          <div class="ct-finding-desc" style="margin-top: 4px;">${escapeHtml(f.explanation)}</div>
        </div>
      `).join('');
    } else {
      findingsHtml = `
        <div style="background:#0B1020; border-left:3px solid #22C55E; padding:12px; border-radius:4px; font-size:12px;">
          <strong style="color:#22C55E;">Verified Clean Control Page:</strong>
          <p style="color:#A7B2C5; margin-top:4px;">No manipulative designs or hidden fees detected. Standard transparent pricing and balanced cookie choices.</p>
        </div>
      `;
    }

    drawer.innerHTML = `
      <div class="ct-results-header">
        <div>
          <strong>Detection Results</strong>
          <div style="font-size: 11px; color: #72B7FF;">ClickTrap Security Analysis</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="ct-score-pill ${badgeClass}">Score: ${report.score}/100</span>
          <button type="button" id="btn-close-ct-drawer" style="background:none; border:none; color:#A7B2C5; font-size:18px; cursor:pointer;">&times;</button>
        </div>
      </div>
      <div class="ct-results-body">
        <p style="font-size: 12px; color: #CBD5E1; margin-bottom: 12px;">${escapeHtml(report.summary)}</p>
        <div>${findingsHtml}</div>
      </div>
      <div class="ct-drawer-footer">
        <span style="font-size: 11px; color: #6C7A9C;">Saved to Scan History</span>
        <a href="../index.html" class="ct-inspector-btn" style="text-decoration:none;">View Full Report in Dashboard &rarr;</a>
      </div>
    `;

    document.getElementById('btn-close-ct-drawer').onclick = () => drawer.remove();
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }
});
