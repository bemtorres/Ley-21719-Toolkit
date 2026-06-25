# Caso Real 5: BancoEstado — Parálisis Operativa por Ransomware Sodinokibi/REvil (2020)


## Resumen

El **5 de septiembre de 2020**, el banco estatal chileno **BancoEstado** sufrió un masivo ataque de ransomware que comprometió su red interna. La intrusión fue gatillada por el malware **Sodinokibi** (también conocido como **REvil**), el cual logró cifrar y bloquear aproximadamente **12.000 estaciones de trabajo y servidores** institucionales (entorno Windows). Para mitigar la propagación y limpiar la red, el banco se vio forzado a suspender temporalmente el funcionamiento de sus 410 sucursales a lo largo de todo el país el lunes 7 de septiembre. Gracias a la segmentación de su arquitectura de TI, plataformas clave como la app móvil, el sitio web, los cajeros automáticos y la red CajaVecina continuaron funcionando, evitando un impacto sistémico mayor en la población.

## Datos Expuestos y Afectados

| Categoría | Detalle |
| :--- | :--- |
| **Tipo de Incidente** | Ciberataque de Ransomware (secuestro y cifrado de datos) con paralización de terminales. |
| **Entidades Afectadas** | BancoEstado (red interna de sucursales). |
| **Datos Involucrados** | Archivos internos de administración local, bases de datos internas contenidas en estaciones de trabajo y accesos a servidores internos. |
| **Impacto Operativo** | Cierre total preventivo de 410 sucursales financieras en todo Chile y reconfiguración de 12.000 equipos. |
| **Afectación de Clientes** | El banco descartó la pérdida de fondos de clientes y afectación a cuentas bancarias. |
| **Volumen** | ~12.000 terminales cifrados a nivel nacional. |

## Causa Técnica

- **Vector de entrada:** Recepción y ejecución de un archivo malicioso (documento de Office adjunto tipo phishing/malicious document) por parte de un funcionario, que descargó un *backdoor* en la estación de trabajo local.
- **Movimiento lateral y propagación:** Explotación de debilidades de privilegios en el dominio de Windows y falta de restricciones estrictas de privilegios locales en los endpoints.
- **Falta de parches o antivirus desactualizado:** Evasión de los controles tradicionales de endpoints mediante firmas de evasión sofisticadas propias del ransomware-as-a-service REvil.
- **Ausencia de control estricto de Macros o scripts:** Permisión en la ejecución de macros/scripts maliciosos provenientes de internet en las estaciones de trabajo de los empleados.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna sanción pecuniaria directa en protección de datos personales. La CMF (Comisión para el Mercado Financiero) fiscalizó y emitió directrices de ciberseguridad complementarias. |
| **Marco legal vigente** | Ley 19.628 (protección de datos inoperante) y las normativas sectoriales (Recopilación Actualizada de Normas - RAN) de la CMF. |
| **Con Ley 21.719** | Sería catalogada como infracción **grave** o **gravísima** si se determina negligencia en los controles de endpoints y políticas de software. El banco arriesgaría multas de hasta **20.000 UTM (~$1.400 MM CLP)** o el **4% de sus ingresos anuales**, además del daño reputacional en el Registro Nacional de Sanciones de la APDP. |
| **Responsabilidad Civil** | Posibles demandas civiles colectivas por falta de servicio debido al cierre imprevisto de sucursales a nivel nacional. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Defensa en Profundidad y EDR:** No depender de antivirus tradicionales basados exclusivamente en firmas. Se requiere implementar soluciones de detección y respuesta en endpoints (EDR/XDR) capaces de analizar comportamientos anómalos.
2. **Capacitación Continua del Personal (Dimensión 5):** Dado que el vector inicial fue el factor humano (phishing/ejecutable adjunto), la formación periódica y simulacros de phishing para todos los funcionarios es una medida preventiva obligatoria bajo la nueva legislación.
3. **Control de Privilegios y endurecimiento de Endpoints:** Minimizar los privilegios locales de administración en las máquinas de los usuarios y bloquear la ejecución automática de scripts o macros desde correos electrónicos.
4. **Segmentación de Red y Resiliencia Operativa:** La segmentación inteligente evitó que el ransomware saltara desde la red corporativa de sucursales a los servidores de producción que procesan saldos y cuentas de clientes. Este principio de seguridad por diseño es pilar fundamental de la Ley 21.719.
5. **Planes de Respuesta ante Incidentes y Backups:** Tener planes de respuesta ensayados para aislar la red infectada rápidamente y sistemas de respaldo inmutables que permitan la restauración rápida del sistema sin necesidad de pagar rescates.

## Referencias

- [Reporte Oficial del Incidente del CSIRT de Gobierno de Chile](https://www.csirt.gob.cl)
- [Análisis y Cronología del Ataque a BancoEstado — Welivesecurity (ESET)](https://www.welivesecurity.com)
- [Comisión para el Mercado Financiero (CMF) — Comunicados de Supervisión Financiera](https://www.cmfchile.cl)
- [Prensa Local — La Tercera / BioBioChile](https://www.latercera.com)
