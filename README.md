# Bitácora de Obra

App web para los apuntes diarios de supervisión de obra: colados de concreto, carpeta y base asfáltica, terracerías, control de calidad, fotos y ubicación GPS por cadenamiento.

## Qué hace

- Registro por día con fecha, hora, obra, cadenamiento, cuerpo o carril, clima y ubicación GPS con un toque.
- **Concreto:** elemento, concretera, f'c, revenimiento, temperatura, volumen, ollas, remisión, cilindros, colocación, vibrado y curado.
- **Mezcla asfáltica:** planta, contenido asfáltico, temperaturas de producción, tendido y compactación, espesor, toneladas y riego de liga.
- **Terracerías:** banco, humedad y grado de compactación contra el requerido.
- **Control de calidad:** pruebas con resultado, especificación y si cumple o no.
- **Fotos** en resolución original, con descripción.
- **PDF con vista previa** de un registro o de un rango de fechas: eliges hoja (Carta, Oficio, A4), fotos por fila e incluir o no fotos, y ves las páginas antes de guardar o imprimir. Las fotos van sin pérdida de calidad.
- Exportación a Excel (CSV), texto para WhatsApp, y respaldo y restauración de todos los datos.
- Funciona sin señal una vez abierta y se puede agregar a la pantalla de inicio del iPhone.

## Dónde se guardan los datos

Todo se guarda **solo en el navegador del teléfono** donde se usa (IndexedDB). Nada se sube a GitHub ni a ningún servidor. Por eso conviene usar **Descargar respaldo** cada semana y guardar el archivo en iCloud o Drive. Con **Restaurar respaldo** se recuperan los registros y las fotos en cualquier dispositivo.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La aplicación completa |
| `sw.js` | Permite abrirla sin señal |
| `manifest.webmanifest`, `icon*` | Ícono y nombre en la pantalla de inicio |
