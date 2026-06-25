# Caso Real 3: IFX Networks — Ransomware en la Nube y Parálisis de Mercado Público (2023)


## Resumen

El **12 de septiembre de 2023**, el proveedor regional de infraestructura tecnológica **IFX Networks** sufrió un ciberataque de ransomware perpetrado por el grupo cibercriminal **RansomHouse**. El secuestro de los sistemas y el cifrado de las máquinas virtuales paralizaron cientos de plataformas en Colombia, Chile y otros países de la región. En Chile, el impacto más crítico ocurrió en la plataforma de licitaciones estatales **Mercado Público (ChileCompra)**, la cual quedó completamente inoperativa por más de una semana, obligando al Estado a suspender todas las licitaciones públicas en curso y a levantar un sitio de contingencia con otro proveedor.

## Datos Expuestos y Afectados

| Categoría | Detalle |
| :--- | :--- |
| **Tipo de Incidente** | Ciberataque de Ransomware (secuestro de datos) con cifrado de servidores virtuales. |
| **Entidades Afectadas** | Mercado Público (ChileCompra) y múltiples servicios de compras estatales. |
| **Datos Involucrados** | Expedientes de licitaciones públicas, cotizaciones, datos de proveedores del Estado y registros de transacciones. |
| **Impacto Principal** | Pérdida de disponibilidad y parálisis total del mercado de compras públicas de Chile durante 8 días. |
| **Atacante** | Grupo RansomHouse. |

## Causa Técnica

- Compromiso de la infraestructura central de virtualización (hipervisores VMware ESXi) de IFX Networks que alojaba los servidores de Mercado Público.
- Ejecución de ransomware diseñado específicamente para cifrar sistemas de almacenamiento corporativo a nivel de bloques.
- Falta de un sitio de recuperación ante desastres (*Disaster Recovery Plan - DRP*) georreferenciado e independiente para Mercado Público que permitiera levantar el sistema de inmediato.
- Dependencia de un único proveedor de infraestructura crítica sin contingencia activa multicloud.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna por parte del regulador de datos (inexistente). ChileCompra abrió investigaciones contractuales contra IFX por fallas de SLA. |
| **Marco legal vigente** | Ley 19.628 de protección de datos y leyes de compras públicas. |
| **Con Ley 21.719** | IFX Networks (como Encargado del Tratamiento) y ChileCompra (como Responsable) habrían enfrentado investigaciones estrictas sobre la suficiencia de sus medidas de seguridad. Al tratarse de servicios críticos del Estado, las sanciones asociadas y multas habrían alcanzado el tope de **20.000 UTM**. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Gobernanza de Terceros (SLA & DPA):** La contratación de servicios en la nube requiere auditorías periódicas de seguridad. Las empresas de software deben exigir a sus proveedores de hosting certificaciones de seguridad (como ISO 27001 o SOC 2).
2. **Disponibilidad como Dimensión de Seguridad:** La Ley 21.719 define la seguridad de los datos incluyendo la garantía de su **disponibilidad**. Un sistema inaccesible debido a un ataque cibernético constituye una brecha de seguridad que debe ser notificada y mitigada.
3. **Planes de Contingencia Multicloud:** Las plataformas críticas deben contar con arquitecturas redundantes (ej. balanceo entre AWS y Azure, o data centers locales alternos) para asegurar la continuidad del servicio ante incidentes graves del proveedor principal.
4. **Resguardo de Backups Aislados:** Los respaldos deben ser almacenados bajo el principio de inmutabilidad y en ubicaciones lógicas/físicas totalmente desconectadas del entorno de producción.

## Referencias

- [Reporte de incidente del CSIRT de Gobierno de Chile](https://www.csirt.gob.cl)
- [Comunicados oficiales de normalización — Mercado Público](https://www.mercadopublico.cl)
- [Análisis técnico de RansomHouse y ataques a ESXi — CISA / Cybersecurity Reports](https://www.cisa.gov)
