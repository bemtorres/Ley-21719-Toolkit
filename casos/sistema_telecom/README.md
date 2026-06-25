# Caso 11: Empresa de Telecomunicaciones
## Cumplimiento de la Ley N° 21.719 en Operadores de Telefonía e Internet

Este documento analiza la aplicación de la normativa chilena a un **Sistema de Telecomunicaciones** que gestiona registros de llamadas (CDR), geolocalización de torres, datos de tráfico de internet, perfiles de consumo y atención al cliente.

---

## 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Facturación y Contrato** | RUN, nombres, dirección, plan contratado, datos bancarios. | Datos Personales | Gestión comercial y cobro de servicios. |
| **Registros de Llamadas (CDR)** | Número origen/destino, fecha, hora, duración, torre de conexión. | Datos Personales / Tráfico | Facturación, calidad de servicio y seguridad de red. |
| **Geolocalización de Torres** | IMSI/IMEI del equipo, torre conectada, coordenadas aproximadas. | Datos Personales | Encaminamiento de llamadas y emergencias (Ley 21.094). |
| **Navegación Internet** | Direcciones IP asignadas, sitios visitados (DNS logs), horarios de conexión. | Datos Personales / Comportamiento | Gestión de red, seguridad y cumplimiento legal. |
| **Atención al Cliente** | Grabaciones de llamadas, chat transcripts, reclamos, historial de gestiones. | Datos Personales | Soporte técnico y gestión de reclamos (Ley 21.398). |
| **Perfil de Consumo** | GB consumidos, minutos usados, roaming, preferencias de contenido. | Datos de Comportamiento | Ofertas comerciales y retención de clientes. |

---

## 2. Bases Legales de Licitud en Telecomunicaciones

1. **Ejecución de un Contrato:**
   Base principal para prestar el servicio de telecomunicaciones: facturación, encaminamiento de llamadas, provisión de internet.

2. **Obligación Legal:**
   - **Ley 21.094 (Ley de Telecomunicaciones):** Exige conservar registros de tráfico (CDR, IP asignadas) por hasta 3 años para fines de seguridad pública y requerimientos judiciales.
   - **Ley 21.398 (Ley del Consumidor):** Obliga a registrar y responder reclamos en un plazo determinado.

3. **Consentimiento Explícito:**
   Necesario para el uso de datos de navegación con fines de marketing y ofertas personalizadas.
   Necesario para compartir datos de geolocalización con terceros (apps, publicidad).

4. **Interés Legítimo:**
   Aplicable para la seguridad de la red (detección de intrusiones, ataques DDoS) y para la gestión de emergencias (911/133).

---

## 3. Riesgos Críticos bajo la Ley N° 21.719

> Las telecomunicaciones tienen acceso a la geolocalización en tiempo real y a todo el tráfico de comunicaciones de una persona. El volumen masivo de datos y la sensibilidad de los CDR los convierten en un blanco de alto riesgo.

- **Geolocalización sin Consentimiento:** Rastrear la ubicación del usuario mediante triangulación de torres para fines comerciales (ofertas en zonas cercanas) sin consentimiento explícito.
- **Retención Excesiva de Datos de Navegación:** Conservar registros de sitios web visitados por los usuarios por tiempo indefinido, cuando la ley solo faculta su retención por 3 años y para fines específicos de seguridad.
- **Venta de Datos de Navegación:** Compartir o vender bases de datos de perfiles de navegación (anonymizados o no) a empresas de publicidad o analytics sin base legal válida.
- **Acceso de Funcionarios a Grabaciones:** Que personal de atención al cliente o técnico acceda a grabaciones de llamadas o contenido de comunicaciones sin necesidad operativa ni autorización del titular.
- **Falta de Encriptación en Tránsito Interno:** Transmitir CDR y datos de geolocalización entre nodos de la red interna sin cifrado, exponiéndolos a interceptaciones.

---

## 4. Medidas de Adecuación Técnica y Organizativa

### A. Segmentación de Datos de Tráfico vs. Datos Comerciales
- Almacenar CDR, logs DNS y datos de geolocalización en **bases de datos separadas** de los sistemas de facturación y CRM
- Aplicar políticas de acceso diferenciadas: el equipo comercial no puede acceder a CDR, el equipo de red no ve datos de pago

### B. Minimización y Retención Forzosa de Datos de Navegación
```python
# PYTHON: Script de purge automático de logs DNS mayores a 3 años
from datetime import datetime, timedelta

def purge_expired_traffic_logs():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Ley 21.094: Máximo 3 años de retención de CDR y registros de tráfico
    cutoff_date = datetime.utcnow() - timedelta(days=365*3)
    cursor.execute("DELETE FROM dns_logs WHERE timestamp < %s", (cutoff_date,))
    cursor.execute("DELETE FROM cdr_records WHERE call_date < %s", (cutoff_date,))
    cursor.execute("DELETE FROM ip_assignments WHERE assigned_at < %s", (cutoff_date,))
    conn.commit()
    print(f"Purged logs older than {cutoff_date.date()}")
```

### C. Panel de Privacidad para el Cliente
Desarrollar un portal de autoservicio donde el cliente pueda:
- Visualizar qué datos de tráfico y geolocalización almacena la compañía
- Descargar sus registros de llamadas y consumo (portabilidad)
- Activar/desactivar el uso de datos de navegación para fines comerciales
- Configurar preferencias de comunicación marketing

### D. Cifrado de Comunicaciones Internas
- Todo CDR transmitido entre centrales telefónicas debe usar TLS o IPsec
- Las grabaciones de llamadas de servicio al cliente deben almacenarse cifradas con acceso restringido por roles
- Los logs DNS deben almacenarse con seudonimización de direcciones IP (hash + salt)

### E. Procedimiento de Atención a Requerimientos Judiciales
Implementar un sistema de gestión de requerimientos que:
1. Valide la legitimidad del requerimiento (tribunal, fiscalía, etc.)
2. Registre en un log inmutable qué datos se entregaron y a quién
3. Notifique al DPD de la compañía
4. Informe al titular cuando legalmente proceda (Art. 10 Ley 21.719)
