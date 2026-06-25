# Caso Real 7: Meta (Facebook) — Multa de €251 Millones por Almacenar Contraseñas en Texto Plano (2024)


## Resumen

En **diciembre de 2024**, la Comisión Irlandesa de Protección de Datos (DPC) multó a Meta Platforms Ireland Ltd. con **€251 millones** por una violación masiva de seguridad ocurrida en **2018**: cientos de millones de contraseñas de usuarios de Facebook fueron almacenadas en **texto plano (plaintext)** en sistemas internos, accesibles sin autenticación a más de 20.000 empleados de Meta. La violación estuvo oculta durante **12 años** (desde 2012).

## Datos Involucrados

| Aspecto | Detalle |
| :--- | :--- |
| **Usuarios afectados** | **~29 millones** de cuentas expuestas; cientos de millones de contraseñas almacenadas inseguramente |
| **Tipo de datos** | Contraseñas en texto plano (sin hash ni cifrado), accesibles en logs internos |
| **Período** | Contraseñas almacenadas inseguramente desde 2012; detectado internamente en 2018; multado en 2024 |
| **Acceso interno** | ~20.000 empleados de Meta podían consultar las contraseñas sin restricción |

## Causa Técnica

- Meta utilizaba un sistema de logging que capturaba contraseñas en texto plano al momento del inicio de sesión.
- Las contraseñas se almacenaban sin aplicar **hash** (como bcrypt, argon2 o SHA-256).
- No había controles de acceso automatizados para estos logs.
- Meta detectó el problema internamente en 2018 pero no lo notificó a la DPC hasta 2019.
- La DPC consideró que la demora en la notificación agravó la sanción.

## Multa / Sanción

| Concepto | Monto |
| :--- | :--- |
| **Multa** | €251 millones |
| **Base legal** | Art. 33 y 34 GDPR — notificación de brecha; Art. 32 — medidas de seguridad |
| **Medidas correctivas** | Meta debió rediseñar su sistema de logging, implementar cifrado y controles de acceso |
| **Período de investigación** | 5 años (2019-2024) |

## Lecciones para la Ley 21.719

1. **Nunca almacenar contraseñas en texto plano:** Es la violación más básica de seguridad. La Ley 21.719 exige medidas técnicas apropiadas; almacenar contraseñas sin hash es negligencia grave.
2. **Notificación de brecha:** Meta tardó un año en notificar. La Ley 21.719 exige notificación a la APDP **dentro de 72 horas** y a los afectados sin demora injustificada.
3. **Control de acceso interno:** 20.000 empleados no deberían tener acceso a datos sensibles. Principio de **mínimo privilegio**.
4. **Detección y respuesta:** La brecha ocurrió en 2012, se detectó en 2018 y se multó en 2024. La Ley 21.719 exige contar con un **plan de respuesta a incidentes**.
5. **Registro de actividades de tratamiento (RAT):** Si Meta hubiera tenido un RAT adecuado, habría identificado que estaba almacenando contraseñas inseguramente.

## Referencias

- [Irish DPC — Meta €251M decision (Dec 2024)](https://www.dataprotection.ie)
- [Meta disclosure — Password security incident 2019](https://about.fb.com)
- [DLA Piper — GDPR Fines Survey 2025](https://www.dlapiper.com)
- [GDPR Enforcement Tracker](https://www.enforcementtracker.com)
