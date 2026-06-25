# Caso 13: Plataforma de Gaming, Casinos Online y eSports
## Cumplimiento de la Ley N° 21.719 en Entretenimiento Digital

Este documento detalla la aplicación de la normativa chilena a un **Sistema de Gaming y Apuestas Online** que gestiona cuentas de jugadores, transacciones financieras, verificación de identidad, geolocalización, chat de voz y perfiles de comportamiento de juego.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Registro y KYC** | RUN, nombres, fecha de nacimiento, selfie, documento de identidad. | Datos Personales / Biométricos | Verificación de identidad y edad mínima legal. |
| **Geolocalización** | Coordenadas GPS, IP, dirección aproximada. | Datos Personales | Validación de ubicación permitida para apuestas. |
| **Juego y Transacciones** | Historial de apuestas, depósitos, retiros, saldos, bonos. | Datos Financieros | Operación de la plataforma de juego. |
| **Perfil de Comportamiento** | Frecuencia de juego, montos apostados, horarios, juegos preferidos. | Datos de Comportamiento | Prevención de ludopatía y ofertas personalizadas. |
| **Chat y Comunidad** | Mensajes de chat, voz, foros, reportes de abuso. | Datos Personales | Interacción social y moderación de contenido. |
| **Anti-Fraude y Anti-Bot** | Patrones de juego, velocidad de clics, huella digital del dispositivo. | Datos Personales / Inferencia | Detección de bots, colusión y fraudes. |

---

## 2. Bases Legales de Licitud en Gaming

1. **Ejecución de un Contrato:**
   Base para la creación de la cuenta, procesamiento de depósitos y retiros, y entrega del servicio de juego.

2. **Obligación Legal:**
   - **Ley 19.995 (Casinos):** Exige KYC completo, verificación de edad (>21 años para casinos físicos, >18 para online según la regulación aplicable), y reporte de operaciones sospechosas a la UAF.
   - **Ley 19.913:** Prevención de lavado de activos.

3. **Consentimiento Explícito:**
   Requerido para el tratamiento de datos biométricos (selfie + documento) para verificación de identidad.
   Requerido para el uso de datos de comportamiento con fines de marketing y ofertas personalizadas.

4. **Interés Legítimo:**
   Aplicable para la prevención de fraudes, detección de bots y colusión, y para el juego responsable (detección de patrones de ludopatía).

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> El gaming online combina datos financieros, biométricos, de menores (en juegos free-to-play) y de comportamiento sensible (ludopatía). Es uno de los sectores más fiscalizados y con mayor exposición a sanciones.

- **Acceso de Menores de Edad:** Fallas en el sistema de verificación de edad que permitan a menores de 14 años crear cuentas y apostar sin consentimiento parental, o a menores de 18 jugar en plataformas de apuestas.
- **Perfilamiento de Ludopatía sin Consentimiento:** Utilizar algoritmos de detección de juego problemático (pérdidas frecuentes, horas extendidas) para ofrecer más crédito o bonos en lugar de intervenir con medidas de juego responsable.
- **Exposición de Datos Biométricos:** Almacenar selfies y fotos de documentos de identidad sin cifrado o en formato accesible, exponiendo a los usuarios a suplantación de identidad.
- **Transferencia Internacional de Datos Financieros:** Enviar datos de transacciones a procesadores de pago o plataformas de juego matrices en el extranjero sin las salvaguardas contractuales exigidas.
- **Falta de Canal de Autoexclusión:** No implementar un mecanismo efectivo para que los jugadores se autoexcluyan de la plataforma o limiten sus pérdidas (juego responsable).

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Sistema de Verificación de Edad Robusto
Implementar un flujo de KYC con múltiples capas:

```python
# PYTHON: Flujo de verificación de edad con IA + documentación
def verify_age_and_identity(user_data):
    age = calculate_age(user_data.birthdate)
    # Capa 1: Menores de 14 -> Bloqueo total + flujo parental
    if age < 14:
        return {"status": "BLOCKED", "reason": "MINOR_UNDER_14", "action": "PARENTAL_CONSENT_REQUIRED"}
    # Capa 2: 14-17 años -> Consentimiento del apoderado obligatorio
    if age < 18:
        send_parental_consent_email(user_data.parent_email, user_data.id)
        return {"status": "PENDING_PARENTAL", "action": "EMAIL_SENT"}
    # Capa 3: Mayor de edad -> Verificación biométrica estándar
    if user_data.selfie and user_data.id_document:
        verification = verify_biometric(user_data.selfie, user_data.id_document)
        return {"status": "VERIFIED" if verification else "REJECTED"}
```

### B. Módulo de Juego Responsable
El sistema debe incluir herramientas obligatorias de juego responsable:
- **Límites de depósito:** Configurable por el usuario (diario, semanal, mensual)
- **Autoexclusión:** Opción de bloquearse por 1 mes, 6 meses, 1 año o indefinido
- **Tiempo real:** Alertas de tiempo de juego y notificación de pérdidas
- **Realidad de pérdidas:** Panel visible con total neto de ganancias/pérdidas (no solo saldo disponible)

### C. Cifrado y Eliminación de Datos Biométricos
- Las selfies y fotos de documentos deben convertirse a vectores biométricos irreversibles inmediatamente después de la verificación
- Los archivos raw deben eliminarse de forma segura (sobrescritura + delete)
- Implementar liveness detection para evitar fraudes con fotos estáticas

### D. Sistema de Detección de Ludopatía con Enfoque Ético
- El algoritmo de detección de patrones de riesgo debe activar **intervenciones de protección**, no ofertas agresivas
- Cuando se detecten patrones de juego problemático: activar restricciones automáticas, enviar alerta al jugador, y notificar al DPD
- Nunca utilizar datos de vulnerabilidad para incrementar el gasto del jugador

### E. Bloqueo Geográfico y Validación de IP
- Verificar la ubicación del usuario antes de permitir apuestas
- Mantener lista blanca de jurisdicciones permitidas (Chile y países con acuerdos)
- Bloquear accesos desde VPNs y proxys conocidos
- Registrar cambios de ubicación sospechosos como eventos de seguridad
