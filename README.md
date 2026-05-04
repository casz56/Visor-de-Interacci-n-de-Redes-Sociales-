# INFIHUILA - Aplicativo de gestión del Plan de Medios

Aplicativo web en HTML, CSS y JavaScript para el seguimiento del desempeño del plan de medios institucional.

## Funcionalidades principales

- Logo INFIHUILA incrustado en base64 para despliegue correcto en GitHub Pages.
- Dashboard gerencial con KPI dinámicos.
- Carga de información desde PDF, Excel, XLS y CSV.
- Gráficos interactivos con filtros de plataforma, indicadores y modo de visualización.
- Semáforo gerencial editable.
- Ruta de mejora editable.
- Tabla de datos editable.
- Exportación a CSV.
- Nuevo botón **Generar PDF** con informe institucional A4 que incluye logo, resumen, KPI, gráficos, alertas y recomendaciones.

## Publicación en GitHub Pages

Sube los archivos `index.html`, `style.css` y `app.js` a tu repositorio. El logo está incrustado en el HTML, por lo que no depende de rutas externas.



## Actualización PDF robusta

El botón **Generar PDF** fue ajustado para funcionar en GitHub Pages sin depender de capturas de canvas ni html2canvas. El informe se construye directamente con jsPDF y gráficos vectoriales generados desde los datos del aplicativo.
