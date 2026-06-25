# Caso Real 4: Poder Judicial de Chile — Infección Masiva con Ransomware LockBit (2022)


## Resumen

El **26 de septiembre de 2022**, el Poder Judicial de Chile detectó una infección masiva de ransomware que afectó a equipos de su red interna. La infección, provocada por una variante del ransomware **LockBit Black** (LockBit 3.0), cifró y bloqueó aproximadamente **150 computadores** institucionales de cortes de apelaciones y juzgados a lo largo de todo el país. El incidente obligó a suspender temporalmente audiencias y a prohibir a los funcionarios adjuntar archivos en correos electrónicos para contener la propagación del malware.

## Datos Afectados

| Categoría | Detalle |
| :--- | :--- |
| **Tipo de Incidente** | Cifrado y secuestro de estaciones de trabajo (Ransomware). |
| **Equipos Afectados** | ~150 terminales con sistemas operativos obsoletos (Windows 7). |
| **Datos Comprometidos** | Archivos locales de trabajo, escritos judiciales y plantillas almacenadas en los computadores infectados. |
| **Impacto Operativo** | Retraso en la tramitación de causas y audiencias, y restricción preventiva en los canales de comunicación de los funcionarios. |
| **Atacante / Malware** | Variante LockBit Black / LockBit 3.0. |

## Causa Técnica

- Mantención de sistemas operativos obsoletos (**Windows 7**) sin soporte oficial de parches de seguridad de Microsoft en la red corporativa.
- Software antivirus desactualizado (McAfee) en los endpoints afectados, que no fue capaz de detectar las firmas del malware LockBit 3.0.
- Falta de políticas estrictas de actualización de parches y gestión de vulnerabilidades centralizada en los terminales de los funcionarios.
- Carencia de control de privilegios de usuario local, permitiendo que un archivo malicioso ejecutado por un usuario tuviera permisos para instalar y propagar el ransomware en el terminal.

## Multa / Sanción

| Aspecto | Detalle |
| :--- | :--- |
| **Multa aplicada** | Ninguna. Las instituciones del Estado están sujetas a responsabilidad administrativa y contraloría, pero sin multas de protección de datos en ese período. |
| **Marco legal vigente** | Ley 19.628 y leyes orgánicas del Poder Judicial. |
| **Con Ley 21.719** | Sería una infracción **grave** debido a la falta de actualización tecnológica y ciberseguridad mínima (antivirus obsoletos y SO sin soporte). Las entidades públicas, bajo la Ley 21.719, deben cumplir con los mismos estándares de seguridad de datos y pueden ser sancionadas o amonestadas públicamente en el Registro Nacional de Sanciones, además de enfrentar responsabilidades de sumarios internos. |

## Lecciones para la Adecuación a la Ley 21.719

1. **Gestión del Ciclo de Vida del Software (Patch Management):** Banish de la infraestructura crítica cualquier sistema operativo sin soporte (ej. Windows 7, Windows Server 2008, bases de datos obsoletas). La obsolescencia es una negligencia grave de seguridad.
2. **Seguridad en Endpoints (EDR/XDR):** Los antivirus tradicionales basados en firmas estáticas ya no son suficientes para frenar variantes de ransomware modernas. Se requiere implementar soluciones de detección y respuesta en endpoints (EDR).
3. **Capacitación en Phishing:** La mayoría de las infecciones de ransomware comienzan con un correo de phishing que engaña al funcionario. La capacitación obligatoria (exigida en la dimensión 5 del framework) es crucial.
4. **Principio de Mínimo Privilegio:** Los funcionarios judiciales o administrativos no deben tener privilegios de Administrador local en sus estaciones de trabajo para impedir la instalación accidental de software malicioso.

## Referencias

- [Reporte del ciberataque al Poder Judicial — BioBioChile](https://www.biobiochile.cl)
- [Análisis de ciberseguridad y LockBit — CSIRT de Chile](https://www.csirt.gob.cl)
- [Estudio de vulnerabilidades en el sector público — Alessandri Abogados](https://www.alessandri.legal)
