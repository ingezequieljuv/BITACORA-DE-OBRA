/**
 * Comentarios de la Bitácora de Obra
 *
 * Pega este código en la hoja "Comentarios Bitácora de Obra":
 * Extensiones → Apps Script → borra lo que haya → pega esto → Guardar.
 * Luego: Implementar → Nueva implementación → Tipo: Aplicación web
 *   Ejecutar como: Yo
 *   Quién tiene acceso: Cualquier usuario
 * Copia la URL que termina en /exec y pégala en la bitácora (Registros → Comentarios de lectores).
 *
 * Para ocultar un comentario, escribe NO en la columna "Visible" de esa fila.
 */

const AVISAR_POR_CORREO = true; // false si no quieres correo por cada comentario nuevo

function hoja_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Fecha', 'Registro', 'Nombre', 'Comentario', 'Fecha del registro', 'Cadenamiento', 'Visible']);
  }
  return sh;
}

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Evita que un texto que empieza con = + - @ se tome como fórmula
function texto_(v, max) {
  let s = String(v || '').replace(/\s+$/, '').slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const ids = p.registro ? String(p.registro).split(',') : null;
  const filas = hoja_().getDataRange().getValues().slice(1);
  const lista = filas
    .filter(r => r[1] && (!ids || ids.indexOf(String(r[1])) >= 0) && String(r[6]).trim().toUpperCase() !== 'NO')
    .map(r => ({
      fecha: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      registro: String(r[1]),
      nombre: String(r[2]).replace(/^'/, ''),
      comentario: String(r[3]).replace(/^'/, '')
    }));
  return salida_(lista);
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) {}
  if (d.web) return salida_({ ok: true }); // trampa para robots
  const registro = String(d.registro || '').replace(/[^\w-]/g, '').slice(0, 40);
  const nombre = texto_(d.nombre, 60).trim();
  const comentario = texto_(d.comentario, 1000).trim();
  if (!registro || !nombre || !comentario) return salida_({ ok: false, error: 'Faltan datos' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    hoja_().appendRow([new Date(), registro, nombre, comentario, texto_(d.f_fecha, 20), texto_(d.cad, 40), 'SI']);
  } finally {
    lock.releaseLock();
  }

  if (AVISAR_POR_CORREO) {
    try {
      MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        'Nuevo comentario en la Bitácora de Obra',
        nombre + ' comentó el registro del ' + (d.f_fecha || '') + (d.cad ? ' (km ' + d.cad + ')' : '') + ':\n\n' +
        comentario + '\n\n' + (d.url || '')
      );
    } catch (err) {}
  }
  return salida_({ ok: true });
}
