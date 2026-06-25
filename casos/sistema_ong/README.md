# Caso 15: Fundaciones, ONGs y Organizaciones Sociales
## Cumplimiento de la Ley N° 21.719 en el Tercer Sector

Este documento analiza la aplicación de la normativa chilena a un **Sistema de Gestión de ONGs** que administra datos de donantes, beneficiarios de programas sociales, voluntarios, campañas de fundraising e investigación con datos sensibles.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Registro de Donantes** | RUN, nombres, correo, monto de donación, historial de aportes. | Datos Personales / Financieros | Gestión de donaciones y emisión de certificados (Ley de Donaciones). |
| **Beneficiarios de Programas** | Nombre, RUN, dirección, situación socioeconómica, composición familiar, discapacidad. | Datos Personales / Sensibles | Asignación y seguimiento de beneficios sociales. |
| **Ficha de Salud (según programa)** | Diagnósticos, tratamientos, condiciones crónicas, datos de menores. | Datos Sensibles (Salud) | Atención médica o psicosocial de beneficiarios. |
| **Voluntarios** | RUN, datos de contacto, disponibilidad, habilidades, antecedentes. | Datos Personales | Coordinación de actividades de voluntariado. |
| **Investigación y Evaluación** | Datos agregados de beneficiarios, encuestas, mediciones de impacto. | Datos Personales / Anonimizados | Medición de impacto social y reportes a financiadores. |
| **Fundraising Digital** | Cookies, comportamiento en sitio web, segmentación de donantes. | Datos de Comportamiento | Campañas de captación de donantes. |

---

## 2. Bases Legales de Licitud en ONGs

1. **Consentimiento del Titular:**
   Es la base principal para el tratamiento de datos de beneficiarios, especialmente cuando involucra datos sensibles (salud, situación socioeconómica) o de menores de edad. El consentimiento debe ser libre, informado y específico para cada programa.

2. **Interés Legítimo:**
   Aplicable para la gestión de donantes (mantener registro histórico) y para la coordinación de voluntarios, siempre que no prevalezcan los derechos del titular.

3. **Obligación Legal:**
   - **Ley 19.885 (Donaciones con Fines Sociales):** Exige mantener registro de donantes para certificar donaciones con beneficio tributario.
   - **Ley 21.015 (Inclusión Laboral):** En programas de inserción laboral.

4. **Misión de Interés Público:**
   Cuando la ONG ejecuta programas delegados por el Estado (convenios con ministerios o municipios), el tratamiento de datos se ampara en la misión de interés público.

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> Las ONGs suelen manejar datos de poblaciones especialmente vulnerables (niños, personas en situación de calle, víctimas de violencia, enfermos) sin contar con los recursos técnicos ni la asesoría legal de grandes empresas. Esto las expone a riesgos críticos.

- **Falta de Recursos para Cumplimiento:** ONGs pequeñas que no tienen presupuesto para DPD, EIPD o medidas de ciberseguridad, operando con hojas de cálculo compartidas sin control de acceso.
- **Tratamiento de Datos de Menores sin Consentimiento Parental:** Programas sociales que atienden a niños sin verificar la edad ni obtener el consentimiento del apoderado, especialmente crítico para menores de 14 años.
- **Uso Indebido de Fotos de Beneficiarios:** Publicar fotografías de beneficiarios (niños, familias en situación vulnerable) en redes sociales, sitios web o campañas de fundraising sin consentimiento explícito y escrito.
- **Transferencia de Datos a Financiadores Internacionales:** Enviar bases de datos de beneficiarios a ONGs matrices en el extranjero o a agencias de cooperación sin contratos de transferencia ni cláusulas de protección de datos.
- **Investigación sin Consentimiento Informado:** Realizar encuestas o estudios de impacto utilizando datos personales de beneficiarios sin informarles claramente del propósito, la duración y sus derechos ARCO-P.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Consentimiento Adaptado a Poblaciones Vulnerables
Diseñar formularios de consentimiento en lenguaje simple (no legalés) y en formatos accesibles:

```html
<div class="consent-form-simple">
  <h3>¿Podemos guardar tus datos?</h3>
  <p>Para ayudarte con [Programa], necesitamos guardar alguna información tuya.
     Esto es confidencial y solo lo usará el equipo del programa.</p>
  <label class="consent-option">
    <input type="checkbox" name="basic_data">
    Sí, pueden guardar mi nombre, RUN y teléfono para coordinarme las visitas.
  </label>
  <label class="consent-option">
    <input type="checkbox" name="sensitive_data">
    Sí, pueden guardar información de mi salud para darme la atención adecuada.
  </label>
  <label class="consent-option">
    <input type="checkbox" name="photos">
    Si, pueden sacar fotos durante las actividades para mostrar el trabajo.
    <small>(Puedes cambiar de opinión después.)</small>
  </label>
</div>
```

### B. Protección Especial de Datos de Menores
Si el programa atiende a niños:
- Menores de 14 años: Consentimiento obligatorio del apoderado por escrito
- Adolescentes (14-17): Consentimiento del adolescente + autorización del apoderado para datos sensibles
- Nunca publicar fotos de menores sin autorización expresa y revocable del apoderado
- Implementar flujo de verificación de identidad del apoderado (no basta un mail)

### C. Anonimización de Datos para Reportes a Financiadores
Antes de compartir datos de impacto con financiadores, aplicar técnicas de anonimización:

```python
# PYTHON: Anonimización de datos para reportes de impacto
import hashlib

def anonymize_for_report(beneficiary):
    return {
        'id': hashlib.sha256(str(beneficiary['run']).encode()).hexdigest()[:12],
        'rango_edad': f"{(beneficiary['edad'] // 10) * 10}-{(beneficiary['edad'] // 10) * 10 + 9}",
        'comuna': beneficiary['comuna'],
        'genero': beneficiary['genero'],
        'programa': beneficiary['programa'],
        'indicadores': beneficiary['indicadores']
    }
```

### D. RBAC para Sistemas de ONGs con Recursos Limitados
- **Equipo de terreno:** Solo lectura de fichas de beneficiarios asignados
- **Coordinación:** Acceso a todos los beneficiarios del programa, sin datos financieros
- **Administración:** Acceso a datos de donantes y financiamiento, sin acceso a fichas de beneficiarios
- **Voluntarios:** Solo acceso a datos de contacto logístico, nunca a datos sensibles

### E. Presupuesto Mínimo de Ciberseguridad para ONGs
Para ONGs con recursos limitados, priorizar:
1. Cifrado de disco en todos los equipos que almacenen datos de beneficiarios
2. Autenticación de dos factores en todos los accesos al sistema
3. Copias de seguridad cifradas con rotación semanal
4. Uso de gestor de contraseñas (Bitwarden, 1Password) en lugar de hojas de cálculo
5. Contrato de Encargado de Tratamiento con cualquier proveedor cloud
