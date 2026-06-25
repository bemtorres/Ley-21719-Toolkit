# Caso 12: Plataforma de Publicidad y Marketing Digital (AdTech)
## Cumplimiento de la Ley N° 21.719 en Ecosistemas de Publicidad Programática

Este documento analiza la adecuación legal de un **Ecosistema AdTech** que opera con Real-Time Bidding (RTB), cookies de terceros, píxeles de seguimiento, segmentación conductual y perfiles algorítmicos de usuarios.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Plataforma DSP (Demand-Side)** | Cookies, IDFA/GAID, IP, user agent, historial de navegación, intereses inferidos. | Datos Personales / Comportamiento | Compra automatizada de impresiones publicitarias. |
| **Plataforma SSP (Supply-Side)** | Datos del inventario, perfil del sitio, geolocalización del usuario, categorías de contenido. | Datos Personales | Venta de espacios publicitarios en sitios y apps. |
| **Data Management Platform (DMP)** | Segmentos de audiencia, cruce de datos offline/online, datos enriquecidos de terceros. | Datos Personales / Inferencia | Creación de audiencias segmentadas para campañas. |
| **Píxeles de Conversión** | Productos vistos, carritos abandonados, compras realizadas, valor de transacción. | Datos Personales / Comportamiento | Medición de ROI de campañas y retargeting. |
| **Email Marketing / CRM** | Correo electrónico, nombre, historial de compras, preferencias declaradas. | Datos Personales | Campañas de email marketing y automatización. |

---

## 2. Bases Legales de Licitud en AdTech

1. **Consentimiento Explícito (Opt-in):**
   Es la base principal para la publicidad programática y el retargeting. Las cookies de terceros, el píxel de seguimiento y la creación de perfiles conductuales requieren consentimiento libre, específico, informado e inequívoco. No se acepta consentimiento tácito ni casillas premarcadas.

2. **Interés Legítimo:**
   Aplicable para la medición de audiencias agregadas, la prevención de fraudes publicitarios y la seguridad de la plataforma (detección de bots). Se requiere ponderación documentada.

3. **Ejecución de un Contrato:**
   Para el funcionamiento técnico necesario del sitio (cookies estrictamente necesarias para la sesión). No aplica para cookies de seguimiento o publicitarias.

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> El ecosistema AdTech se basa en el rastreo masivo de usuarios sin que estos tengan control real sobre sus datos. La Ley 21.719 considera el perfilamiento conductual sin consentimiento como una infracción gravísima.

- **Real-Time Bidding sin Consentimiento:** Transmitir datos del usuario (IP, cookies, ubicación, intereses) a decenas de empresas en una subasta RTB sin que el usuario haya dado su consentimiento explícito para cada finalidad.
- **Fingerprinting Encubierto:** Utilizar técnicas de fingerprinting (huella del navegador, canvas fingerprinting, audio fingerprinting) para rastrear usuarios que han rechazado las cookies, violando su decisión de no consentimiento.
- **Data Enrichment sin Transparencia:** Comprar datos de audiencias de terceros (DMPs) y cruzarlos con bases de datos propias sin informar al usuario ni contar con una base legal.
- **Retargeting Invasivo:** Mostrar anuncios de productos que el usuario acaba de comprar o ha visto una sola vez, generando una sensación de vigilancia constante.
- **Falta de Mecanismo de Revocación:** No permitir al usuario revocar su consentimiento para publicidad conductual de forma tan sencilla como lo otorgó.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Consent Management Platform (CMP) con Granularidad
Implementar un banner de cookies que cumpla con:
- **Rechazo por defecto:** Ninguna cookie no esencial está activa sin acción del usuario
- **Granularidad:** Separar finalidades (necesarias, analíticas, publicitarias, redes sociales)
- **TCF 2.2 (IAB):** Integrar con el marco de transparencia para proveedores AdTech
- **Botón de Rechazar Todo:** Tan visible como "Aceptar Todo"

```javascript
// JAVASCRIPT: Estructura de consentimiento granular para CMP
const consentConfig = {
  purposes: {
    strictly_necessary: { default: true, required: true },
    analytics: { default: false, vendors: ['GA4', 'Mixpanel'] },
    advertising: {
      default: false,
      vendors: ['GoogleAds', 'Meta', 'DV360', 'TTD'],
      legal_basis: 'consent'
    },
    personalization: { default: false, vendors: ['Optimizely'] },
    social_media: { default: false, vendors: ['Meta', 'LinkedIn'] }
  },
  recordConsent(userChoice) {
    const record = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      choices: userChoice,
      version: '2.0'
    };
    localStorage.setItem('ley21719_consent', JSON.stringify(record));
    fetch('/api/v1/consent/record', { method: 'POST', body: JSON.stringify(record) });
  }
};
```

### B. Supresión de Datos en Subastas RTB
Implementar un middleware que valide el consentimiento del usuario antes de enviar su perfil a la subasta RTB:

```python
# PYTHON: Middleware de validación de consentimiento para bid requests
@app.route('/api/v1/rtb/bid-request', methods=['POST'])
def rtb_bid_request():
    user_consent = get_user_consent(request.cookies.get('user_id'))
    if not user_consent or not user_consent.get('advertising'):
        return jsonify({
            "error": "User has not consented to advertising",
            "minimal_bid": True,
            "data": {
                "content_category": request.json.get('page_category'),
                "device_type": request.json.get('device_type', 'unknown')
            }
        }), 200
    return forward_to_dsp(request.json)
```

### C. Política de Retención de Perfiles
- Perfiles conductuales: Máximo 12 meses desde el último evento registrado
- Cookies de terceros: Duración máxima de 90 días para cookies publicitarias
- Implementar job automático que elimine perfiles inactivos y renueve consentimientos

### D. Transparencia en el Ecosistema de Proveedores
Mantener un registro público actualizado de todos los proveedores AdTech que reciben datos del usuario:
- Lista de DSPs, SSPs, DMPs y plataformas de medición
- Jurisdicción de cada uno
- Base legal invocada para la transferencia
- Enlace a sus políticas de privacidad
