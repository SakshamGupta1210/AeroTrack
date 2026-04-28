// ===================================
// SMART AIRPORT LUGGAGE TRACKING SYSTEM
// JavaScript Functionality
// ===================================

// STATE MANAGEMENT
let currentPage = 'landing';
let isTracking = false;
let trackingTimer = null;
let countdownTimer = null;
let currentStep = 0;
const TOTAL_STEPS = 5;

// DUMMY DATA
const mockFlights = ['AI-202', 'AA-456', 'BA-789', 'QF-123', 'SQ-456'];
const mockBags = ['BAG-AI-2026', 'BAG-AA-3421', 'BAG-BA-5678', 'BAG-QF-9012'];
const mockPassengers = ['Saksham Kumar', 'Priya Singh', 'Rajesh Patel', 'Anjali Sharma'];
const beltSections = ['A', 'B', 'C', 'D'];

// ===== PAGE NAVIGATION =====
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  document.getElementById(page).classList.add('active');
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  event?.target?.classList.add('active');
  
  currentPage = page;
}

// ===== LOGIN FUNCTIONALITY =====
function toggleLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.classList.toggle('show');
}

function demoLogin() {
  showLoadingScreen(true);
  setTimeout(() => {
    showLoadingScreen(false);
    toggleLoginModal();
    showNotification('Login Successful', '✅ Welcome to AeroTrack! You are now logged in.');
    document.getElementById('loginBtn').textContent = 'Logout';
    document.getElementById('loginBtn').onclick = () => demoLogout();
    navigateTo('dashboard');
  }, 1500);
}

function demoLogout() {
  document.getElementById('loginBtn').textContent = 'Login';
  document.getElementById('loginBtn').onclick = () => toggleLoginModal();
  stopTracking();
  navigateTo('landing');
  showNotification('Logged Out', '👋 You have been logged out successfully.');
}

// ===== DASHBOARD TRACKING =====
function startTracking() {
  const flight = document.getElementById('flightNumber').value;
  const bagId = document.getElementById('bagId').value;
  const passenger = document.getElementById('passengerName').value;
  
  if (!flight || !bagId || !passenger) {
    showNotification('Error', '❌ Please fill in all fields');
    return;
  }

  showLoadingScreen(true);
  
  setTimeout(() => {
    showLoadingScreen(false);
    
    // Update UI
    isTracking = true;
    document.getElementById('trackingInfo').style.display = 'block';
    document.getElementById('notTrackingText').style.display = 'none';
    document.getElementById('statusSubtitle').style.display = 'block';
    
    // Display info
    document.getElementById('displayFlight').textContent = flight;
    document.getElementById('displayBag').textContent = bagId;
    document.getElementById('displayPassenger').textContent = passenger;
    
    // Set random belt section
    const randomBelt = beltSections[Math.floor(Math.random() * beltSections.length)];
    document.getElementById('beltSection').textContent = randomBelt;
    
    // Reset tracking
    currentStep = 0;
    startTrackingSimulation();
    
    showNotification('Tracking Started', '📍 Your luggage tracking has begun. Follow the progress below.');
  }, 1200);
}

function startTrackingSimulation() {
  // Simulate progress through steps
  trackingTimer = setInterval(() => {
    if (currentStep < TOTAL_STEPS) {
      updateTrackingProgress();
      
      // Show notifications at certain steps
      if (currentStep === 2) {
        showNotification('Security Cleared', '✅ Your luggage passed security screening!');
      } else if (currentStep === 3) {
        showNotification('En Route', '🚚 Your luggage is on its way to the belt.');
      } else if (currentStep === 4) {
        const beltSection = document.getElementById('beltSection').textContent;
        showNotification('Ready for Pickup', `🎉 Your luggage will arrive at Section ${beltSection} in 2 minutes!`);
      }
    } else {
      clearInterval(trackingTimer);
      showNotification('Luggage Ready', '✅ Your luggage is ready for pickup at the designated belt!');
    }
  }, 8000);
}

function updateTrackingProgress() {
  // Update progress bar
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
  
  // Update steps
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const step = document.getElementById(`step-${i}`);
    if (i <= currentStep) {
      step.classList.add('active');
      const circle = step.querySelector('.step-circle');
      if (i < currentStep) {
        circle.textContent = '✓';
      } else {
        circle.textContent = i + 1;
      }
    } else {
      step.classList.remove('active');
    }
  }
  
  currentStep++;
}

function stopTracking() {
  isTracking = false;
  if (trackingTimer) clearInterval(trackingTimer);
  if (countdownTimer) clearInterval(countdownTimer);
  
  document.getElementById('trackingInfo').style.display = 'none';
  document.getElementById('notTrackingText').style.display = 'block';
  document.getElementById('statusSubtitle').style.display = 'none';
  
  currentStep = 0;
}

// ===== TIMER COUNTDOWN =====
function startCountdown() {
  let timeLeft = 5 * 60 + 47; // 5 minutes 47 seconds
  
  countdownTimer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = timeString;
    }
    
    timeLeft--;
    
    if (timeLeft < 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
}

// Update timer display on page load/show
window.addEventListener('load', () => {
  startCountdown();
});

// ===== NOTIFICATIONS =====
function showNotification(title, message) {
  const notification = document.getElementById('notification');
  const notifTitle = document.getElementById('notifTitle');
  const notifMessage = document.getElementById('notifMessage');
  const notifIcon = document.getElementById('notifIcon');
  
  // Set icon based on title
  if (title.includes('Error')) {
    notifIcon.textContent = '❌';
  } else if (title.includes('Success') || title.includes('Ready')) {
    notifIcon.textContent = '✅';
  } else if (title.includes('Help')) {
    notifIcon.textContent = '📞';
  } else if (title.includes('Luggage')) {
    notifIcon.textContent = '🧳';
  } else if (title.includes('Registered')) {
    notifIcon.textContent = '📝';
  }
  
  notifTitle.textContent = title;
  notifMessage.textContent = message;
  
  notification.style.display = 'block';
  notification.classList.add('show');
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
      notification.style.display = 'none';
      notification.classList.remove('hide');
    }, 500);
  }, 5000);
}

// ===== LOADING SCREEN =====
function showLoadingScreen(show) {
  const loadingScreen = document.getElementById('loadingScreen');
  if (show) {
    loadingScreen.classList.add('show');
  } else {
    loadingScreen.classList.remove('show');
  }
}

// ===== DEMO FUNCTIONS =====
function startDemo() {
  showLoadingScreen(true);
  
  setTimeout(() => {
    showLoadingScreen(false);
    navigateTo('dashboard');
    
    // Auto-fill form and start tracking
    document.getElementById('flightNumber').value = mockFlights[0];
    document.getElementById('bagId').value = mockBags[0];
    document.getElementById('passengerName').value = mockPassengers[0];
    
    setTimeout(() => {
      startTracking();
    }, 500);
  }, 1500);
}

// ===== BELT PAGE CROWD SIMULATION =====
function simulateCrowdChanges() {
  setInterval(() => {
    const crowds = [
      { element: document.querySelectorAll('.crowd-indicator')[0], level: 'low', text: 'Low Crowd (24 passengers)' },
      { element: document.querySelectorAll('.crowd-indicator')[1], level: 'medium', text: 'Medium Crowd (48 passengers)' },
      { element: document.querySelectorAll('.crowd-indicator')[2], level: 'high', text: 'High Crowd (72 passengers)' },
      { element: document.querySelectorAll('.crowd-indicator')[3], level: 'low', text: 'Low Crowd (18 passengers)' }
    ];
  }, 15000);
}

// ===== ADMIN PAGE CHART ANIMATIONS =====
function animateAdminCharts() {
  const bars = document.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Start initial animations
  simulateCrowdChanges();
  
  // Handle page navigation via URL or buttons
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Refresh animations when switching to admin page
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const page = mutation.target;
        if (page.id === 'admin' && page.classList.contains('active')) {
          setTimeout(animateAdminCharts, 100);
        }
      }
    });
  });
  
  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
  });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Alt+D for Dashboard
  if (e.altKey && e.key === 'd') {
    e.preventDefault();
    navigateTo('dashboard');
  }
  // Alt+B for Belt
  if (e.altKey && e.key === 'b') {
    e.preventDefault();
    navigateTo('belt');
  }
  // Alt+A for Admin
  if (e.altKey && e.key === 'a') {
    e.preventDefault();
    navigateTo('admin');
  }
  // Alt+H for Home
  if (e.altKey && e.key === 'h') {
    e.preventDefault();
    navigateTo('landing');
  }
});

// ===== AUTO-REFRESH SIMULATION =====
function autoRefreshMetrics() {
  // Simulate real-time updates on admin dashboard
  setInterval(() => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      if (stat.textContent.includes('%')) {
        const currentValue = parseFloat(stat.textContent);
        const variation = (Math.random() - 0.5) * 2;
        const newValue = Math.max(0, Math.min(100, currentValue + variation));
        stat.textContent = newValue.toFixed(1) + '%';
      }
    });
  }, 10000);
}

autoRefreshMetrics();

// ===== RESPONSIVE ADJUSTMENTS =====
window.addEventListener('resize', () => {
  // Adjust for mobile
  if (window.innerWidth < 768) {
    document.querySelectorAll('.dashboard-grid').forEach(grid => {
      grid.style.gridTemplateColumns = '1fr';
    });
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== PAGE VISIBILITY SIMULATION =====
// Show activity indicators
setInterval(() => {
  if (document.getElementById('belt') && document.getElementById('belt').classList.contains('active')) {
    // Simulate belt animation by restarting
    document.querySelectorAll('.luggage-item').forEach((item, index) => {
      const randomDelay = Math.random() * 2;
      item.style.animationDelay = randomDelay + 's';
    });
  }
}, 20000);

// ===== DEMO INTERACTIONS =====
// Make feature cards clickable
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('click', () => {
    const icon = card.querySelector('.feature-icon').textContent;
    const title = card.querySelector('h3').textContent;
    showNotification(title, `✅ Feature: ${title} is now active!`);
  });
});

// Make belt cards interactive
document.querySelectorAll('.belt-card').forEach(card => {
  card.addEventListener('click', () => {
    const section = card.querySelector('.belt-label').textContent;
    showNotification('Belt Selected', `🎯 You selected ${section}. Current wait time: 3-5 minutes.`);
  });
});

// Make heatmap cells interactive
document.querySelectorAll('.heatmap-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const text = cell.textContent;
    showNotification('Area Details', `📊 ${text}`);
  });
});

// ===== REAL-TIME SIMULATION =====
function startRealTimeSimulation() {
  // Simulate real-time baggage updates
  if (isTracking) {
    const randomEvent = Math.random();
    
    if (randomEvent > 0.95) {
      // Simulate delay notification
      setTimeout(() => {
        showNotification('⚠️ Minor Delay', 'Your luggage encountered a 2-minute delay at security.');
      }, Math.random() * 30000);
    }
  }
}

setInterval(startRealTimeSimulation, 30000);

// ===== INITIAL PAGE SETUP =====
console.log('%c🚀 AeroTrack System Initialized', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
console.log('%c📱 Front-End Demo Version v1.0', 'color: #7c3aed; font-size: 12px;');
console.log('%c💡 Tip: Use Alt+H (Home), Alt+D (Dashboard), Alt+B (Belt), Alt+A (Admin) for quick navigation', 'color: #00d4ff; font-size: 11px;');