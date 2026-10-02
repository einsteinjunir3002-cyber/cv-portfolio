const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'http://localhost:4173/';
const testOutputDir = 'C:\\Users\\einst\\Desktop\\CV\\test_results';

if (!fs.existsSync(testOutputDir)) {
  fs.mkdirSync(testOutputDir, { recursive: true });
}

console.log('====================================================');
console.log('STARTING 100% COMPREHENSIVE MOBILE & FUNCTIONAL TEST');
console.log('Target:', targetUrl);
console.log('Device Profile: Modern Smartphone (390 x 844, DPR: 2)');
console.log('====================================================\n');

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9238',
  targetUrl
]);

let ws;
let msgId = 1;
const callbacks = new Map();
const testResults = [];
const consoleErrors = [];
const networkErrors = [];

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    callbacks.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evaluate(expression) {
  return send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  }).then(res => {
    if (res && res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res && res.result ? res.result.value : undefined;
  });
}

async function captureScreenshot(filename) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  if (res && res.data) {
    const fullPath = path.join(testOutputDir, filename);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Captured test artifact: ${filename}`);
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function assertTest(name, condition, details = '') {
  if (condition) {
    testResults.push({ name, status: 'PASS', details });
    console.log(`  ✅ [PASS] ${name} ${details ? '- ' + details : ''}`);
  } else {
    testResults.push({ name, status: 'FAIL', details });
    console.error(`  ❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n--- SUITE 1: VIEWPORT, DOM & ZERO HORIZONTAL OVERFLOW ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    screenOrientation: { angle: 0, type: 'portraitPrimary' }
  });
  await sleep(1000);

  const overflowCheck = await evaluate(`
    ({
      innerWidth: window.innerWidth,
      docWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    })
  `);
  assertTest('Zero Horizontal Overflow on Mobile', !overflowCheck.hasOverflow,
    `Viewport: ${overflowCheck.innerWidth}px, Document: ${overflowCheck.docWidth}px`);
  await captureScreenshot('01_mobile_initial_view.png');

  console.log('\n--- SUITE 2: MOBILE HAMBURGER & NAVIGATION DRAWER ---');
  const navInitial = await evaluate(`
    ({
      hamburgerVisible: window.getComputedStyle(document.getElementById('mobile-menu-toggle')).display !== 'none',
      desktopMenuHidden: window.getComputedStyle(document.querySelector('.desktop-menu')).display === 'none',
      drawerInitiallyClosed: !document.getElementById('mobile-drawer').classList.contains('open')
    })
  `);
  assertTest('Hamburger Button Visible on Mobile', navInitial.hamburgerVisible);
  assertTest('Desktop Nav Hidden on Mobile', navInitial.desktopMenuHidden);
  assertTest('Mobile Drawer Initially Closed', navInitial.drawerInitiallyClosed);

  // Click Hamburger Button to open drawer
  await evaluate(`document.getElementById('mobile-menu-toggle').click()`);
  await sleep(400);

  const drawerOpen = await evaluate(`
    ({
      hasOpenClass: document.getElementById('mobile-drawer').classList.contains('open'),
      ariaExpanded: document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded'),
      drawerLinksCount: document.querySelectorAll('#mobile-drawer .mobile-link').length
    })
  `);
  assertTest('Hamburger Click Opens Drawer', drawerOpen.hasOpenClass && drawerOpen.ariaExpanded === 'true');
  assertTest('Mobile Drawer Contains 6 Navigation Links', drawerOpen.drawerLinksCount === 6);
  await captureScreenshot('02_mobile_drawer_open.png');

  // Test Drawer Nav Link Click (e.g. click "Skills")
  await evaluate(`document.querySelector('#mobile-drawer a[href="#skills"]').click()`);
  await sleep(400);

  const drawerClosedAfterClick = await evaluate(`
    !document.getElementById('mobile-drawer').classList.contains('open')
  `);
  assertTest('Drawer Closes Automatically on Link Click', drawerClosedAfterClick);

  console.log('\n--- SUITE 3: HERO SECTION ACTION BUTTONS & ASSETS ---');
  await evaluate(`window.scrollTo(0, 0)`);
  await sleep(300);

  const heroButtons = await evaluate(`
    ({
      downloadHref: document.getElementById('hero-cv-btn')?.getAttribute('href'),
      downloadAttr: document.getElementById('hero-cv-btn')?.getAttribute('download'),
      viewProjectsHref: document.querySelector('.hero-actions a[href="#projects"]')?.getAttribute('href'),
      contactMeHref: document.querySelector('.hero-actions a[href="#contact"]')?.getAttribute('href'),
      avatarLoaded: !!document.querySelector('.portrait-img')?.complete && document.querySelector('.portrait-img')?.naturalWidth > 0
    })
  `);
  assertTest('Download CV Button Configured Correctly',
    heroButtons.downloadHref?.includes('Samuel_Bekoe_CV.pdf') && !!heroButtons.downloadAttr,
    `href: ${heroButtons.downloadHref}`);
  assertTest('Hero View Projects Anchor Link Present', heroButtons.viewProjectsHref === '#projects');
  assertTest('Hero Contact Me Anchor Link Present', heroButtons.contactMeHref === '#contact');
  assertTest('Hero Portrait WebP Image Loaded Successfully', heroButtons.avatarLoaded);

  console.log('\n--- SUITE 4: ABOUT SECTION & CLASS PHOTO ---');
  await evaluate(`document.getElementById('about').scrollIntoView()`);
  await sleep(400);
  const aboutCheck = await evaluate(`
    ({
      classPhotoLoaded: !!document.querySelector('.class-photo')?.complete && document.querySelector('.class-photo')?.naturalWidth > 0,
      pillarsCount: document.querySelectorAll('.pillar-item').length
    })
  `);
  assertTest('UCC CS 2026 Class Photo Loaded Successfully', aboutCheck.classPhotoLoaded);
  assertTest('About Core Pillars Present', aboutCheck.pillarsCount >= 3, `Count: ${aboutCheck.pillarsCount}`);
  await captureScreenshot('03_about_section.png');

  console.log('\n--- SUITE 5: SKILLS SECTION (4 CATEGORIES) ---');
  await evaluate(`document.getElementById('skills').scrollIntoView()`);
  await sleep(400);
  const skillsCheck = await evaluate(`
    ({
      categoryCardsCount: document.querySelectorAll('.skill-category-card').length,
      skillItemsCount: document.querySelectorAll('.skill-item').length
    })
  `);
  assertTest('All 4 Skill Categories Rendered', skillsCheck.categoryCardsCount === 4);
  assertTest('Comprehensive Skill Badges Rendered', skillsCheck.skillItemsCount >= 14, `Count: ${skillsCheck.skillItemsCount}`);

  console.log('\n--- SUITE 6: PROJECT CATEGORY FILTERS ---');
  await evaluate(`document.getElementById('projects').scrollIntoView()`);
  await sleep(400);

  // Filter 1: Web Applications (SmartLearn, LIKEM, Bekoe Rental, Harmony Haven = 4)
  await evaluate(`document.querySelector('.filter-btn[data-filter="web"]').click()`);
  await sleep(300);
  const webFilter = await evaluate(`
    ({
      visible: Array.from(document.querySelectorAll('.project-card')).filter(c => !c.classList.contains('hidden')).length,
      hidden: Array.from(document.querySelectorAll('.project-card')).filter(c => c.classList.contains('hidden')).length
    })
  `);
  assertTest('Filter "Web Applications" shows 4 projects', webFilter.visible === 4 && webFilter.hidden === 1,
    `Visible: ${webFilter.visible}, Hidden: ${webFilter.hidden}`);

  // Filter 2: Academic & Systems (SmartLearn, ARSPCS = 2)
  await evaluate(`document.querySelector('.filter-btn[data-filter="academic"]').click()`);
  await sleep(300);
  const academicFilter = await evaluate(`
    ({
      visible: Array.from(document.querySelectorAll('.project-card')).filter(c => !c.classList.contains('hidden')).length,
      hidden: Array.from(document.querySelectorAll('.project-card')).filter(c => c.classList.contains('hidden')).length
    })
  `);
  assertTest('Filter "Academic & Systems" shows 2 projects', academicFilter.visible === 2 && academicFilter.hidden === 3,
    `Visible: ${academicFilter.visible}, Hidden: ${academicFilter.hidden}`);

  // Filter 3: Client & Enterprise (LIKEM, Bekoe Rental, Harmony Haven = 3)
  await evaluate(`document.querySelector('.filter-btn[data-filter="client"]').click()`);
  await sleep(300);
  const clientFilter = await evaluate(`
    ({
      visible: Array.from(document.querySelectorAll('.project-card')).filter(c => !c.classList.contains('hidden')).length,
      hidden: Array.from(document.querySelectorAll('.project-card')).filter(c => c.classList.contains('hidden')).length
    })
  `);
  assertTest('Filter "Client & Enterprise" shows 3 projects', clientFilter.visible === 3 && clientFilter.hidden === 2,
    `Visible: ${clientFilter.visible}, Hidden: ${clientFilter.hidden}`);

  // Reset to All Projects (5)
  await evaluate(`document.querySelector('.filter-btn[data-filter="all"]').click()`);
  await sleep(300);
  const allFilter = await evaluate(`
    Array.from(document.querySelectorAll('.project-card')).filter(c => !c.classList.contains('hidden')).length
  `);
  assertTest('Filter "All Projects" restores 5 projects', allFilter === 5);
  await captureScreenshot('04_projects_grid_all.png');

  console.log('\n--- SUITE 7: PROJECT MODAL SYSTEM (EVERY SINGLE PROJECT) ---');
  const projectIds = ['smartlearn', 'likem', 'rent', 'solar', 'harmony'];
  for (const pid of projectIds) {
    // Open modal
    await evaluate(`document.querySelector('.open-modal-btn[data-project="${pid}"]').click()`);
    await sleep(400);

    const modalState = await evaluate(`
      ({
        isOpen: document.getElementById('project-modal').classList.contains('open'),
        hasTitle: !!document.getElementById('modal-project-title')?.innerText,
        title: document.getElementById('modal-project-title')?.innerText,
        imgSrc: document.querySelector('#modal-content img')?.src,
        imgLoaded: !!document.querySelector('#modal-content img')?.complete && (document.querySelector('#modal-content img')?.naturalWidth > 0 || document.querySelector('#modal-content img')?.src.includes('.svg')),
        bodyLocked: document.body.style.overflow === 'hidden'
      })
    `);
    assertTest(`Modal for [${pid}] Opens Successfully`, modalState.isOpen && modalState.hasTitle, modalState.title);
    assertTest(`Modal for [${pid}] Image Loaded Validly`, modalState.imgLoaded, modalState.imgSrc);

    if (pid === 'smartlearn') {
      await captureScreenshot('05_modal_smartlearn_mobile.png');
    }

    // Close modal via close button
    await evaluate(`document.getElementById('modal-close').click()`);
    await sleep(300);

    const closed = await evaluate(`
      !document.getElementById('project-modal').classList.contains('open') && document.body.style.overflow !== 'hidden'
    `);
    assertTest(`Modal for [${pid}] Closes & Restores Scroll`, closed);
  }

  console.log('\n--- SUITE 8: ACADEMIC TIMELINE & AI WORKFLOW ---');
  await evaluate(`document.getElementById('education').scrollIntoView()`);
  await sleep(400);
  const timelineCheck = await evaluate(`
    ({
      itemsCount: document.querySelectorAll('.timeline-item').length,
      uccPresent: Array.from(document.querySelectorAll('.timeline-card')).some(c => c.innerText.includes('University of Cape Coast'))
    })
  `);
  assertTest('Timeline Renders All Milestones', timelineCheck.itemsCount >= 6, `Count: ${timelineCheck.itemsCount}`);
  assertTest('UCC BSc Computer Science Highlighted', timelineCheck.uccPresent);

  await evaluate(`document.getElementById('workflow').scrollIntoView()`);
  await sleep(400);
  const workflowCheck = await evaluate(`
    document.querySelectorAll('.workflow-card').length
  `);
  assertTest('AI Workflow 4-Step Methodology Present', workflowCheck === 4);

  console.log('\n--- SUITE 9: CONTACT SECTION & INTERACTIVE TOASTS ---');
  await evaluate(`document.getElementById('contact').scrollIntoView()`);
  await sleep(400);

  // Test Copy Email Toast
  await evaluate(`document.getElementById('copy-email-btn').click()`);
  await sleep(300);
  const emailToast = await evaluate(`
    ({
      toastCount: document.querySelectorAll('.toast').length,
      toastText: document.querySelector('.toast')?.innerText
    })
  `);
  assertTest('Copy Email Button Triggers Toast Notification', emailToast.toastCount > 0, emailToast.toastText);
  await captureScreenshot('06_toast_notification_mobile.png');

  // Test Copy Phone Toast
  await evaluate(`document.getElementById('copy-phone-btn').click()`);
  await sleep(300);
  const phoneToast = await evaluate(`
    document.querySelector('.toast:last-child')?.innerText
  `);
  assertTest('Copy Phone Button Triggers Toast Notification', !!phoneToast, phoneToast);

  // Test Direct Links
  const directLinks = await evaluate(`
    ({
      whatsapp: document.getElementById('whatsapp-link')?.getAttribute('href'),
      github: document.getElementById('github-link')?.getAttribute('href')
    })
  `);
  assertTest('WhatsApp Direct Action Valid (+233595412232)', directLinks.whatsapp?.includes('233595412232'));
  assertTest('GitHub Profile Valid (einsteinjunir3002-cyber)', directLinks.github?.includes('einsteinjunir3002-cyber'));

  console.log('\n--- SUITE 10: INTERACTIVE CONTACT FORM SUBMISSION ---');
  // Fill form
  await evaluate(`
    document.getElementById('form-name').value = 'Tech Recruiter';
    document.getElementById('form-email').value = 'recruiter@techghana.com';
    document.getElementById('form-subject').value = 'NSS Placement Interview Invitation';
    document.getElementById('form-message').value = 'Hello Samuel, we were very impressed by your CS capstone and would love to interview you for our engineering team.';
  `);

  // Submit form
  await evaluate(`document.getElementById('contact-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))`);
  await sleep(600);

  const formSubmission = await evaluate(`
    ({
      feedbackText: document.getElementById('form-feedback')?.innerText,
      feedbackSuccess: document.getElementById('form-feedback')?.classList.contains('success'),
      inputsReset: document.getElementById('form-name')?.value === ''
    })
  `);
  assertTest('Contact Form Validates & Submits Gracefully', formSubmission.feedbackSuccess, formSubmission.feedbackText);
  assertTest('Contact Form Clears Fields Post-Submission', formSubmission.inputsReset);
  await captureScreenshot('07_contact_form_success.png');

  console.log('\n--- SUITE 11: CONSOLE LOGS & NETWORK INTEGRITY ---');
  assertTest('Zero Unhandled Console Errors', consoleErrors.length === 0,
    consoleErrors.length > 0 ? consoleErrors.join('; ') : 'Clean console');
  assertTest('Zero Broken Network Requests', networkErrors.length === 0,
    networkErrors.length > 0 ? networkErrors.join('; ') : 'All assets 200 OK');

  console.log('\n====================================================');
  console.log('TEST RUN SUMMARY:');
  const passed = testResults.filter(t => t.status === 'PASS').length;
  const failed = testResults.filter(t => t.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${testResults.length}`);
  console.log(`PASSED:      ${passed}`);
  console.log(`FAILED:      ${failed}`);
  console.log(`SUCCESS RATE: ${((passed / testResults.length) * 100).toFixed(1)}%`);
  console.log('====================================================\n');

  // Save report to JSON
  fs.writeFileSync(path.join(testOutputDir, 'test_report.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    total: testResults.length,
    passed,
    failed,
    tests: testResults,
    consoleErrors,
    networkErrors
  }, null, 2));

  ws.close();
  chrome.kill();
  process.exit(failed > 0 ? 1 : 0);
}

function initWebSocket(tab) {
  ws = new WebSocket(tab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    // Enable Runtime, Page, Network, Console
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Network.enable');
    await send('Console.enable');

    await runTestSuite();
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }

    if (msg.method === 'Console.messageAdded') {
      if (msg.params.message.level === 'error') {
        consoleErrors.push(msg.params.message.text);
      }
    }
    if (msg.method === 'Network.responseReceived') {
      const { response } = msg.params;
      if (response.status >= 400) {
        networkErrors.push(`${response.status}: ${response.url}`);
      }
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
    chrome.kill();
    process.exit(1);
  };
}

function pollForTarget(retries = 20) {
  http.get('http://localhost:9238/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      let tabs;
      try { tabs = JSON.parse(data); } catch(e) { tabs = []; }
      const tab = tabs.find(t => t.url && t.url.includes('4173'));
      if (!tab) {
        if (retries > 0) return setTimeout(() => pollForTarget(retries - 1), 300);
        console.error('Failed to locate target tab');
        chrome.kill();
        process.exit(1);
      }
      initWebSocket(tab);
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => pollForTarget(retries - 1), 300);
    else {
      console.error('Cannot connect to Chrome debugger on port 9238');
      chrome.kill();
      process.exit(1);
    }
  });
}

setTimeout(pollForTarget, 1000);
