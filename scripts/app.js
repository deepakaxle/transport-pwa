function updateStatus() {
  const el = document.getElementById('net-status');
  if (!el) return;
  el.textContent = navigator.onLine ? 'Online' : 'Offline';
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
document.addEventListener('DOMContentLoaded', updateStatus);
