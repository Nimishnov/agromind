const sampleImage = './assets/tomato-leaf-sample.svg';
let currentImageUrl = sampleImage;
let ownedObjectUrl = null;
let toastTimer;

const views = [...document.querySelectorAll('[data-view]')];
const navButtons = [...document.querySelectorAll('[data-nav]')];
const breadcrumbTitle = document.getElementById('breadcrumbTitle');
const sidebar = document.getElementById('sidebar');
const toast = document.getElementById('toast');
const viewNames = { overview: 'Overview', fields: 'My fields', scanner: 'Crop scanner', weather: 'Weather', roadmap: 'Roadmap' };

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function navigateTo(name) {
  if (!viewNames[name]) return;
  views.forEach((view) => view.classList.toggle('active', view.dataset.view === name));
  navButtons.forEach((button) => button.classList.toggle('active', button.dataset.nav === name));
  breadcrumbTitle.textContent = viewNames[name];
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach((button) => button.addEventListener('click', () => navigateTo(button.dataset.nav)));
document.querySelectorAll('[data-action="open-scanner"]').forEach((button) => button.addEventListener('click', () => navigateTo('scanner')));
document.querySelectorAll('.text-button[data-nav]').forEach((button) => button.addEventListener('click', () => navigateTo(button.dataset.nav)));
document.getElementById('mobileMenu').addEventListener('click', () => sidebar.classList.toggle('open'));
document.getElementById('notificationButton').addEventListener('click', () => {
  navigateTo('overview');
  document.getElementById('alertsPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('Here are your sample field notes.');
});
document.getElementById('profileButton').addEventListener('click', () => showToast('You are viewing a sample workspace.'));
document.getElementById('alertMenu').addEventListener('click', () => showToast('These alerts use simulated demo values.'));

document.querySelectorAll('.range-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.range-button').forEach((item) => item.classList.toggle('active', item === button));
  const range = button.dataset.range;
  const labels = document.querySelectorAll('.x-labels span');
  const values = range === '30' ? ['Sep 23', 'Sep 28', 'Oct 03', 'Oct 08', 'Oct 13', 'Oct 18', 'Today'] : ['Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Today'];
  labels.forEach((label, index) => { label.textContent = values[index]; });
  showToast(range === '30' ? 'Showing the 30-day sample trend.' : 'Showing the 7-day sample trend.');
}));

document.querySelectorAll('.resolve-alert').forEach((button) => button.addEventListener('click', () => {
  const alert = button.closest('.alert-row');
  alert.classList.add('resolved');
  alert.style.opacity = '0';
  alert.style.transform = 'translateX(6px)';
  alert.style.transition = 'opacity .2s, transform .2s';
  setTimeout(() => alert.remove(), 220);
  const count = document.querySelectorAll('.alert-row').length - 1;
  document.getElementById('alertCount').textContent = Math.max(0, count);
  showToast('Marked as reviewed in this demo.');
}));

document.querySelectorAll('.field-row, [data-action="field-detail"]').forEach((item) => item.addEventListener('click', () => {
  const name = item.dataset.field || item.dataset.name || 'Sample field';
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalBody').textContent = 'This field card uses illustrative crop and soil values. A live version could connect validated sensor readings and local agronomy guidance.';
  document.getElementById('modalBackdrop').hidden = false;
}));
function closeModal() { document.getElementById('modalBackdrop').hidden = true; }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOk').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', (event) => { if (event.target.id === 'modalBackdrop') closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

document.querySelector('.banner-close').addEventListener('click', (event) => {
  const banner = event.currentTarget.closest('.demo-banner');
  banner.style.display = 'none';
});

const fileInput = document.getElementById('fileInput');
const scanPreview = document.getElementById('scanPreview');
const dropzone = document.getElementById('dropzone');
const imageLoading = document.getElementById('imageLoading');
const imageOverlayTag = document.querySelector('.image-overlay-tag');
const uploadButton = document.getElementById('uploadButton');
const replaceImageButton = document.getElementById('replaceImage');
const sampleButton = document.getElementById('sampleButton');
const scanButton = document.getElementById('scanButton');
const scanEmpty = document.getElementById('scanEmpty');
const scanProgress = document.getElementById('scanProgress');
const scanResult = document.getElementById('scanResult');
const resultState = document.getElementById('resultState');
const progressImage = document.getElementById('progressImage');
const resultImage = document.getElementById('resultImage');

function useImage(url, label) {
  currentImageUrl = url;
  scanPreview.src = url;
  imageOverlayTag.textContent = label;
  scanEmpty.hidden = false;
  scanProgress.hidden = true;
  scanResult.hidden = true;
  resultState.classList.remove('ready');
  resultState.innerHTML = '<i></i> WAITING';
}

function chooseFiles(files) {
  const file = files && files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Choose an image file to continue.');
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    showToast('Choose an image smaller than 12 MB.');
    return;
  }
  if (ownedObjectUrl) URL.revokeObjectURL(ownedObjectUrl);
  ownedObjectUrl = URL.createObjectURL(file);
  useImage(ownedObjectUrl, 'YOUR PHOTO');
  showToast('Photo loaded locally in your browser.');
}

uploadButton.addEventListener('click', () => fileInput.click());
replaceImageButton.addEventListener('click', (event) => { event.stopPropagation(); fileInput.click(); });
dropzone.addEventListener('click', (event) => { if (event.target !== replaceImageButton) fileInput.click(); });
dropzone.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); } });
fileInput.addEventListener('change', (event) => chooseFiles(event.target.files));
sampleButton.addEventListener('click', () => {
  fileInput.value = '';
  useImage(sampleImage, 'SAMPLE ILLUSTRATION');
  showToast('Sample leaf photo selected.');
});
['dragenter', 'dragover'].forEach((type) => dropzone.addEventListener(type, (event) => { event.preventDefault(); dropzone.classList.add('drag-over'); }));
['dragleave', 'drop'].forEach((type) => dropzone.addEventListener(type, (event) => { event.preventDefault(); dropzone.classList.remove('drag-over'); }));
dropzone.addEventListener('drop', (event) => chooseFiles(event.dataTransfer.files));
scanPreview.addEventListener('error', () => {
  imageLoading.classList.add('visible');
  imageLoading.innerHTML = '<span class="tip-icon">✳</span><span>The sample illustration could not be loaded. Upload a leaf photo to continue.</span>';
});
scanPreview.addEventListener('load', () => imageLoading.classList.remove('visible'));

scanButton.addEventListener('click', () => {
  if (scanButton.disabled) return;
  scanButton.disabled = true;
  scanEmpty.hidden = true;
  scanResult.hidden = true;
  scanProgress.hidden = false;
  resultState.classList.remove('ready');
  resultState.innerHTML = '<i></i> RUNNING';
  progressImage.src = currentImageUrl;
  window.setTimeout(() => {
    scanProgress.hidden = true;
    scanResult.hidden = false;
    resultImage.src = currentImageUrl;
    resultState.classList.add('ready');
    resultState.innerHTML = '<i></i> DEMO READY';
    scanButton.disabled = false;
    showToast('Simulated scan complete — no AI model was used.');
  }, 1450);
});

// Hide the transient sample-loading overlay only when its image has actually loaded.
if (scanPreview.complete && scanPreview.naturalWidth > 0) imageLoading.classList.remove('visible');
