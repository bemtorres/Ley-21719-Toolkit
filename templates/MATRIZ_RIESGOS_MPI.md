# TEMPLATE: MATRIZ DE RIESGOS - MODELO DE PREVENCIÓN DE INFRACCIONES (MPI)
## Ley 21.719 - Art. 49 letra c) - DS 662/2025

---

## Escala de Evaluación

| Nivel | Probabilidad | Impacto | Riesgo |
|-------|-------------|---------|--------|
| B (Bajo) | Improbable (1 vez en 5+ años) | Sin consecuencias legales significativas | 1-3 |
| M (Medio) | Posible (1 vez cada 1-3 años) | Infracción leve o grave, multa < 5.000 UTM | 4-6 |
| A (Alto) | Probable (1+ vez al año) | Infracción gravísima, multa > 20.000 UTM o 4% ingresos | 7-9 |

---

## Matriz de Riesgos

| N | Actividad de Tratamiento | Riesgo Identificado | Probab. | Impacto | Nivel Riesgo | Controles Actuales | Riesgo Residual | Acciones de Mitigación | Responsable | Plazo |
|---|-------------------------|---------------------|---------|---------|-------------|--------------------|-----------------|----------------------|-------------|-------|
| 1 | Registro de usuarios | Fuga de contraseñas por hash débil | A | A | 9 | Uso de bcrypt con coste 10 | M (4) | Migrar a Argon2id, auditoría trimestral | CISO | Q3 2026 |
| 2 | Datos de clientes en CRM | Acceso no autorizado de empleados | M | A | 6 | Autenticación simple | M (4) | Implementar 2FA + logs de acceso | TI | Q3 2026 |
| 3 | Marketing por correo | Envío masivo sin consentimiento | M | A | 6 | Consentimiento en registro | M (4) | Implementar Consent Manager | Producto | Q4 2026 |
| 4 | Datos de salud | Filtración por cifrado débil | B | A | 5 | Cifrado AES-128 | B (2) | Migrar a AES-256-GCM | CISO | Q4 2026 |
| 5 | Datos de menores | Tratamiento sin consentimiento parental | M | A | 6 | Validación de edad | M (4) | Flujo de verificación parental completo | Producto | Q3 2026 |
| 6 | Transferencia internacional | Datos en servidores sin CCT | M | A | 6 | Contrato con proveedor US | M (4) | Firmar DPA con CCT | Legal | Q3 2026 |
| 7 | Solicitudes ARCO-P | Incumplimiento de plazo de 30 días | M | M | 4 | Proceso manual | M (4) | Sistema de tickets automatizado | DPD | Q1 2027 |
| 8 | Notificación de brechas | No notificar en 72 horas | B | A | 5 | Procedimiento documentado | B (2) | Implementar alertas automáticas | CISO | Q4 2026 |
| 9 | Videovigilancia | Cámaras sin señalética | A | M | 5 | Ninguno | A (5) | Instalar señalética + registro RAT | Operaciones | Q3 2026 |
| 10 | Decisiones automatizadas | Falta de transparencia en scoring | M | A | 6 | Ninguno | M (4) | Implementar módulo de explicabilidad | Producto | Q1 2027 |
| 11 | Datos de empleados | Acceso a liquidaciones por no autorizados | M | M | 4 | RBAC básico | B (2) | Revisar roles y permisos | RRHH | Q3 2026 |
| 12 | Cookies de terceros | Instalación sin consentimiento | A | A | 9 | Banner de cookies | M (6) | Implementar CMP con TCF 2.2 | Producto | Q4 2026 |
| 13 | Almacenamiento cloud | Datos en región no autorizada | B | A | 5 | Configuración por defecto | B (2) | Terraform compliance + auditoría | CISO | Q3 2026 |
| 14 | Capacitación | Personal no capacitado en privacidad | A | M | 5 | Inducción básica | M (4) | Programa anual de formación | DPD | Q4 2026 |
| 15 | Canal de denuncias | Inexistencia de canal anónimo | M | M | 4 | Ninguno | M (4) | Implementar sistema de denuncias | Compliance | Q1 2027 |

---

## Resumen de Riesgos

| Nivel | Cantidad | Acción Requerida |
|-------|----------|-----------------|
| Crítico (7-9) | [N] | Mitigación inmediata (< 30 días) |
| Alto (5-6) | [N] | Plan de acción en 90 días |
| Medio (3-4) | [N] | Monitoreo trimestral |
| Bajo (1-2) | [N] | Mantener controles |

---

## Historial de Revisiones

| Fecha | Versión | Realizada por | Comentarios |
|-------|---------|--------------|-------------|
| | 1.0 | | Documento inicial |
| | | | |
