# Caso 10: Compañía de Seguros y Corredores
## Cumplimiento de la Ley N° 21.719 en el Sector Asegurador

Este documento detalla la adecuación legal de un **Sistema de Seguros** que gestiona la contratación de pólizas, evaluación de riesgos (suscripción), siniestros, datos de salud y pagos de indemnizaciones.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Cotización y Contratación** | RUN, nombres, ingresos, bienes asegurados, historial de seguros previos. | Datos Personales | Evaluación de riesgo y emisión de pólizas. |
| **Declaración de Salud (Vida/Salud)** | Enfermedades preexistentes, historial clínico, hábitos de consumo, IMC. | Datos Sensibles (Salud) | Suscripción de seguros de vida y salud. |
| **Siniestros** | Detalle del evento, testigos, peritajes, fotos, informes médicos, denuncias. | Datos Personales / Sensibles | Investigación y liquidación de siniestros. |
| **Score Asegurador (Underwriting)** | Perfil de riesgo calculado, algoritmos de pricing, segmentación actuarial. | Datos de Comportamiento / Inferencia | Decisión automatizada de pricing y aceptación. |
| **Pagos e Indemnizaciones** | Datos bancarios, historial de primas, montos pagados. | Datos Financieros | Cobro de primas y pago de siniestros. |
| **Prevención de Fraudes** | Alertas de inconsistencia, patrones sospechosos, cruce con bases externas. | Datos Personales | Detección y prevención de fraudes al seguro. |

---

## 2. Bases Legales de Licitud en Seguros

1. **Ejecución de un Contrato:**
   Es la base para la emisión de la póliza, el cobro de primas y el pago de indemnizaciones. El tomador solicita voluntariamente el servicio.

2. **Obligación Legal:**
   La CMF (Comisión para el Mercado Financiero) exige a las aseguradoras mantener registros de pólizas, siniestros y provisiones técnicas por un plazo mínimo de 10 años.

3. **Consentimiento Explícito:**
   Requerido para la declaración de salud y datos médicos sensibles. El tomador debe autorizar expresamente que la aseguradora acceda, procese y almacene su historial clínico para evaluar el riesgo.
   También se requiere para compartir datos con reaseguradoras internacionales.

4. **Interés Legítimo:**
   Aplicable para la prevención de fraudes (cruce de datos entre compañías a través del Registro de Siniestros) y para la segmentación actuarial, previa ponderación de derechos.

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> Las aseguradoras procesan datos sensibles de salud y toman decisiones automatizadas que pueden afectar gravemente la vida financiera de las personas. Las infracciones se clasifican como gravísimas.

- **Decisiones Automatizadas sin Transparencia:** Rechazar una solicitud de seguro o aumentar la prima basándose en un algoritmo de scoring sin informar al solicitante los factores evaluados ni otorgar derecho a revisión humana.
- **Uso Indebido de Datos de Salud:** Utilizar los datos de enfermedades preexistentes declarados para un seguro de vida con fines distintos (ej. ofrecer productos de otra compañía del holding) sin consentimiento.
- **Transferencia Internacional de Datos a Reaseguradoras:** Enviar bases de datos de siniestros y salud a reaseguradoras en el extranjero sin contar con Cláusulas Contractuales Tipo (CCT) o Decisiones de Adecuación.
- **Perfilamiento Discriminatorio:** Utilizar variables sensibles (comuna de residencia, origen étnico inferido, género) en los modelos de pricing, lo que constituye discriminación arbitraria.
- **Retención Excesiva de Declaraciones de Salud:** Conservar declaraciones de salud de prospectos que nunca contrataron o de pólizas terminadas hace años, sin una política de eliminación documentada.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Transparencia en Decisiones Automatizadas (Scoring)
El sistema debe implementar un módulo de explicabilidad para las decisiones de suscripción:

```
[Solicitud de Seguro]
        |
        v
[Algoritmo Underwriting] ---> Precio o Rechazo?
        |
        +---> Si es Rechazo: Generar informe automático con variables clave
        |     "Su prima se vio afectada por: edad, historial de siniestros, comuna"
         |     Botón: "Solicitar Revisión Humana"
        |
        +---> Si es Aceptado: Mostrar desglose de factores considerados
```

### B. Consentimiento Granular para Datos de Salud
Rediseñar el flujo de declaración de salud con casillas independientes:

```
[ ] Autorizo a [Aseguradora] a tratar mis datos de salud declarados para
    la evaluación de esta solicitud de seguro. (Requerido para contratar)

[ ] Autorizo la conservación de mi declaración de salud por hasta 5 años
    para facilitar renovaciones futuras. (Opcional)

[ ] Autorizo el envío de mis datos de salud anonimizados a reaseguradoras
    internacionales con fines de reaseguro. (Requerido para contratar)
```

### C. Cifrado de Datos de Salud en Reposo y Tránsito
- Las tablas de declaraciones de salud deben usar cifrado a nivel de columna (AES-256-GCM)
- Los archivos adjuntos (exámenes, informes médicos) deben almacenarse cifrados con claves rotadas periódicamente
- Todo acceso a datos de salud debe registrarse en un log de auditoría inmutable

### D. Política de Retención de Datos
- **Declaraciones de salud:** 5 años desde el término de la póliza (plazo de prescripción)
- **Siniestros:** 10 años (exigencia CMF)
- **Datos de prospectos no contratantes:** 6 meses si no se obtuvo consentimiento para conservación
- Implementar scripts automáticos de purge que ejecuten la eliminación segura al cumplirse los plazos

### E. Canal de Revisión Humana de Decisiones Automatizadas
El sistema debe proveer un flujo para que el asegurado o solicitante pueda:
1. Solicitar explicación de la decisión automatizada (derecho de información)
2. Solicitar revisión por un suscriptor humano (derecho de impugnación)
3. Recibir respuesta fundada en un plazo máximo de 15 días hábiles
