# Caso 14: Plataforma de Bienes Raíces y Proptech
## Cumplimiento de la Ley N° 21.719 en el Sector Inmobiliario

Este documento detalla la aplicación de la normativa chilena a un **Sistema Inmobiliario** que gestiona arriendos, ventas de propiedades, evaluaciones crediticias, contratos de arriendo, datos de arrendatarios y videovigilancia en edificios.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Publicación de Propiedades** | Dirección, metros cuadrados, precio, fotos, videos. | Datos de la Propiedad | Oferta comercial (datos del inmueble, no personales). |
| **Solicitud de Arriendo** | RUN, ingresos, liquidaciones de sueldo, contratos laborales, referencias. | Datos Personales / Financieros | Evaluación de solvencia del arrendatario. |
| **Contrato de Arriendo** | Datos del arrendador y arrendatario, garantías, cláusulas, testigos. | Datos Personales | Formalización del arriendo. |
| **Garantías y Depósitos** | Datos bancarios, cheques, pólizas de seguro de arriendo. | Datos Financieros | Respaldo de cumplimiento del contrato. |
| **Gestión de Gastos Comunes** | Consumos individuales, gastos comunes, morosidad, contacto de emergencia. | Datos Personales | Administración del edificio o condominio. |
| **Videovigilancia Edificio** | Imágenes de residentes, visitas, proveedores, patentes. | Datos Personales / Biométricos | Seguridad del edificio. |
| **Historial de Morosidad** | Registro de deudas, atrasos, protestos. | Datos Financieros / Comerciales | Evaluación de riesgo crediticio futuro. |

---

## 2. Bases Legales de Licitud en el Sector Inmobiliario

1. **Ejecución de un Contrato:**
   Base para la gestión del contrato de arriendo, cobro de rentas, gestión de garantías y gastos comunes.

2. **Interés Legítimo:**
   Aplicable para la evaluación de solvencia del arrendatario (previa ponderación y minimización de datos) y para la videovigilancia en espacios comunes del edificio.

3. **Obligación Legal:**
   - **Ley 21.442 (Arrendamiento):** Exige contrato escrito y registro de datos del arrendatario.
   - **Servicio de Impuestos Internos:** Obligación de declarar rentas de arriendo.

4. **Consentimiento:**
   Requerido para el tratamiento de datos biométricos (control de acceso con huella o reconocimiento facial en el edificio).
   Requerido para compartir datos de contacto con terceros (servicios de mantención, mudanzas).

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> El sector inmobiliario maneja datos financieros y de morosidad que pueden afectar el acceso a la vivienda. La Ley 21.719 refuerza la protección contra discriminación arbitraria en la evaluación de arrendatarios.

- **Evaluación Crediticia Automatizada sin Transparencia:** Rechazar una solicitud de arriendo basándose en un score automatizado (algoritmo de riesgo) sin informar al solicitante qué factores se evaluaron ni dar derecho a revisión humana.
- **Publicación de Listas de Morosidad:** Publicar en el edificio o en grupos de WhatsApp listas de vecinos morosos en gastos comunes, violando su derecho a la privacidad.
- **Videovigilancia Invasiva:** Cámaras apuntando a la puerta de departamentos (no solo a espacios comunes), o sistemas de reconocimiento facial sin consentimiento de residentes ni registro de tratamiento.
- **Solicitud Excesiva de Datos:** Pedir a los postulantes a arriendo datos desproporcionados (estado civil, religión, afiliación política, fotos familiares) que no son relevantes para evaluar solvencia.
- **Retención Indefinida de Datos de Postulantes Rechazados:** Conservar las carpetas completas (liquidaciones, contratos, referencias) de personas que postularon a una propiedad y fueron rechazadas, sin consentimiento para su conservación futura.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Minimización de Datos en Solicitudes de Arriendo
Establecer un formulario de solicitud que solo solicite datos estrictamente necesarios:

```
 Datos requeridos para evaluación:
   * RUN
   * Ingresos mensuales (declaración simple o liquidación)
   * Tipo de contrato (indefinido, plazo fijo, honorarios)
   * Referencia laboral (opcional, solo con consentimiento)

 Datos que NO deben solicitarse:
   * Estado civil
   * Religión
   * Fotografías familiares
   * Redes sociales
   * Lugar de trabajo específico (solo tipo de contrato)
```

### B. Transparencia en Decisiones Automatizadas
```javascript
// JAVASCRIPT: Módulo de transparencia para scoring de arrendatarios
function explainArrendatarioScore(application) {
  const factors = [
    { name: 'Ingresos', weight: 40, value: application.income > 2.5 ? 'Alto' : 'Medio' },
    { name: 'Estabilidad laboral', weight: 25, value: application.contractType === 'indefinido' ? 'Alta' : 'Media' },
    { name: 'Historial crediticio', weight: 20, value: application.creditHistory === 'limpio' ? 'Bueno' : 'Regular' },
    { name: 'Capacidad de pago', weight: 15, value: `Ratio ${application.income/application.rent}x` }
  ];
  return {
    totalScore: calculateScore(factors),
    factors: factors,
    decision: calculateScore(factors) > 60 ? 'APROBADO' : 'RECHAZADO',
    appealUrl: '/api/v1/appeal/' + application.id
  };
}
```

### C. Gestión de Videovigilancia en Edificios
- Instalar señalética visible con QR que lleve a un detalle del tratamiento de imágenes
- Establecer un plazo máximo de retención de 30 días para grabaciones (excepto eventos de seguridad)
- Implementar enmascaramiento automático de rostros en transmisiones públicas
- Realizar EIPD antes de instalar sistemas de reconocimiento facial o lectura de patentes

### D. Política de Datos de Postulantes Rechazados
- Configurar el sistema para borrar automáticamente los datos de postulantes rechazados tras 30 días
- Si se desea conservar para futuras propiedades, enviar un correo solicitando consentimiento explícito
- Sin respuesta del postulante: borrado automático

### E. Portal de Arrendatarios con Derechos ARCO-P
Habilitar un portal donde el arrendatario pueda:
- Acceder a todos sus datos almacenados (incluyendo su historial de pagos)
- Rectificar datos de contacto o referencias desactualizadas
- Solicitar la cancelación de sus datos al término del contrato (con excepciones de retención legal)
- Descargar su historial de pagos para portabilidad
