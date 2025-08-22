// Service Worker update handler
let updateAvailable = false;

// Listen for service worker updates
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates every 30 seconds when page is visible
        setInterval(() => {
          if (document.visibilityState === 'visible') {
            registration.update();
          }
        }, 30000);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                updateAvailable = true;
                showUpdateNotification();
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

function showUpdateNotification() {
  // Create a simple update notification
  const notification = document.createElement('div');
  notification.id = 'sw-update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
    ">
      <strong>App Update Available!</strong>
      <p style="margin: 8px 0; opacity: 0.9;">A new version is ready.</p>
      <button id="sw-update-btn" style="
        background: white;
        color: #2563eb;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        margin-right: 8px;
      ">Update Now</button>
      <button id="sw-dismiss-btn" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Later</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Handle update button click
  document.getElementById('sw-update-btn')?.addEventListener('click', () => {
    window.location.reload();
  });
  
  // Handle dismiss button click
  document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-dismiss after 10 seconds if no action
  setTimeout(() => {
    if (document.getElementById('sw-update-notification')) {
      notification.remove();
    }
  }, 10000);
}

export { updateAvailable };