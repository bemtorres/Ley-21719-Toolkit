# Caso Real 1: Caja Los Andes — Filtración Masiva de 10 Millones de Chilenos (2024)

## Resumen

El **4 de julio de 2024**, Caja Los Andes (CLAP), una de las cajas de compensación más grandes de Chile, sufrió una filtración masiva de datos personales que expuso información de aproximadamente **10 millones de personas** —cerca de la mitad de la población del país. La filtración fue detectada y reportada por el investigador de seguridad Germán Fernández, quien encontró una base de datos **Apache Cassandra sin autenticación** expuesta directamente en internet.

## Datos Expuestos

| Categoría | Detalle |
| :--- | :--- |
| **Identificación** | Nombres completos, RUT, fechas de nacimiento |
| **Laborales** | Remuneraciones, historial laboral, nombre del empleador |
| **Financieras** | Montos de créditos, cuotas, préstamos vigentes |
| **Salud** | Datos de licencias médicas, prestaciones de salud (ISAPRE/FONASA) |
| **Contacto** | Dirección domiciliaria, teléfonos, correos electrónicos |
| **Volumen** | ~10M de registros (7+ GB de datos) |

## Causa Técnica

- Base de datos **Apache Cassandra** configurada sin autenticación ni control de acceso.
- Expuesta directamente a internet con IP pública sin firewall ni VPN.
- Sin cifrado en reposo (*at rest*).
- No había registro de logs de acceso (*audit trail*).
- El investigador accedió a los datos sin contraseña desde un navegador web.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna. La Ley 19.628 (antigua) carecía de facultades sancionatorias reales. |
| **Marco legal vigente** | Ley 19.628 (1999) — sin agencia fiscalizadora ni multas efectivas. |
| **Protección judicial** | Afectados pueden demandar indemnización civil por daños, pero el proceso es lento y costoso. |
| **Con Ley 21.719** | Habría sido infracción **gravísima**: multa de hasta **20.000 UTM (~$1.400 MM CLP)** o **4% de ingresos anuales**. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Control de acceso:** Toda base de datos con datos personales debe tener autenticación obligatoria (no solo "confiar en que nadie la encontrará").
2. **Cifrado en reposo:** Los datos almacenados deben estar cifrados; una exposición sin cifrado es equivalente a una publicación abierta.
3. **Inventario de activos:** Caja Los Andes no sabía que esa base de datos estaba expuesta. Un inventario de datos (RAT) habría identificado el riesgo.
4. **Seguridad por defecto:** Apache Cassandra viene con autenticación deshabilitada por defecto; cambiarla es una configuración básica que debe auditarse periódicamente.
5. **Notificación de brecha:** Con Ley 21.719, Caja Los Andes habría tenido **72 horas** para notificar a la APDP y a los afectados.

## Referencias

- [Investigación de Germán Fernández (LinkedIn)](https://www.linkedin.com/posts/germanfdz_ciberseguridad-datospersonales-casalosandes-activity)
- [Reporte de prensa — BioBioChile](https://www.biobiochile.cl)
- [Análisis de impacto — CiberCuba/Medios locales](https://www.elmostrador.cl)
