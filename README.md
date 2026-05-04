# INFIHUILA — Comando Gerencial del Plan de Medios

Versión final responsive con rediseño visual premium, auto size y auto scale para PC, laptop, tablet y celular.

## Archivos
- `index.html`: estructura principal del aplicativo.
- `style.css`: diseño responsive institucional con fuente Tw Cen MT.
- `app.js`: lógica de KPI, carga de archivos, gráficos, filtros y exportación.
- `assets/logo-infihuila.png`: logo institucional.

## Uso
1. Abrir `index.html` en el navegador.
2. Para actualizar información, usar **Seleccionar archivo** y cargar PDF, Excel, XLS o CSV.
3. Los indicadores KPI, gráficos, alertas y tabla se recalculan automáticamente.
4. Usar **Exportar CSV** para descargar la base consolidada.

## Mejoras aplicadas
- Auto scale y auto size real con CSS responsive fluido.
- Reorganización visual para escritorio, laptop, tablet y móvil.
- Gráficos con altura controlada para evitar descuadres.
- Menú lateral adaptable a barra horizontal en pantallas medianas y móviles.
- KPI y tarjetas ajustadas con `auto-fit`, `clamp()` y layouts fluidos.

## Ajuste final de gráficos
Esta versión corrige las dimensiones de todos los gráficos con alturas estándar y responsive para evitar estiramientos desproporcionados en PC, laptop, tablet y celular. También se limitaron grosores de barras y se optimizaron leyendas/ejes para una visualización más gerencial.

## Ajuste final aplicado
- Se eliminó el recuadro blanco generado por el comportamiento de doble fila del gráfico radar en pantallas grandes.
- Se retiró el elemento decorativo interno que podía generar bloques visuales innecesarios en las tarjetas de gráficos.
- Se conservan tamaños estándar y responsive para los gráficos.
