/* COMING · comportamiento mínimo del sitio (sin dependencias) */
(function () {
  'use strict';
  // Menú móvil
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('mnav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  }
  var q = new URLSearchParams(location.search);
  // Rubro preseleccionado (?rubro=clinicas) y demo de origen (?demo=slug)
  document.querySelectorAll('select[name="rubro"]').forEach(function (s) {
    var r = q.get('rubro') || s.getAttribute('data-default');
    if (r) { for (var i = 0; i < s.options.length; i++) if (s.options[i].value === r) s.selectedIndex = i; }
  });
  var demo = (q.get('demo') || '').replace(/[^a-z0-9-]/gi, '').slice(0, 80);
  document.querySelectorAll('input[name="demo"]').forEach(function (i) { i.value = demo; });
  document.querySelectorAll('input[name="baja_id"]').forEach(function (i) { i.value = (q.get('id') || '').slice(0, 120); });
  document.querySelectorAll('[data-demo-name]').forEach(function (el) {
    if (demo) { el.textContent = demo.replace(/-/g, ' '); el.closest('[data-demo-box]') && el.closest('[data-demo-box]').removeAttribute('hidden'); }
  });
  document.querySelectorAll('a[data-keep-demo]').forEach(function (a) {
    if (demo) a.href = a.getAttribute('href').split('?')[0] + '?demo=' + encodeURIComponent(demo);
  });
  // Formularios: si el endpoint sigue siendo un marcador [..], no se envía nada
  document.querySelectorAll('form[data-coming]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var msg = f.querySelector('.form-msg');
      if (!f.checkValidity()) return;
      var action = f.getAttribute('action') || '';
      if (action.indexOf('[') !== -1) {
        e.preventDefault();
        if (msg) {
          msg.textContent = 'El formulario todavía no está conectado (sitio en preparación). No se envió ningún dato. Por ahora, escríbenos por WhatsApp o por correo.';
          msg.classList.add('show');
          msg.focus();
        }
      }
    });
  });
  var y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
})();
(function(){var p=new URLSearchParams(location.search).get('plan');if(p){p=p.replace(/[^a-z-]/g,'').slice(0,20);document.querySelectorAll('input[name="plan"]').forEach(function(i){i.value=p;});}})();
