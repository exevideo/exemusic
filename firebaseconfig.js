// Firebase SDK - sequential load (urutan penting!)
const _fbScripts = [
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js"
];

function _loadScriptSeq(scripts, index, callback) {
  if (index >= scripts.length) { callback(); return; }
  const s = document.createElement('script');
  s.src = scripts[index];
  s.onload = () => _loadScriptSeq(scripts, index + 1, callback);
  s.onerror = () => _loadScriptSeq(scripts, index + 1, callback);
  document.head.appendChild(s);
}

_loadScriptSeq(_fbScripts, 0, function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD5JGQ3eARM5Lo2IG3mkpdx7p3uh0nrBIk",
    authDomain: "samp-miracle.firebaseapp.com",
    projectId: "samp-miracle",
    storageBucket: "samp-miracle.firebasestorage.app",
    messagingSenderId: "465126706451",
    appId: "1:465126706451:web:b94f2359a348ff7078dee6",
    measurementId: "G-ZCRVX5DCPR",
    databaseURL: "https://samp-miracle-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  try { firebase.analytics(); } catch(e) {}

  console.log('%c[bot discord] Database Loaded ✓', 'color:#00C9B1;font-weight:bold');

  // Beritahu index.html bahwa Firebase sudah siap
  document.dispatchEvent(new Event('firebaseReady'));
});
