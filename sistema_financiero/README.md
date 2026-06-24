# 💳 Caso 5: Sistema Financiero y Plataforma Fintech
## Cumplimiento de la Ley N° 21.719 en Servicios Financieros y Créditos Digitales

Este documento aborda la adecuación legal de un **Sistema Financiero / Fintech** que procesa evaluaciones de riesgo de crédito, datos bancarios, saldos transaccionales y validación de identidad biométrica.

---

## 📊 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Validación de Identidad (KYC)** | Fotos de cédula de identidad, escaneo facial 3D, huella dactilar. | **Datos Sensibles (Biométricos)** | Prevención de suplantación de identidad y lavado de activos (Know Your Customer). |
| **Evaluación Crediticia** | Renta líquida, deudas activas, patrimonio, historial de comportamiento comercial (ej. Dicom). | Datos Financieros / Comerciales | Determinación del perfil de riesgo del solicitante. |
| **Módulo Transaccional** | Saldos de cuentas, transferencias enviadas/recibidas, compras con tarjetas. | Datos Personales / Financieros | Ejecución de operaciones financieras y detección de fraudes. |

---

## ⚖️ 2. Bases Legales de Licitud en Fintech

* **Obligación Legal (UAF / CMF):**
  * Las instituciones financieras y Fintech reguladas tienen el deber legal de identificar fehacientemente a sus clientes para prevenir el lavado de activos (Ley 19.913) y reportar transacciones sospechosas a la Unidad de Análisis Financiero (UAF).
* **Ejecución de un Contrato:**
  * Es la base para la apertura de cuentas corrientes, tarjetas prepago o la entrega de un crédito de consumo.
* **Consentimiento Explícito:**
  * Requerido para capturar y procesar **datos biométricos** (reconocimiento facial) para validar la identidad en enrolamientos móviles. El cliente debe consentir que su patrón facial sea contrastado con bases de datos autorizadas (ej. Registro Civil).

---

## 🛑 3. Riesgos Críticos bajo la Ley N° 21.719

> [!CAUTION]
> El sector financiero es el blanco preferido de los ciberdelincuentes. La pérdida de control de datos financieros o biométricos constituye una infracción **gravísima** con multas de hasta **20.000 UTM** (o el **4% de los ingresos anuales** del infractor), además del daño reputacional.

* **Decisiones 100% Automatizadas sin Transparencia:** Rechazar una solicitud de crédito mediante un algoritmo automatizado de Inteligencia Artificial (scoring crediticio) sin informar al usuario de los parámetros evaluados ni otorgarle el derecho a impugnar la decisión y exigir intervención humana.
* **Fuga de Plantillas Biométricas:** Almacenar imágenes faciales o huellas dactilares sin encriptar o en formatos que puedan ser reconstruidos por atacantes para burlar la seguridad de otros sistemas.
* **Acceso Interno no Restringido:** Permitir que ejecutivos de atención al cliente consulten el detalle de la cartola de transacciones de un usuario sin que exista un requerimiento de soporte activo o autorización del cliente.

---

## 🛠️ 4. Medidas de Adecuación Técnica y Organizativa

### A. Derechos ante la Inteligencia Artificial y Decisiones Automatizadas
Si la Fintech utiliza algoritmos de Machine Learning para otorgar o denegar créditos:
* **Transparencia:** Se debe informar de forma inteligible al cliente qué variables se evalúan (renta, antigüedad, etc.).
* **Derecho de Impugnación:** El sistema debe proveer un flujo para que el cliente que fue "rechazado por el sistema" pueda solicitar que un analista humano revise su caso y exprese su punto de vista.

```
[Solicitud de Crédito]
         │
         ▼
 [Algoritmo Scoring] ──► Denegado (Automático)
         │
         ├─────────────────────────────────────────┐
         ▼ (Derecho del Usuario)                   ▼ (Explicabilidad)
[Impugnación: Solicita Revisión Humana]     [Explicar variables que afectaron]
```

### B. Seguridad Avanzada de Datos Biométricos
* Las imágenes de rostros capturadas para el enrolamiento deben ser transformadas inmediatamente a un **hash o vector biométrico unidireccional** (no reversible). Las imágenes crudas deben eliminarse una vez verificada la identidad.
* Uso obligatorio de técnicas de "Prueba de Vida" (Liveness Detection) para evitar fraudes con fotografías o deepfakes.

### C. Designación del DPD y Oficial de Cumplimiento
* La Fintech debe nombrar formalmente a un **Delegado de Protección de Datos (DPD)**, quien trabajará en conjunto con el Oficial de Cumplimiento de Lavado de Activos para mapear los riesgos y realizar Evaluaciones de Impacto (EIPD) anuales de los procesos de scoring.
