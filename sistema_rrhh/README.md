# 👥 Caso 6: Sistema de Recursos Humanos y Reclutamiento (ATS)
## Cumplimiento de la Ley N° 21.719 en la Gestión del Ciclo de Vida Laboral

Este documento detalla la aplicación de la normativa chilena a un **Sistema de Recursos Humanos e Hiring (ATS - Applicant Tracking System)** que administra postulaciones de empleo, evaluaciones de candidatos, contratos laborales, liquidaciones de sueldo y registros de asistencia.

---

## 📊 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Justificación del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Reclutamiento (ATS)** | Currículum Vitae (CV), cartas de presentación, historial académico y laboral, notas de entrevistas. | Datos Personales | Evaluación de competencias para ocupar una vacante laboral. |
| **Ficha del Empleado** | RUT, estado civil, cargas familiares, afiliación a AFP e Isapre/Fonasa. | Datos Personales | Incorporación a la nómina, pago de cotizaciones de salud y previsión. |
| **Evaluaciones y Desempeño** | Evaluaciones de desempeño anuales, test de aptitud psicológica. | Datos Personales | Gestión del desarrollo de carrera y planes de capacitación. |
| **Seguridad Ocupacional** | Licencias médicas, exámenes pre-ocupacionales, registro de accidentes. | **Datos Sensibles (Salud)** | Cumplimiento de la normativa de seguridad laboral y licencias. |

---

## ⚖️ 2. Bases Legales de Licitud en Recursos Humanos

* **Relación Contractual o Precontractual:**
  * **Precontractual:** Evaluar el CV de un postulante a un puesto disponible.
  * **Contractual:** Gestionar la planilla de pagos (nómina), transferencias de sueldos y control de asistencia una vez contratado.
* **Obligación Legal (Código del Trabajo y Seguridad Social):**
  * La empresa está obligada por ley a registrar y pagar las cotizaciones previsionales de los trabajadores (AFP, Fonasa/Isapre, AFC, Mutual de Seguridad), así como llevar un registro de asistencia autorizado por la Dirección del Trabajo (DT).
* **Consentimiento Explícito:**
  * Obligatorio si la empresa desea mantener el CV de un candidato rechazado para vacantes futuras.
  * Obligatorio si la empresa realiza exámenes de salud que no son requeridos por ley para el desempeño del cargo.

---

## 🛑 3. Riesgos Críticos bajo la Ley N° 21.719

> [!WARNING]
> La gestión de personas involucra una alta cantidad de datos financieros y de salud. Compartir o retener indebidamente esta información expone a la empresa a graves multas.

* **Conservación Indefinida de CVs de Candidatos:** Mantener en el sistema ATS las carpetas y currículums de personas que postularon hace años y fueron rechazadas, sin contar con su consentimiento expreso para almacenar sus datos para futuras vacantes.
* **Filtros Discriminatorios Automatizados:** Utilizar herramientas de Inteligencia Artificial en el ATS para descartar de forma automática a candidatos por variables sensibles (ej. género, dirección de residencia, edad) sin supervisión humana.
* **Exposición de Liquidaciones o Licencias:** Que jefes de área u otros empleados tengan acceso a las liquidaciones de sueldo, descuentos sindicales o causas médicas de las licencias de sus compañeros de trabajo por fallas en los permisos del sistema.

---

## 🛠️ 4. Medidas de Adecuación Técnica y Organizativa

### A. Políticas de Retención de Datos en Selección
* Configurar el sistema ATS para que aplique un borrado automatizado de postulaciones tras finalizar el proceso de selección.
* Si el candidato no es seleccionado pero la empresa desea conservar su perfil: enviar un correo automático solicitando consentimiento explícito para mantener sus datos por un periodo máximo de tiempo (ej. 1 año). Si el usuario no responde o rechaza, los datos deben borrarse automáticamente del sistema.

```
[Fin de Proceso de Selección]
             │
             ▼
    ¿Fue Contratado?
      ├── Sí ──► Se transfiere a la Ficha de Empleado
      └── No ──► Enviar correo solicitando guardar CV
                  ├── Acepta ──► Conservar por 12 meses (máximo)
                  └── Rechaza/No responde ──► Borrado automático del ATS
```

### B. Seguridad en el Registro de Asistencia
* Si el sistema de asistencia utiliza **datos biométricos** (ej. huella digital o reconocimiento facial en reloj control):
  * El sistema no debe almacenar la imagen real de la huella, sino un vector de coordenadas encriptado.
  * Se debe contar con la debida certificación del sistema por parte de la Dirección del Trabajo y la política interna de privacidad de datos biométricos firmada por el trabajador.

### C. Control de Accesos Fino (RBAC) en RRHH
* Restringir el acceso a la información confidencial mediante roles estrictos:
  * **Analista de Selección:** Acceso exclusivo a módulos de postulación y CVs.
  * **Encargado de Remuneraciones:** Acceso a cuentas bancarias y liquidaciones, sin acceso a fichas médicas detalladas.
  * **Prevencionista de Riesgos:** Acceso a fichas de accidentes del trabajo y licencias médicas, sin acceso al módulo de remuneraciones.
