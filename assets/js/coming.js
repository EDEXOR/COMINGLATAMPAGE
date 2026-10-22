/* COMING: lógica mínima propia (la plantilla ya trae menú, animaciones y acordeones). */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search);
  var clean = function (v, re, n) { return (v || '').replace(re, '').slice(0, n); };
  document.querySelectorAll('select[name="rubro"]').forEach(function (s) {
    var r = q.get('rubro') || s.getAttribute('data-default');
    if (r) for (var i = 0; i < s.options.length; i++) if (s.options[i].value === r) s.selectedIndex = i;
  });
  var neg = q.get('negocio');
  if (neg) document.querySelectorAll('input[name="negocio"]').forEach(function (i) { i.value = neg.slice(0, 100); });
  var plan = clean(q.get('plan'), /[^a-z-]/g, 20);
  document.querySelectorAll('input[name="plan"]').forEach(function (i) { i.value = plan; });
  var demo = clean(q.get('demo'), /[^a-z0-9-]/gi, 80);
  document.querySelectorAll('input[name="demo"]').forEach(function (i) { i.value = demo; });
  document.querySelectorAll('input[name="baja_id"]').forEach(function (i) { i.value = (q.get('id') || '').slice(0, 120); });
  if (demo) {
    document.querySelectorAll('[data-demo-name]').forEach(function (el) { el.textContent = demo.replace(/-/g, ' '); });
    document.querySelectorAll('[data-demo-box]').forEach(function (el) { el.removeAttribute('hidden'); });
    document.querySelectorAll('a[data-keep-demo]').forEach(function (a) { a.href = a.getAttribute('href').split('?')[0] + '?demo=' + encodeURIComponent(demo); });
  }
  // Si el endpoint sigue siendo un marcador [..], no se envía nada.
  document.querySelectorAll('form[data-coming]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var action = f.getAttribute('action') || '';
      if (action.indexOf('[') !== -1) {
        e.preventDefault();
        var msg = f.closest('.tpcontact').querySelector('.coming-form-msg');
        if (msg) { msg.textContent = 'El formulario todavía no está conectado (sitio en preparación). No se envió ningún dato. Por ahora, escríbenos por WhatsApp o por correo.'; msg.classList.add('show'); msg.focus(); }
      }
    });
  });
  document.querySelectorAll('.coming-year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
