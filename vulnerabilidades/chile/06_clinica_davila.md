# Caso Real 6: Clínica Dávila — Ciberataque de Ransomware y Filtración de Fichas Médicas (2025-2026)


## Resumen

Entre **diciembre de 2025 y marzo de 2026**, la **Clínica Dávila** (una de las principales clínicas privadas de Chile, parte de Empresas Banmédica / UnitedHealth Group) sufrió un grave ciberataque de ransomware que derivó en la exfiltración masiva de datos clínicos altamente sensibles. El incidente inicial ocurrió el 18 de diciembre de 2025 y fue perpetrado por el grupo cibercriminal rusohablante **"Devman"**, el cual robó aproximadamente **250 GB de información**. Tras la negativa de la clínica a pagar el rescate solicitado, los ciberdelincuentes filtraron muestras de la base de datos en la *dark web*. Posteriormente, en marzo de 2026, el grupo **LockBit 5.0** publicó una base de datos de 180 GB conteniendo los archivos robados, consolidando uno de los incidentes de exposición de datos de salud más severos en la historia reciente de Chile.

## Datos Expuestos y Afectados

| Categoría | Detalle |
| :--- | :--- |
| **Tipo de Incidente** | Ciberataque de Ransomware con doble extorsión (cifrado y exfiltración masiva de datos). |
| **Volumen de Datos** | ~250 GB de datos exfiltrados y posteriormente publicados en la dark web. |
| **Datos Sensibles** | Fichas clínicas completas, diagnósticos de pacientes, recetas médicas e historiales de hospitalización. |
| **Datos Altamente Sensibles** | Resultados de exámenes de alta confidencialidad (incluyendo exámenes de VIH) y datos de salud mental. |
| **Datos de Identificación** | Nombres completos, RUT, correos, teléfonos y copias digitalizadas de cédulas de identidad. |
| **Organizaciones Involucradas** | Clínica Dávila, SERNAC (ofició a la clínica tras la brecha) y el Ministerio Público. |

## Causa Técnica

- **Acceso Inicial Vulnerable (VPN):** Los atacantes ingresaron a la red corporativa de la clínica a través de un servicio de VPN (Red Privada Virtual) que carecía de autenticación multifactor (MFA) activa, empleando credenciales de acceso administrativo comprometidas o de baja robustez (usuario y contraseña idénticos).
- **Falta de Detección de Exfiltración:** Los sistemas de monitorización de red no detectaron la transferencia anómala de 250 GB de datos hacia el exterior (*data exfiltration*) antes del despliegue del ransomware.
- **Ausencia de Cifrado a nivel de Aplicación:** Las bases de datos que contenían las fichas clínicas e imágenes de cédulas de identidad no se encontraban cifradas en reposo, lo que permitió a los atacantes leer la información de manera legible tras comprometer la red corporativa.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna multa directa por datos personales bajo la ley actual. Sin embargo, el SERNAC exigió explicaciones oficiales bajo la Ley del Consumidor, y la clínica enfrenta riesgos de demandas civiles colectivas por daño moral. |
| **Marco legal vigente** | Ley 19.628 (protección de datos ineficaz) y la Ley 19.496 de Protección de los Derechos de los Consumidores (SERNAC). |
| **Con Ley 21.719** | Sería catalogada como una **infracción gravísima** (artículos sobre seguridad y tratamiento ilícito de datos sensibles de salud). La APDP podría imponer multas de hasta **20.000 UTM (~$1.400 MM CLP)** o el **4% de los ingresos anuales** de la controladora del grupo de salud. |
| **Obligación de Notificación** | Con la Ley 21.719, la clínica habría tenido un plazo fatal de **72 horas** para notificar obligatoriamente la brecha tanto a la APDP como a cada uno de los pacientes afectados de forma individual. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Autenticación Multifactor Obligatoria (MFA):** Todo acceso remoto a la red de salud, especialmente a través de VPNs o escritorios remotos (RDP), debe requerir obligatoriamente un segundo factor de autenticación.
2. **Protección Especial a Datos Sensibles de Salud (Dimensión 4):** Los datos médicos, diagnósticos y exámenes son datos de categoría "sensible". Su tratamiento exige medidas extremas de seguridad, incluyendo el cifrado de bases de datos clínicas (*cifrado de datos en reposo y en tránsito*).
3. **Control de Fugas de Información (DLP):** Implementar herramientas de prevención de pérdida de datos (DLP) para bloquear o alertar ante la exfiltración masiva de datos desde servidores clínicos hacia internet.
4. **Notificaciones de Brechas Individuales:** El proceso que inició Clínica Dávila para notificar individualmente a los pacientes afectados es un estándar que la Ley 21.719 vuelve mandatorio. Las empresas deben contar con plantillas y flujos automatizados de notificación listos.
5. **Auditorías de Terceros e Identidad:** Garantizar que los accesos VPN temporales de proveedores externos de mantenimiento tengan el mismo nivel de restricción y caduquen automáticamente tras terminar sus labores.

## Referencias

- [Investigación Especial sobre Ciberataque a Clínica Dávila — Medio Interferencia](https://interferencia.cl)
- [Oficio de SERNAC a Clínica Dávila por filtración de datos de salud — Sitio Oficial SERNAC](https://www.sernac.cl)
- [Información técnica y reporte sobre Devman / LockBit 5.0 — Ciberseguridad Chile](https://www.firewall-chile.cl)
- [Comunicados Oficiales de Incidentes y Preguntas Frecuentes — Clínica Dávila](https://www.davila.cl)
