# IT Compliance Audit Framework: Ley N° 21.719 (Chile)
## Marco de Auditoría de Sistemas de Software (English & Español)

This framework provides software development teams, CTOs, and compliance managers with a structured checklist and criteria to audit any software application against the requirements of the new Chilean Personal Data Protection Law (Ley 21.719).

Este marco proporciona a los equipos de desarrollo, directores de tecnología (CTOs) y oficiales de cumplimiento una lista de verificación estructurada para auditar cualquier aplicación de software frente a la nueva Ley de Protección de Datos de Chile (Ley N° 21.719).

---

## 🇺🇸 ENGLISH VERSION: Audit Dimensions & Checkpoints

This audit evaluates the platform across **6 key dimensions**, each containing **4 technical checkpoints** (total of 24 controls).

### 1. Legal Basis & Consent
* **[LBC-1] Consent Modality:** Consent must be free, specific, informed, and unambiguous. Form checkboxes must be unchecked by default. No pre-ticked or general checkboxes.
* **[LBC-2] Purpose Limitation:** Data collected must only be used for the specified purpose. No reuse of customer databases for secondary marketing without consent.
* **[LBC-3] Data Minimization:** The system must only request data strictly necessary for processing. Evaluate if optional fields are clearly labeled.
* **[LBC-4] Legal Justification:** Ensure every database entity containing personal data has an explicit legal basis assigned (Consent, Contract, Legal Obligation, or Legitimate Interest).

### 2. Data Subject Rights (ARCO-P)
* **[ARCO-1] Right of Access:** Users must have a self-service portal or a simple mechanism to view all personal data stored about them.
* **[ARCO-2] Right of Rectification:** Users must be able to update, correct, or complete their details directly from their account profile.
* **[ARCO-3] Right of Erasure (Cancelation):** A clear "Delete Account" or erasure request system must exist. Deleted accounts must trigger cascade deletion in databases and backups within a reasonable timeframe (e.g., 30 days).
* **[ARCO-4] Right of Portability:** Users must be able to export their data in a structured, machine-readable format (JSON, CSV, or XML) via a simple download option.

### 3. Security & Breach Notification
* **[SBN-1] Encryption at Rest:** Sensitive personal data, passwords (using strong hashing like Argon2 or bcrypt), and health/financial details must be encrypted at rest in the database.
* **[SBN-2] Access Auditing (Logs):** Every access to or modification of sensitive data must write an immutable audit log recording: user ID, timestamp, data accessed, and operation.
* **[SBN-3] Encryption in Transit:** All client-server communication must enforce HTTPS/TLS 1.3. Internal microservice-to-microservice APIs must also be encrypted.
* **[SBN-4] Breach Detection and Notification:** The company must have an automated monitoring system to detect security incidents and a pre-defined protocol to notify the Regulator (APDP) and affected users within 72 hours.

### 4. Special Protections (Sensitive & Minors' Data)
* **[SPM-1] Sensitive Data Categorization:** Health, biometric, genetic, and behavioral profiling data must be isolated and subjected to strict access control (RBAC).
* **[SPM-2] Age Verification:** Systems targeting K-12, teens, or children must verify age. Children under 14 require parent/guardian consent.
* **[SPM-3] Biometric Hashing:** Biometric data (face scan, fingerprint) must be converted into irreversible hashes. Storing raw facial images or actual fingerprint files is prohibited.
* **[SPM-4] Impact Assessment (DPIA):** High-risk treatments (mass tracking, profiling, processing sensitive/minor's data) must undergo a pre-release Data Protection Impact Assessment.

### 5. Governance & Accountability
* **[GOV-1] Data Protection Officer (DPO):** A qualified DPO must be formally appointed if required (mass data, public sector, or certified MPI).
* **[GOV-2] Prevention Model (MPI):** The company must document and implement an Infraction Prevention Model (risk matrix, policies, audit history) certified by the APDP.
* **[GOV-3] Data Inventory:** A complete register of all data processing activities (data mapping, storage locations, retention times) must be maintained and updated.
* **[GOV-4] Internal Training:** Regular privacy and security compliance workshops must be conducted for engineering and operations teams.

### 6. Cross-Border Transfers
* **[CBT-1] Infrastructure Mapping:** The geographical location (country and region) of all cloud servers, databases, and CDN endpoints must be mapped.
* **[CBT-2] Adequacy & Safeguards:** For servers outside Chile, check if the country has an Adequacy Decision from the APDP. Otherwise, verify Standard Contractual Clauses (SCCs) are signed with cloud providers (AWS, Azure, Google Cloud).
* **[CBT-3] Third-Party API Audit:** Audit external SaaS services used (analytics, messaging, CRMs) to ensure they do not store user data in unsafe jurisdictions without safeguards.
* **[CBT-4] User Transparency:** The Privacy Policy must clearly state which countries user data is transferred to and for what purpose.

---

## 🇪🇸 VERSIÓN EN ESPAÑOL: Dimensiones de Auditoría y Puntos de Control

Esta auditoría evalúa la plataforma a través de **6 dimensiones clave**, cada una con **4 puntos de control técnico** (total de 24 controles).

### 1. Licitud y Consentimiento
* **[LBC-1] Modalidad de Consentimiento:** El consentimiento debe ser libre, específico, informado e inequívoco. Las casillas en los formularios deben estar desmarcadas por defecto. Se prohíbe el consentimiento premarcado.
* **[LBC-2] Limitación de la Finalidad:** Los datos recopilados solo deben utilizarse para la finalidad específica declarada. Se prohíbe reutilizar bases de datos de clientes para marketing secundario sin consentimiento.
* **[LBC-3] Minimización de Datos:** El sistema solo debe solicitar los datos estrictamente necesarios para su funcionamiento. Evaluar si los campos opcionales están debidamente identificados.
* **[LBC-4] Justificación Legal:** Garantizar que cada entidad de base de datos que almacena datos personales tenga asignada una base de licitud válida (Consentimiento, Contrato, Obligación Legal o Interés Legítimo).

### 2. Derechos de los Titulares (ARCO-P)
* **[ARCO-1] Derecho de Acceso:** Los usuarios deben contar con un portal de autoservicio o un canal directo para ver la totalidad de sus datos personales almacenados en el sistema.
* **[ARCO-2] Derecho de Rectificación:** Los usuarios deben poder modificar, corregir o actualizar sus datos de perfil directamente desde su cuenta de usuario.
* **[ARCO-3] Derecho de Cancelación (Supresión):** Debe existir un mecanismo claro de "Eliminar Cuenta". Las solicitudes de eliminación deben gatillar el borrado en cascada en bases de datos y respaldos en un tiempo determinado (máximo 30 días).
* **[ARCO-4] Derecho de Portabilidad:** Los usuarios deben poder descargar sus datos en un formato estructurado y de lectura mecánica (JSON, CSV o XML) mediante un botón simple.

### 3. Seguridad y Notificación de Brechas
* **[SBN-1] Cifrado en Reposo:** Los datos personales sensibles, contraseñas (usando algoritmos fuertes como Argon2 o bcrypt) y registros de salud o financieros deben almacenarse encriptados en la base de datos.
* **[SBN-2] Registro de Accesos (Logs):** Cada acceso o modificación de datos sensibles debe registrarse de manera inalterable detallando: ID del usuario, marca de tiempo, dato consultado y operación realizada.
* **[SBN-3] Cifrado en Tránsito:** Todas las comunicaciones cliente-servidor y las APIs de microservicios internos deben forzar el uso de HTTPS/TLS 1.3.
* **[SBN-4] Detección y Reporte de Brechas:** La empresa debe contar con monitoreo automatizado de intrusiones y un protocolo pre-establecido para notificar a la Agencia (APDP) y a los usuarios afectados en un plazo máximo de 72 horas desde detectado el incidente.

### 4. Protecciones Especiales (Datos Sensibles y Menores)
* **[SPM-1] Categorización de Datos Sensibles:** Los datos de salud, biométricos, genéticos y perfiles conductuales deben estar segmentados lógicamente y protegidos con accesos restringidos (RBAC).
* **[SPM-2] Validación de Edad:** Plataformas dirigidas a niños o adolescentes deben validar la edad del usuario. Menores de 14 años requieren obligatoriamente el consentimiento del padre/madre/tutor.
* **[SPM-3] Hashing Biométrico:** Los datos biométricos (rostro, huella) deben ser convertidos a hashes vectoriales irreversibles. Se prohíbe el almacenamiento de fotos crudas del rostro o archivos de huellas dactilares.
* **[SPM-4] Evaluación de Impacto (EIPD/DPIA):** Tratamientos de alto riesgo (rastreo masivo, perfilamiento, menores) deben realizar una Evaluación de Impacto antes de pasar a producción.

### 5. Gobernanza y Responsabilidad (Accountability)
* **[GOV-1] Delegado de Protección de Datos (DPD):** Nombrar formalmente un DPD calificado (obligatorio en el sector público, tratamientos masivos o si se cuenta con un MPI).
* **[GOV-2] Modelo de Prevención (MPI):** Documentar e implementar un Modelo de Prevención de Infracciones (matriz de riesgos, políticas, auditorías) certificado ante la APDP.
* **[GOV-3] Inventario de Tratamientos:** Mantener actualizado un registro de todas las actividades de procesamiento de datos, flujos de datos, almacenamiento y tiempos de retención.
* **[GOV-4] Capacitación Interna:** Realizar talleres periódicos sobre ciberseguridad, privacidad de datos y cumplimiento normativo para los equipos de ingeniería y operaciones.

### 6. Transferencias Internacionales de Datos
* **[CBT-1] Mapeo de Infraestructura:** Identificar y documentar la ubicación geográfica (país y región) de todos los servidores en la nube, bases de datos y CDNs del sistema.
* **[CBT-2] Salvaguardas Contractuales:** Si se usan servidores fuera de Chile, verificar si el país tiene Decisión de Adecuación o, en su defecto, suscribir Cláusulas Contractuales Tipo (CCT) con el proveedor de la nube (AWS, Azure, Google Cloud).
* **[CBT-3] Auditoría de APIs Terceras:** Auditar los servicios SaaS externos (analítica, CRMs, pasarelas) para asegurar que no almacenen datos de usuarios chilenos en jurisdicciones inseguras sin resguardo.
* **[CBT-4] Transparencia en la Política:** Declarar explícitamente en la Política de Privacidad a qué países se transfieren datos del usuario y para qué fines.
