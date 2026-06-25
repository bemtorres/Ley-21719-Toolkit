# Caso 9: Sistema de Gestión Municipal y Sector Público
## Cumplimiento de la Ley N° 21.719 en la Administración del Estado

Este documento analiza la aplicación de la nueva normativa chilena a un **Sistema de Gestión Municipal** que administra registros civiles, permisos municipales, beneficios sociales, atención al vecino y transparencia activa.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Registro Civil e Identificación** | RUN, nombres, domicilio, estado civil, filiación, fecha de nacimiento. | Datos Personales | Identificación oficial, emisión de documentos y certificaciones. |
| **Permisos de Circulación** | Patente, infracciones de tránsito, licencia de conducir, puntos, SOAP. | Datos Personales | Control vehicular, recaudación y fiscalización municipal. |
| **Beneficios Sociales (SUF, PGU)** | Ingresos del grupo familiar, composición del hogar, discapacidad, situación socioeconómica. | Datos Personales / Sensibles (salud, condición económica) | Asignación y control de beneficios estatales. |
| **OIRS / Atención al Vecino** | Nombre, RUN, dirección, detalle del reclamo, geolocalización, datos de contacto. | Datos Personales | Gestión de solicitudes, reclamos y sugerencias ciudadanas. |
| **Transparencia Activa** | Remuneraciones de funcionarios, contrataciones, compras públicas. | Datos Personales (funcionarios) | Cumplimiento de la Ley 20.285 de Transparencia. |
| **Videovigilancia Municipal** | Imágenes de personas en espacios públicos, placas patentes. | Datos Personales / Biométricos | Seguridad ciudadana y control del espacio público. |
| **RRHH Municipal** | Datos laborales, licencias médicas, afiliación sindical, cargas familiares. | Datos Personales / Sensibles | Gestión de funcionarios públicos municipales. |

---

## 2. Bases Legales de Licitud en el Sector Público

1. **Obligación Legal (Art. 8 Ley 21.719):**
   Es la base principal para casi todo tratamiento en el sector público. La Ley 18.695 (Orgánica de Municipalidades) y las leyes sectoriales obligan a mantener registros de identificación, permisos, beneficios sociales y transparencia. No se requiere consentimiento para estas funciones.

2. **Misión de Interés Público:**
   La entrega de beneficios sociales (SUF, PGU), la fiscalización de actividades económicas locales y la gestión de emergencias comunitarias se amparan en esta base. El municipio actúa en ejercicio de potestades públicas conferidas por ley.

3. **Consentimiento del Titular:**
   Requerido para actividades no obligatorias como el envío de comunicaciones municipales de eventos culturales, la publicación de fotografías de vecinos en redes sociales del municipio, o encuestas de satisfacción voluntarias.

4. **Interés Legítimo:**
   Aplicable para la videovigilancia en espacios públicos (previa ponderación con derechos de los ciudadanos) y para la prevención de fraudes en beneficios sociales.

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> El sector público es responsable del tratamiento de datos más sensibles de la población (salud, situación socioeconómica, biométricos) y maneja bases de datos universales (Registro Civil). Cualquier infracción se considera de alta gravedad.

- **Acceso Indebido de Funcionarios:** Que un funcionario municipal acceda al Registro Civil o a fichas de beneficios sociales de un vecino sin una gestión administrativa activa que lo justifique, violando el principio de finalidad.
- **Publicación Excesiva en Transparencia Activa:** Publicar datos personales (RUN, domicilio, teléfono) de funcionarios o contratistas en portales de transparencia sin ofuscar la información sensible, excediendo lo requerido por la Ley 20.285.
- **Videovigilancia sin Regulación:** Instalar cámaras de seguridad en espacios públicos o edificios municipales sin señalética informativa, sin registro de actividades de tratamiento y sin evaluación de impacto.
- **Falta de Notificación de Brechas:** Municipios que no cuentan con un plan de respuesta ante incidentes (ciberataques a sistemas municipales) ni con protocolos para notificar a la APDP y a los titulares afectados en 72 horas.
- **Retención Indefinida de Expedientes:** Conservar expedientes de beneficios sociales o permisos por tiempo indefinido sin una política de retención y eliminación segura documentada en el RAT.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Control de Acceso Basado en Roles (RBAC) para Funcionarios
El sistema municipal debe implementar roles estrictos que impidan la navegación lateral entre módulos:

```
[Funcionario] -> {Autenticación}
    |-> Rol: Registro Civil     -> Módulo Identificación
    |-> Rol: Beneficios Sociales -> Módulo SUF/PGU
    |-> Rol: Rentas             -> Módulo Permisos
    |-> Rol: Administrativo     -> Módulo Transparencia
```

### B. Ofuscación de Datos en Transparencia Activa
Implementar un algoritmo de ofuscación automática que al publicar datos de funcionarios en portales de transparencia:
- Reemplace el RUN por formato `***.***.***-*`
- Elimine domicilios particulares (solo mostrar departamento/unidad)
- Ocultar teléfonos de contacto personal (solo correo institucional)

```python
# PYTHON: Ofuscador de datos personales para Transparencia Activa
import re

def ofuscar_run(run: str) -> str:
    partes = run.replace('.', '').split('-')
    if len(partes) == 2:
        return f"***.***.***-{partes[1]}"
    return run

def ofuscar_domicilio(domicilio: str) -> str:
    patron = r',\s*([^,]+),\s*([^,]+)$'
    match = re.search(patron, domicilio)
    if match:
        return f"Comuna de {match.group(1).strip()}, {match.group(2).strip()}"
    return domicilio
```

### C. Registro de Actividades de Tratamiento (RAT) para Municipios
Desarrollar un sistema interno de RAT digital donde cada unidad municipal registre:
- Tipo de datos tratados
- Base de licitud aplicable
- Plazo de conservación
- Medidas de seguridad implementadas
- Transferencias a terceros (ej. Gobierno Regional, Ministerios)

### D. Protocolo de Videovigilancia con Privacidad por Defecto
- Instalar señalética visible en todas las zonas monitoreadas (icono de cámara + QR con detalle del tratamiento)
- Implementar enmascaramiento automático de rostros en transmisiones públicas
- Establecer plazo máximo de retención de grabaciones (30 días por defecto)
- Realizar EIPD antes de instalar nuevos sistemas de reconocimiento facial o lectura de patentes

### E. Canal de Solicitudes ARCO-P para Ciudadanos
Habilitar un portal web o formulario presencial donde los vecinos puedan ejercer sus derechos:
- **Acceso:** Solicitar copia de todos sus datos almacenados en el municipio
- **Rectificación:** Corregir domicilio, estado civil u otros datos desactualizados
- **Cancelación:** Solicitar baja de datos en sistemas no obligatorios por ley
- **Oposición:** Oponerse al tratamiento de sus imágenes en videovigilancia (con excepciones de seguridad)

---

## 5. Ejemplos de Implementación

### Python: Middleware de ofuscación de RUN en respuestas API
```python
from functools import wraps
from flask import jsonify

def ofuscar_datos_sensibles(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        respuesta = func(*args, **kwargs)
        datos = respuesta.get_json()
        if isinstance(datos, dict) and 'run' in datos:
            datos['run'] = ofuscar_run(datos['run'])
        if isinstance(datos, dict) and 'domicilio' in datos:
            datos['domicilio'] = ofuscar_domicilio(datos['domicilio'])
        return jsonify(datos)
    return wrapper
```

### JavaScript: Componente para formulario ARCO-P ciudadano
```jsx
import React, { useState } from 'react';

function ArcoRequestForm() {
  const [derecho, setDerecho] = useState('acceso');
  const [run, setRun] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/v1/arco/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ derecho, run, descripcion })
    });
    alert('Solicitud ingresada. Plazo de respuesta: 30 días corridos.');
  };

  return (
    <form onSubmit={handleSubmit} className="arco-form">
      <h3>Ejercer mis derechos ARCO-P</h3>
      <label>Derecho a ejercer:
        <select value={derecho} onChange={e => setDerecho(e.target.value)}>
          <option value="acceso">Acceso</option>
          <option value="rectificacion">Rectificación</option>
          <option value="cancelacion">Cancelación (Supresión)</option>
          <option value="oposicion">Oposición</option>
          <option value="portabilidad">Portabilidad</option>
        </select>
      </label>
      <label>RUN:
        <input type="text" value={run} onChange={e => setRun(e.target.value)} required />
      </label>
      <label>Detalle de tu solicitud:
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </label>
      <button type="submit">Enviar Solicitud</button>
    </form>
  );
}
```

### PHP: Helper de ofuscación para publicaciones de transparencia activa
```php
<?php
function sanitizarPublicacionTransparencia(array $funcionario): array {
    $camposSensibles = ['run_completo', 'domicilio', 'telefono_personal', 'correo_personal'];
    foreach ($camposSensibles as $campo) {
        if (isset($funcionario[$campo])) {
            $funcionario[$campo] = '[DATOS PROTEGIDOS - Ley 21.719]';
        }
    }
    return [
        'nombre' => $funcionario['nombre'],
        'cargo' => $funcionario['cargo'],
        'remuneracion_bruta' => $funcionario['remuneracion_bruta'],
        'unidad' => $funcionario['unidad'],
        'correo_institucional' => $funcionario['correo_institucional']
    ];
}
?>
```

### Go: Validación de roles JWT con scopes municipales
```go
package main

import "github.com/golang-jwt/jwt/v4"

type MunicipalClaims struct {
    Run      string   `json:"run"`
    Rol      string   `json:"rol"`
    Unidad   string   `json:"unidad"`
    Scopes   []string `json:"scopes"`
    jwt.RegisteredClaims
}

func ValidateMunicipalAccess(claims *MunicipalClaims, requiredModule string) bool {
    moduleScopeMap := map[string]string{
        "registro_civil":    "municipal:rc:read",
        "beneficios":        "municipal:bs:read",
        "transparencia":     "municipal:transp:write",
        "videovigilancia":   "municipal:cctv:read",
    }
    requiredScope, exists := moduleScopeMap[requiredModule]
    if !exists {
        return false
    }
    for _, scope := range claims.Scopes {
        if scope == requiredScope {
            return true
        }
    }
    return false
}
```
