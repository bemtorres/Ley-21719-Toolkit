# Caso Real 2: Grupo GTD — Secuestro de Datos por Ransomware Rorschach (2023)


## Resumen

El **23 de octubre de 2023**, la empresa de telecomunicaciones chilena **GTD** sufrió un grave ataque de ransomware que afectó a su plataforma de Infraestructura como Servicio (IaaS). Para contener la propagación, la compañía desconectó preventivamente sus sistemas de data center, lo que provocó una caída masiva de servicios (telefonía IP, internet, VPN y hosting) para más de 3.000 clientes corporativos y entidades públicas del Estado chileno, tales como Fonasa, Correos de Chile y el Servicio de Impuestos Internos (SII). El ciberataque fue ejecutado con una variante de malware extremadamente rápida llamada **Rorschach** (o **BabLock**).

## Datos Expuestos y Afectados

| Categoría | Detalle |
| :--- | :--- |
| **Tipo de Incidente** | Cifrado y secuestro de datos (Ransomware) con extorsión. |
| **Entidades Afectadas** | Fonasa, SII, Correos de Chile y más de 3.000 clientes corporativos privados. |
| **Datos Involucrados** | Fichas de bases de datos empresariales, respaldos de sistemas y servidores virtuales de clientes. |
| **Consecuencia Principal** | Indisponibilidad absoluta de servicios y sistemas críticos durante varios días. |
| **Volumen** | Múltiples Terabytes de información cifrada en la nube IaaS de GTD. |

## Causa Técnica

- Infiltración mediante una variante sofisticada de ransomware (**Rorschach**) que destaca por su velocidad de cifrado en entornos virtuales.
- Posible compromiso inicial de credenciales de administración o vulnerabilidad en hipervisores de virtualización sin parchar.
- Falta de segmentación de red estricta entre la infraestructura de administración del data center y las máquinas virtuales de los clientes.
- Políticas de respaldos en línea (*hot backups*) que también fueron alcanzadas o cifradas por el ransomware, retrasando la restauración.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna sanción bajo la Ley 19.628. La Subtel abrió un proceso de investigación de calidad de servicio, pero sin enfoque en privacidad. |
| **Marco legal vigente** | Ley 19.628 y regulaciones de telecomunicaciones tradicionales. |
| **Con Ley 21.719** | Sería una infracción **gravísima** por parte del proveedor (Encargado) si se demuestra negligencia en la seguridad física de los servidores. El Responsable y el Encargado arriesgarían multas de hasta **20.000 UTM** o el **4% de los ingresos anuales**. |
| **Responsabilidad Civil** | GTD enfrentó reclamos de indemnización de clientes comerciales debido a pérdidas por la interrupción prolongada del negocio. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Responsabilidad de los Proveedores (Encargados):** Bajo la Ley 21.719, los proveedores de software y servicios en la nube (IaaS/SaaS) tienen responsabilidades legales directas de seguridad y deben firmar contratos DPA regulados.
2. **Planes de Continuidad y Respaldos Aislados:** Las políticas de respaldo deben incluir respaldos fuera de línea (*offline* o *immutable backups*) que no puedan ser cifrados en caso de compromiso total de la red.
3. **Notificación de Incidentes en Cascada:** El Encargado (GTD) habría tenido la obligación legal de notificar al Responsable (sus clientes corporativos) en un plazo mínimo (ej. 24 horas) para permitirles mitigar riesgos y cumplir con la ventana de 72 horas de cara a la APDP.
4. **Segmentación de Red (Zero Trust):** Los accesos de administración a hipervisores y consolas cloud deben requerir autenticación multifactor (MFA) y estar aislados de las redes públicas de internet.

## Referencias

- [Análisis del ataque en GTD — WeLiveSecurity (ESET)](https://www.welivesecurity.com)
- [Reporte de prensa — La Tercera](https://www.latercera.com)
- [Comunicados oficiales del CSIRT de Gobierno de Chile](https://www.csirt.gob.cl)
