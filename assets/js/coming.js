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
  // Formularios sin servidor: validan en el navegador y arman un mensaje de WhatsApp (con correo de respaldo).
  var PAIS = { SV: 'El Salvador', GT: 'Guatemala', HN: 'Honduras' };
  var txt = function (f, n) { var el = f.elements[n]; return el && el.value ? String(el.value).trim() : ''; };
  var say = function (f, html) {
    var box = f.closest('.tpcontact'); var msg = box && box.querySelector('.coming-form-msg');
    if (msg) { msg.innerHTML = html; msg.classList.add('show'); msg.focus(); }
  };
  var compose = function (f) {
    var L = [];
    if (f.getAttribute('data-coming') === 'baja') {
      L.push('Solicitud de BAJA');
      L.push('Contacto donde me escribieron: ' + txt(f, 'contacto'));
      if (txt(f, 'negocio')) L.push('Negocio: ' + txt(f, 'negocio'));
      L.push('Eliminar también la demo: ' + (f.elements.eliminar_demo && f.elements.eliminar_demo.checked ? 'sí' : 'no'));
      if (txt(f, 'demo')) L.push('Demo: ' + txt(f, 'demo'));
      if (txt(f, 'baja_id')) L.push('Identificador: ' + txt(f, 'baja_id'));
      return { subject: 'BAJA', body: L.join('\n') };
    }
    var rub = f.elements.rubro, rubT = rub && rub.selectedIndex > 0 ? rub.options[rub.selectedIndex].text : '';
    var pais = f.querySelector('input[name="pais"]:checked');
    L.push(f.elements.demo ? 'Hola COMING, quiero activar mi demo.' : 'Hola COMING, quiero ver mi demo gratis.');
    L.push('Nombre: ' + txt(f, 'nombre'));
    L.push('Negocio: ' + txt(f, 'negocio'));
    L.push('Rubro: ' + rubT);
    L.push('País: ' + (pais ? PAIS[pais.value] || pais.value : ''));
    L.push('WhatsApp: ' + txt(f, 'whatsapp'));
    if (txt(f, 'plan')) L.push('Plan de interés: ' + txt(f, 'plan'));
    if (txt(f, 'demo')) L.push('Demo: ' + txt(f, 'demo'));
    if (txt(f, 'mensaje')) L.push('Mensaje: ' + txt(f, 'mensaje'));
    L.push('Acepto el Aviso de privacidad para que usen estos datos solo para mi demo.');
    return { subject: f.elements.demo ? 'Quiero activar mi demo' : 'Quiero mi demo', body: L.join('\n') };
  };
  document.querySelectorAll('form[data-coming]').forEach(function (f) {
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (txt(f, 'sitio_web')) return; // trampa para bots
      var bad = null;
      Array.prototype.forEach.call(f.querySelectorAll('[required]'), function (el) {
        if (bad) return;
        var ok = el.type === 'checkbox' ? el.checked : el.type === 'radio' ? !!f.querySelector('input[name="' + el.name + '"]:checked') : !!String(el.value || '').trim();
        if (!ok) bad = el;
      });
      var wa = f.elements.whatsapp;
      if (!bad && wa && String(wa.value).replace(/\D/g, '').length < 8) bad = wa;
      if (bad) {
        var m = bad.type === 'checkbox' ? 'Para continuar, marca la casilla de aceptación del Aviso de privacidad.' :
                bad.name === 'whatsapp' ? 'Escribe un número de WhatsApp válido, con código de país (por ejemplo, +503 7000 0000).' :
                'Completa los campos marcados con * para continuar.';
        say(f, m); bad.focus(); return;
      }
      var c = compose(f);
      var waUrl = 'https://wa.me/' + (f.getAttribute('data-wa') || '') + '?text=' + encodeURIComponent(c.body);
      var mailUrl = 'mailto:' + (f.getAttribute('data-mail') || '') + '?subject=' + encodeURIComponent(c.subject) + '&body=' + encodeURIComponent(c.body);
      try { sessionStorage.setItem('coming_wa', waUrl); sessionStorage.setItem('coming_mail', mailUrl); } catch (err) {}
      var win = window.open(waUrl, '_blank'); if (win) { try { win.opener = null; } catch (err) {} }
      var gracias = f.getAttribute('data-gracias');
      say(f, 'Abrimos WhatsApp con tus datos: solo presiona enviar. ¿No se abrió? <a href="' + waUrl + '" target="_blank" rel="noopener">Abrir WhatsApp</a> o <a href="' + mailUrl + '">envíalo por correo</a>.');
      if (gracias) setTimeout(function () { location.href = gracias; }, win ? 600 : 4000);
    });
  });
  document.querySelectorAll('a[data-retry]').forEach(function (a) {
    try { var u = sessionStorage.getItem(a.getAttribute('data-retry') === 'wa' ? 'coming_wa' : 'coming_mail'); if (u) a.href = u; } catch (err) {}
    if (a.getAttribute('data-retry') === 'wa') { a.target = '_blank'; a.rel = 'noopener'; }
  });
  document.querySelectorAll('.coming-year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
