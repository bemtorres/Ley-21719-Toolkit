const AUDIT_FRAMEWORK = {
  metadata: {
    title: {
      en: "Ley 21.719 IT Compliance Auditor Framework",
      es: "Framework Auditor de Cumplimiento TI Ley 21.719"
    },
    version: "1.0.0",
    lastUpdated: "2026-06-24"
  },
  categories: [
    {
      id: "lbc",
      title: {
        en: "Legal Basis & Consent",
        es: "Licitud y Consentimiento"
      },
      description: {
        en: "Verifies that all data processing acts on a valid legal ground and respects the freedom of choice of the user.",
        es: "Verifica que todo procesamiento de datos se base en una causa legal válida y respete la libertad de elección del usuario."
      },
      questions: [
        {
          id: "LBC-1",
          code: "LBC-1",
          weight: 5,
          criticality: "high",
          text: {
            en: "Are all consent checkboxes in forms deselect (unchecked) by default, avoiding pre-ticked checkboxes?",
            es: "¿Están todas las casillas de consentimiento en los formularios desmarcadas por defecto, evitando casillas pre-marcadas?"
          },
          recommendation: {
            en: "Modify UI/UX components. Ensure all opt-in mechanisms require a positive, active, and unambiguous action from the user. Never bundle multiple consents into a single checkbox.",
            es: "Modificar los componentes UI/UX. Asegurar que todos los mecanismos de opt-in requieran una acción positiva, activa e inequívoca del usuario. Nunca agrupar múltiples consentimientos en una sola casilla."
          },
          actions: [
            {
              en: "Update HTML forms to remove the 'checked' attribute from consent checkboxes.",
              es: "Actualizar los formularios HTML para eliminar el atributo 'checked' de las casillas de consentimiento."
            },
            {
              en: "Split general privacy policy agreements from promotional/marketing subscriptions in registration flows.",
              es: "Separar la aceptación de la política de privacidad general de la suscripción a promociones en los flujos de registro."
            }
          ],
          snippets: {
            python: `
# PYTHON: Flask controller validating explicit checkbox opt-in
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    # In HTML form, ensure: <input type="checkbox" name="marketing_optin" id="m_opt"> (No checked attribute)
    marketing_optin = request.form.get('marketing_optin') == 'true'
    terms_accepted = request.form.get('terms_accepted') == 'true'
    
    if not terms_accepted:
        return jsonify({"error": "Terms of Service must be accepted."}), 400
        
    # Save the status explicitly in the DB
    save_user(marketing_optin=marketing_optin)
    return jsonify({"success": "User registered."}), 201
`,
            js: `
// JAVASCRIPT: React Checkbox Form Component with separate options
import React, { useState } from 'react';

export function RegistrationForm() {
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false); // Unchecked by default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!terms) return alert("Must accept Privacy Terms");
    
    // Send to API
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termsAccepted: terms, marketingOptin: marketing })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Privacy Policy Checklist */}
      <label>
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
        Acepto la Política de Privacidad (Obligatorio)
      </label>
      
      {/* Marketing Checklist - MUST BE UNCHECKED BY DEFAULT */}
      <label>
        <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
        Autorizo el envío de promociones y boletines (Opcional)
      </label>
      <button type="submit">Registrar</button>
    </form>
  );
}
`,
            php: `
<!-- PHP: Form rendering and strict validation of opt-ins -->
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Checkboxes are only sent if checked. Do not pre-check them in HTML.
    $terms_accepted = isset($_POST['terms_accepted']) ? true : false;
    $marketing_optin = isset($_POST['marketing_optin']) ? true : false;

    if (!$terms_accepted) {
        die("Error: Debe aceptar los términos de privacidad.");
    }

    // Save to Database
    $stmt = $pdo->prepare("INSERT INTO users (email, marketing_consented) VALUES (?, ?)");
    $stmt->execute([$_POST['email'], $marketing_optin ? 1 : 0]);
}
?>

<form method="POST">
    <input type="email" name="email" required>
    <!-- Render unchecked by default -->
    <input type="checkbox" name="terms_accepted"> Acepto Términos
    <input type="checkbox" name="marketing_optin"> Deseo recibir ofertas
    <button type="submit">Enviar</button>
</form>
`,
            go: `
// GO: HTTP handler validating form values for unchecked inputs
package main

import (
	"net/http"
	"encoding/json"
)

type RegisterReq struct {
	Email          string \`json:"email"\`
	TermsAccepted  bool   \`json:"terms_accepted"\`
	MarketingOptin bool   \`json:"marketing_optin"\` // Expected false if unchecked
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !req.TermsAccepted {
		http.Error(w, "Terms must be accepted", http.StatusBadRequest)
		return
	}

	// Save to DB
	// db.Exec("INSERT INTO users (email, marketing) VALUES ($1, $2)", req.Email, req.MarketingOptin)
	w.WriteHeader(http.StatusCreated)
}
`
          }
        },
        {
          id: "LBC-2",
          code: "LBC-2",
          weight: 4,
          criticality: "high",
          text: {
            en: "Is the data strictly restricted to the specified and declared purpose, preventing secondary usage (e.g., cross-selling) without fresh consent?",
            es: "¿Está el uso de datos estrictamente limitado al propósito declarado, evitando usos secundarios (ej. venta cruzada) sin nuevo consentimiento?"
          },
          recommendation: {
            en: "Implement strict logic or data-flow controls. Create database triggers or middleware that block unauthorized operations on tables containing user profiles for purposes other than the original intent.",
            es: "Implementar controles estrictos de flujo de datos. Crear triggers en la base de datos o middleware que bloqueen operaciones no autorizadas sobre tablas que contienen perfiles de usuario para fines distintos al original."
          },
          actions: [
            {
              en: "Establish database views or microservice routing that isolates analytical marketing databases from transactional databases.",
              es: "Establecer vistas de base de datos o rutas de microservicios que aíslen las bases de datos de marketing analítico de las bases de datos transaccionales."
            },
            {
              en: "Create a consent ledger in the user database to check flags (e.g., 'marketing_consented: boolean') before sending campaigns.",
              es: "Crear un registro de consentimiento en la base de datos de usuarios para verificar flags (ej. 'marketing_consented: boolean') antes del envío de campañas."
            }
          ],
          snippets: {
            python: `
# PYTHON: Filtering newsletter targets by consent flag in Django ORM
def send_marketing_campaign(campaign_content):
    # Only pull users who explicitly gave consent for marketing
    eligible_users = User.objects.filter(
        marketing_consented=True, 
        is_active=True
    ).values_list('email', flat=True)
    
    for email in eligible_users:
        send_email(email, campaign_content)
`,
            js: `
// JAVASCRIPT: Prisma middleware filtering out users without marketing consent
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getMarketingList() {
  // Enforce purpose limitation in queries
  return await prisma.user.findMany({
    where: {
      marketingConsented: true,
      active: true
    },
    select: {
      email: true,
      name: true
    }
  });
}
`,
            php: `
<?php
// PHP: Safe SQL query ensuring purpose limitation
function getMarketingRecipients($pdo) {
    // Strictly filter by marketing consent
    $stmt = $pdo->prepare("SELECT email FROM users WHERE active = 1 AND marketing_consented = 1");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}
?>
`,
            go: `
// GO: Database check enforcing purpose query limitation
package main

import (
	"database/sql"
)

func GetNewsletterEmails(db *sql.DB) ([]string, error) {
	// Strictly verify purpose check in sql
	rows, err := db.Query("SELECT email FROM users WHERE active = true AND marketing_consented = true")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var emails []string
	for rows.Next() {
		var email string
		if err := rows.Scan(&email); err == nil {
			emails = append(emails, email)
		}
	}
	return emails, nil
}
`
          }
        },
        {
          id: "LBC-3",
          code: "LBC-3",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Are the data collection fields minimized to only those strictly necessary for the service (e.g., avoiding requesting marital status or occupation if not needed)?",
            es: "¿Se minimizan los campos de recopilación a los estrictamente necesarios para el servicio (ej. evitando pedir estado civil u ocupación si no es necesario)?"
          },
          recommendation: {
            en: "Perform a database schema cleanup. Deprecate non-essential columns and remove optional fields from registration and checkout forms that do not serve a clear system utility.",
            es: "Realizar una limpieza del esquema de base de datos. Depreciar columnas no esenciales y eliminar campos opcionales de formularios de registro y pago que no aporten una utilidad clara al sistema."
          },
          actions: [
            {
              en: "Audit DB schemas to identify and drop unused columns containing personal information.",
              es: "Auditar los esquemas de bases de datos para identificar y eliminar columnas no utilizadas que contengan información personal."
            },
            {
              en: "Review API input validation schemas (e.g., Joi, Zod) to reject payload fields that exceed required variables.",
              es: "Revisar los esquemas de validación de entradas de las APIs (ej. Joi, Zod) para rechazar campos que excedan las variables requeridas."
            }
          ],
          snippets: {
            python: `
# PYTHON: Input validation using Pydantic to prune unnecessary input
from pydantic import BaseModel, EmailStr

class RegistrationInput(BaseModel):
    # Only request strictly necessary variables for account creation
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    
    # Exclude elements like marital_status, gender, age, unless strictly justified.
`,
            js: `
// JAVASCRIPT: Input schema sanitization using Zod
import { z } from 'zod';

const UserRegistrationSchema = z.object({
  // Minimized payload variables
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().max(100),
}).strict(); // Reject any payload containing excessive columns/parameters
`,
            php: `
<?php
// PHP: Whitelist filtering incoming API payload to enforce data minimization
function cleanInput($inputData) {
    // Only allow minimal set of keys
    $whitelist = ['email', 'password', 'first_name', 'last_name'];
    return array_intersect_key($inputData, array_flip($whitelist));
}
?>
`,
            go: `
// GO: JSON parsing utilizing strictly mapped structure (Data Minimization)
package main

import (
	"encoding/json"
	"fmt"
)

type CleanUserReq struct {
	// Restrict fields to avoid capturing excess data in memory
	Email    string \`json:"email"\`
	Password string \`json:"password"\`
}

func ParseInput(payload []byte) (*CleanUserReq, error) {
	var cleanReq CleanUserReq
	// Unknown fields are ignored or can be rejected
	err := json.Unmarshal(payload, &cleanReq)
	return &cleanReq, err
}
`
          }
        },
        {
          id: "LBC-4",
          code: "LBC-4",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Does every database entity or model storing personal data have its legal basis explicitly documented?",
            es: "¿Tiene cada entidad o modelo de base de datos que almacena datos personales su base de licitud explícitamente documentada?"
          },
          recommendation: {
            en: "Document the data inventory. Ensure that the database dictionary or model definition code comments specify the legal basis justifying the storage of each table's personal data.",
            es: "Documentar el inventario de datos. Asegurar que el diccionario de la base de datos o los comentarios en el código de definición de modelos especifiquen la base legal que justifica el almacenamiento de los datos personales de cada tabla."
          },
          actions: [
            {
              en: "Add annotations/docstrings in ORM models (Django, Prisma, Sequelize) declaring the legal basis for each model field.",
              es: "Agregar anotaciones/docstrings en los modelos ORM (Django, Prisma, Sequelize) declarando la base de licitud para cada campo del modelo."
            },
            {
              en: "Maintain an updated system data dictionary outlining data tables, classifications, and regulatory reasons for storage.",
              es: "Mantener actualizado un diccionario de datos del sistema que describa las tablas, clasificaciones y razones normativas de almacenamiento."
            }
          ],
          snippets: {
            python: `
# PYTHON: Django ORM model declaring legal bases in comments/verbose names
from django.db import models

class CustomerProfile(models.Model):
    # LEGAL BASIS: Contract Execution (Matrícula/Compra)
    first_name = models.CharField(max_length=50, help_text="Legal Basis: Contract")
    email = models.EmailField(unique=True, help_text="Legal Basis: Contract")
    
    # LEGAL BASIS: Explicit Consent (Opcional)
    marketing_consented = models.BooleanField(default=False, help_text="Legal Basis: Consent")
    
    # LEGAL BASIS: Legal Obligation (Dirección del Trabajo/Mineduc)
    tax_identifier = models.CharField(max_length=12, help_text="Legal Basis: Legal Obligation")
`,
            js: `
// JAVASCRIPT: Prisma DB Schema annotating fields with regulatory bases
// File: schema.prisma

model User {
  id                 Int      @id @default(autoincrement())
  
  // Base Legal: Ejecución de Contrato (Servicio)
  email              String   @unique
  passwordHash       String
  
  // Base Legal: Consentimiento Expreso (Opt-in)
  marketingConsented Boolean  @default(false)
  
  // Base Legal: Interés Legítimo (Seguridad e IP)
  lastIpAddress      String?
}
`,
            php: `
<?php
// PHP: Eloquent Model documentation mapping properties to Ley 21.719 bases
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

/**
 * Class User
 * @property string $email (Base: Contrato)
 * @property string $rut (Base: Obligación Legal / Impuestos)
 * @property bool $marketing_optin (Base: Consentimiento)
 */
class User extends Model {
    protected $table = 'users';
}
?>
`,
            go: `
// GO: Struct annotating fields with data category and legal bases
package models

type DBUser struct {
	ID           int64  \`json:"id"\`
	// Category: Personal. Legal Basis: Contract
	Email        string \`json:"email"\`
	// Category: Financial. Legal Basis: Contract
	CardToken    string \`json:"card_token"\`
	// Category: Sensitive. Legal Basis: Consent
	BiometricKey string \`json:"biometric_key"\`
}
`
          }
        }
      ]
    },
    {
      id: "arco",
      title: {
        en: "Data Subject Rights (ARCO-P)",
        es: "Derechos de los Titulares (ARCO-P)"
      },
      description: {
        en: "Assesses the capability of the platform to allow users to exercise their rights of Access, Rectification, Cancelation, Opposition, Portability, and Blocking.",
        es: "Evalúa la capacidad de la plataforma para permitir a los usuarios ejercer sus derechos de Acceso, Rectificación, Cancelación, Oposición, Portabilidad y Bloqueo."
      },
      questions: [
        {
          id: "ARCO-1",
          code: "ARCO-1",
          weight: 4,
          criticality: "high",
          text: {
            en: "Is there a self-service portal or an automated API that allows users to access and view all personal data held about them?",
            es: "¿Existe un portal de autoservicio o una API automatizada que permita a los usuarios acceder y ver la totalidad de sus datos personales almacenados?"
          },
          recommendation: {
            en: "Develop an 'Access My Data' dashboard. Ensure the user can query all database rows linked to their userID via a profile panel.",
            es: "Desarrollar un panel de 'Acceso a mis Datos'. Asegurar que el usuario pueda consultar todas las filas de bases de datos vinculadas a su ID de usuario a través de un panel de perfil."
          },
          actions: [
            {
              en: "Build a secure GET endpoint `/api/v1/users/me/export` that aggregates user profile, transaction histories, and logs.",
              es: "Crear un endpoint GET seguro `/api/v1/users/me/export` que agregue el perfil del usuario, historiales de transacciones y logs."
            },
            {
              en: "Render a clean 'Personal Data Overview' view in the user settings UI.",
              es: "Renderizar una vista limpia de 'Resumen de Datos Personales' en la interfaz de usuario de configuración."
            }
          ],
          snippets: {
            python: `
# PYTHON: FastAPI route compiling and returning user data
from fastapi import FastAPI, Depends, HTTPException
from database import get_db_connection

app = FastAPI()

@app.get("/api/v1/users/me/data-profile")
async def get_user_data_profile(user_id: int):
    # Fetch all records related to this user ID
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT name, email, rut FROM users WHERE id = %s", (user_id,))
    profile = cursor.fetchone()
    
    cursor.execute("SELECT login_time, ip_address FROM logs WHERE user_id = %s", (user_id,))
    history = cursor.fetchall()
    
    return {
        "profile": {"name": profile[0], "email": profile[1], "rut": profile[2]},
        "audit_logs": [{"timestamp": h[0], "ip": h[1]} for h in history]
    }
`,
            js: `
// JAVASCRIPT: Express router returning user data snapshot for Right of Access
import express from 'express';
import { prisma } from './db.js';
const router = express.Router();

router.get('/api/v1/users/me/profile', async (req, res) => {
  const userId = req.user.id; // From auth middleware
  
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      transactions: true,
      preferences: true
    }
  });
  
  if (!userData) return res.status(404).json({ error: "User not found" });
  res.json(userData);
});
`,
            php: `
<?php
// PHP: Endpoint returning user profile for Access Request
header('Content-Type: application/json');
$userId = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT id, name, email, created_at FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$stmtLog = $pdo->prepare("SELECT action, timestamp FROM audit_logs WHERE user_id = ?");
$stmtLog->execute([$userId]);
$logs = $stmtLog->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "user_profile" => $user,
    "activity_log" => $logs
]);
?>
`,
            go: `
// GO: HTTP Handler marshalling all records linked to a User
package main

import (
	"encoding/json"
	"net/http"
)

func GetUserDataProfile(w http.ResponseWriter, r *http.Request) {
	userID := getUserIDFromContext(r) // Auth context helper

	profile, _ := db.GetProfile(userID)
	logs, _ := db.GetActivityLogs(userID)

	response := map[string]interface{}{
		"profile": profile,
		"logs":    logs,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
`
          }
        },
        {
          id: "ARCO-2",
          code: "ARCO-2",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Can users rectify, update, or correct their incomplete or inaccurate personal data directly from the system interface?",
            es: "¿Pueden los usuarios rectificar, actualizar o corregir sus datos personales incompletos o inexactos directamente desde la interfaz del sistema?"
          },
          recommendation: {
            en: "Implement an editing interface. Expose secure PUT/PATCH endpoints that perform data validation before updating tables containing user profiles.",
            es: "Implementar una interfaz de edición. Exponer endpoints PUT/PATCH seguros que realicen validación de datos antes de actualizar las tablas de perfil del usuario."
          },
          actions: [
            {
              en: "Create validation rules in input controllers to ensure updated data remains accurate (e.g., RUT verification).",
              es: "Crear reglas de validación en los controladores de entrada para asegurar que los datos actualizados sigan siendo correctos (ej. verificación de RUT)."
            },
            {
              en: "Provide immediate feedback and confirmation logs when a user modifies their contact information.",
              es: "Proporcionar retroalimentación inmediata y registrar logs de confirmación cuando un usuario modifique su información de contacto."
            }
          ],
          snippets: {
            python: `
# PYTHON: Flask endpoint validating and patching user attributes
from flask import request, jsonify

@app.route('/api/v1/users/me', methods=['PATCH'])
def update_profile(user_id):
    data = request.json
    allowed_fields = ['first_name', 'last_name', 'phone']
    update_data = {}
    
    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]
            
    if not update_data:
        return jsonify({"error": "No valid fields to update."}), 400
        
    db.update_user(user_id, **update_data)
    return jsonify({"success": "Profile updated successfully."})
`,
            js: `
// JAVASCRIPT: Express controller updating profile with schema validation
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().regex(/^\\+56\\d{9}$/).optional(), // Chilean format
});

async function handleUpdateProfile(req, res) {
  const result = UpdateProfileSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);
  
  await prisma.user.update({
    where: { id: req.user.id },
    data: result.data
  });
  
  res.json({ message: "Updated." });
}
`,
            php: `
<?php
// PHP: Safe prepared statement updating user attributes
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    parse_str(file_get_contents("php://input"), $input);
    
    $name = filter_var($input['name'], FILTER_SANITIZE_STRING);
    $phone = filter_var($input['phone'], FILTER_SANITIZE_STRING);
    
    if (!$name) {
        http_response_code(400);
        die(json_encode(["error" => "Invalid name"]));
    }
    
    $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?");
    $stmt->execute([$name, $phone, $_SESSION['user_id']]);
    echo json_encode(["status" => "updated"]);
}
?>
`,
            go: `
// GO: HTTP PATCH route updating profile safely
package main

import (
	"encoding/json"
	"net/http"
)

type UpdateProfileReq struct {
	Name  *string \`json:"name"\`
	Phone *string \`json:"phone"\`
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	var req UpdateProfileReq
	json.NewDecoder(r.Body).Decode(&req)

	userID := getUserID(r)
	
	// Exec update with database drivers safely
	// db.Exec("UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone) WHERE id = $3", req.Name, req.Phone, userID)
	
	w.WriteHeader(http.StatusOK)
}
`
          }
        },
        {
          id: "ARCO-3",
          code: "ARCO-3",
          weight: 5,
          criticality: "high",
          text: {
            en: "Does the system support a cascade deletion flow that permanently erases user data from production and backups?",
            es: "¿Soporta el sistema un flujo de eliminación en cascada que borre permanentemente los datos en producción y respaldos?"
          },
          recommendation: {
            en: "Create a secure cascade deletion protocol. When a DELETE request is triggered, perform soft-delete in the application layer for 30 days (grace period), followed by physical deletion (hard-delete) across all relational tables.",
            es: "Crear un protocolo seguro de borrado en cascada. Al recibir una solicitud DELETE, realizar un soft-delete en la capa de aplicación por 30 días (periodo de gracia), seguido de un borrado físico (hard-delete) en todas las tablas relacionales."
          },
          actions: [
            {
              en: "Write database migrations with ON DELETE CASCADE constraints or handle dependency deletion in backend controllers.",
              es: "Escribir migraciones de bases de datos con restricciones ON DELETE CASCADE o manejar la eliminación de dependencias en los controladores del backend."
            },
            {
              en: "Implement a script to scrub backups or anonymize historic records so they can no longer be linked to a physical person.",
              es: "Implementar un script para purgar respaldos o anonimizar registros históricos para que dejen de estar vinculados a una persona física."
            }
          ],
          snippets: {
            python: `
# PYTHON: Cascading deletion transaction in SQLAlchemy
from sqlalchemy.orm import sessionmaker

def delete_user_account(session, user_id):
    try:
        # Cascade deletion handles child models (logs, tokens, carts)
        # SQLAlchemy models must have cascade="all, delete-orphan" on relationships
        user = session.query(User).filter_by(id=user_id).one()
        session.delete(user)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
`,
            js: `
// JAVASCRIPT: Prisma Database transaction executing cascade deletion
import { prisma } from './db.js';

async function hardDeleteUser(userId) {
  // Execute cascade deletion in transaction to guarantee consistency
  return await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.cartItem.deleteMany({ where: { cart: { userId } } }),
    prisma.marketingPreferences.delete({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } })
  ]);
}
`,
            php: `
<?php
// PHP: Database Transaction for Cascading Deletion
function deleteUserComplete($pdo, $userId) {
    try {
        $pdo->beginTransaction();
        
        // Remove session keys
        $pdo->prepare("DELETE FROM sessions WHERE user_id = ?")->execute([$userId]);
        // Remove transactional details/logs (or anonymize them)
        $pdo->prepare("DELETE FROM carts WHERE user_id = ?")->execute([$userId]);
        // Remove primary profile
        $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
        
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}
?>
`,
            go: `
// GO: Relational deletion inside database transaction
package main

import (
	"context"
	"database/sql"
)

func DeleteUserCascade(ctx context.Context, db *sql.DB, userID int64) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Delete dependent records
	if _, err := tx.ExecContext(ctx, "DELETE FROM sessions WHERE user_id = $1", userID); err != nil {
		return err
	}
	// Delete main user record
	if _, err := tx.ExecContext(ctx, "DELETE FROM users WHERE id = $1", userID); err != nil {
		return err
	}

	return tx.Commit()
}
`
          }
        },
        {
          id: "ARCO-4",
          code: "ARCO-4",
          weight: 4,
          criticality: "high",
          text: {
            en: "Can users download their data in a structured, machine-readable format (e.g., JSON, CSV, XML) to facilitate data portability?",
            es: "¿Pueden los usuarios descargar sus datos en un formato de lectura mecánica (ej. JSON, CSV, XML) para facilitar la portabilidad?"
          },
          recommendation: {
            en: "Build a portability exporter. Compile user data from different services into a single JSON or zip file available for instant download in the user's dashboard.",
            es: "Construir un exportador de portabilidad. Compilar los datos del usuario de distintos servicios en un único archivo JSON o ZIP disponible para descarga instantánea en el panel del usuario."
          },
          actions: [
            {
              en: "Implement a background job (e.g., using Celery or BullMQ) to compile complex profile histories into a downloadable ZIP.",
              es: "Implementar un trabajo en segundo plano (ej. usando Celery o BullMQ) para compilar historiales complejos en un ZIP descargable."
            },
            {
              en: "Add a 'Download My Data (JSON)' button under privacy settings.",
              es: "Añadir un botón de 'Descargar mis Datos (JSON)' bajo la sección de configuración de privacidad."
            }
          ],
          snippets: {
            python: `
# PYTHON: Exporting user profile to downloadable JSON attachment
import json
from flask import Response

@app.route('/api/v1/users/me/export', methods=['GET'])
def export_user_data(user_id):
    data = fetch_user_dataset(user_id)
    json_data = json.dumps(data, indent=2, default=str)
    
    return Response(
        json_data,
        mimetype='application/json',
        headers={"Content-disposition": "attachment; filename=mis_datos.json"}
    )
`,
            js: `
// JAVASCRIPT: Exposing JSON download payload in Express
async function downloadPortabilityFile(req, res) {
  const data = await gatherFullUserHistory(req.user.id);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="data-portability.json"');
  
  return res.send(JSON.stringify(data, null, 2));
}
`,
            php: `
<?php
// PHP: Exporting data to structured CSV file
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="mis_datos.csv"');

$output = fopen('php://output', 'w');
// Write headers
fputcsv($output, ['Campo', 'Valor']);

$stmt = $pdo->prepare("SELECT name, email, phone FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

foreach ($user as $key => $val) {
    fputcsv($output, [$key, $val]);
}
fclose($output);
?>
`,
            go: `
// GO: JSON Marshaller generating data download file
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func ExportDataJSON(w http.ResponseWriter, r *http.Request) {
	userId := getUserID(r)
	fullData := compileDataset(userId)

	payload, _ := json.MarshalIndent(fullData, "", "  ")

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\\"portability_%d.json\\"", userId))
	w.Write(payload)
}
`
          }
        }
      ]
    },
    {
      id: "sbn",
      title: {
        en: "Security & Breach Notification",
        es: "Seguridad y Notificación de Brechas"
      },
      description: {
        en: "Evaluates the infrastructure security measures, access trace audits, and incident response readiness.",
        es: "Evalúa las medidas de seguridad de la infraestructura, auditorías de traza de acceso y la preparación para responder ante incidentes."
      },
      questions: [
        {
          id: "SBN-1",
          code: "SBN-1",
          weight: 5,
          criticality: "high",
          text: {
            en: "Are sensitive personal data (e.g. medical data, financial logs) and passwords encrypted/hashed at rest in the database?",
            es: "¿Están los datos personales sensibles (ej. datos médicos, registros financieros) y contraseñas cifrados/hasheados en reposo en la base de datos?"
          },
          recommendation: {
            en: "Enforce column-level database encryption (e.g., pgcrypto, AWS KMS) for sensitive attributes, and hash passwords using bcrypt or Argon2id with dynamic salting.",
            es: "Forzar el cifrado a nivel de columna (ej. pgcrypto, AWS KMS) para atributos sensibles, e implementar hashing de contraseñas usando bcrypt o Argon2id con salting dinámico."
          },
          actions: [
            {
              en: "Audit db tables to verify password column hashing algorithms. Ban plain MD5 or SHA-1.",
              es: "Auditar las tablas de la BD para verificar los algoritmos de hashing de contraseñas. Prohibir MD5 o SHA-1 simples."
            },
            {
              en: "Implement envelope encryption for health/financial records, storing encryption keys outside the database instance.",
              es: "Implementar encriptación de sobre para registros médicos/financieros, almacenando las claves de cifrado fuera de la instancia de la base de datos."
            }
          ],
          snippets: {
            python: `
# PYTHON: Hashing passwords with bcrypt (dynamic salting)
import bcrypt

def hash_password(plain_password: str) -> str:
    # Generate salt and hash. Banish MD5 or SHA-1!
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
`,
            js: `
// JAVASCRIPT: Argon2id secure password hashing
import argon2 from 'argon2';

export async function secureHash(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 4
    });
  } catch (err) {
    throw new Error("Hashing failure");
  }
}

export async function verify(hash, password) {
  return await argon2.verify(hash, password);
}
`,
            php: `
<?php
// PHP: Safe password hashing using Argon2id
function secureHash($password) {
    // PASSWORD_ARGON2ID is supported from PHP 7.3+
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536,
        'time_cost'   => 4,
        'threads'     => 2
    ]);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}
?>
`,
            go: `
// GO: Hashing password utilizing golang/x/crypto/bcrypt
package main

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	// Cost 12 is recommended for modern systems
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
`
          }
        },
        {
          id: "SBN-2",
          code: "SBN-2",
          weight: 4,
          criticality: "high",
          text: {
            en: "Does the system maintain an immutable, tamper-proof audit log of all database reads/writes of sensitive user records?",
            es: "¿Mantiene el sistema un log de auditoría inalterable de todas las lecturas/escrituras en base de datos de registros sensibles de usuarios?"
          },
          recommendation: {
            en: "Set up audit logging middleware. Record every access to sensitive data in a read-only database, Elasticsearch cluster, or external logging system (like AWS CloudWatch with write-once permissions).",
            es: "Configurar un middleware de registro de auditoría. Registrar cada acceso a datos sensibles en una base de datos de solo lectura, cluster de Elasticsearch o sistema de logs externo (como AWS CloudWatch con permisos de escritura única)."
          },
          actions: [
            {
              en: "Implement an application-level middleware to intercept database queries targeting sensitive models and write log events.",
              es: "Implementar un middleware a nivel de aplicación para interceptar consultas de base de datos sobre modelos sensibles y escribir eventos de log."
            },
            {
              en: "Export logs to a centralized server with WORM (Write Once, Read Many) policies.",
              es: "Exportar los registros de log a un servidor centralizado con políticas WORM (Write Once, Read Many)."
            }
          ],
          snippets: {
            python: `
# PYTHON: Interceptor for auditing database read access
import logging
from datetime import datetime

# Set up dedicated audit logger
audit_logger = logging.getLogger('audit_log')
audit_logger.setLevel(logging.INFO)
# Send to secure external daemon (Syslog/CloudWatch)

def log_sensitive_access(user_id: int, target_entity: str, record_id: int, action: str):
    log_payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "operator_id": user_id,
        "entity": target_entity,
        "record_id": record_id,
        "action": action, # 'READ', 'WRITE', 'DELETE'
    }
    audit_logger.info(f"AUDIT_EVENT: {log_payload}")
`,
            js: `
// JAVASCRIPT: Express Middleware capturing all read API queries of sensitive routes
import { logger } from './audit-logger.js';

export function auditMiddleware(entityName) {
  return (req, res, next) => {
    const operatorId = req.user ? req.user.id : 'ANONYMOUS';
    const recordId = req.params.id || 'LIST';
    
    // Log the access before sending response
    logger.info({
      timestamp: new Date().toISOString(),
      operatorId,
      entity: entityName,
      recordId,
      action: req.method, // GET, PUT, DELETE
      ip: req.ip
    });
    
    next();
  };
}
`,
            php: `
<?php
// PHP: Class logger writing accesses to secure logging database
class AuditLogger {
    public static function log($pdo, $operatorId, $action, $targetTable, $recordId) {
        $stmt = $pdo->prepare("
            INSERT INTO audit_logs (operator_id, action, target_table, record_id, ip_address, timestamp)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $operatorId,
            $action, // e.g. 'VIEW_MED_RECORD'
            $targetTable,
            $recordId,
            $_SERVER['REMOTE_ADDR']
        ]);
    }
}
?>
`,
            go: `
// GO: Structured auditing utilizing uber-go/zap logger
package main

import (
	"go.uber.org/zap"
	"time"
)

type AuditEvent struct {
	Timestamp  string \`json:"timestamp"\`
	OperatorID int64  \`json:"operator_id"\`
	Action     string \`json:"action"\`
	Entity     string \`json:"entity"\`
}

func LogAuditEvent(logger *zap.Logger, opID int64, action, entity string) {
	// Logger configured to write to external SIEM
	logger.Info("Audit Access Event",
		zap.String("timestamp", time.Now().UTC().Format(time.RFC3339)),
		zap.Int64("operator_id", opID),
		zap.String("action", action),
		zap.String("entity", entity),
	)
}
`
          }
        },
        {
          id: "SBN-3",
          code: "SBN-3",
          weight: 4,
          criticality: "high",
          text: {
            en: "Are all internal and external data communication channels encrypted using HTTPS/TLS 1.3 or equivalent secure protocols?",
            es: "¿Están todos los canales de comunicación internos y externos cifrados usando HTTPS/TLS 1.3 o protocolos seguros equivalentes?"
          },
          recommendation: {
            en: "Configure server networks. Force TLS 1.3 on Nginx/load balancers, enforce HSTS (HTTP Strict Transport Security), and encrypt microservice communication using a Service Mesh (mTLS).",
            es: "Configurar las redes de servidores. Forzar TLS 1.3 en Nginx/balanceadores de carga, implementar HSTS (HTTP Strict Transport Security) y cifrar la comunicación entre microservicios usando Service Mesh (mTLS)."
          },
          actions: [
            {
              en: "Implement SSL Labs recommendations: disable outdated protocols (SSL v3, TLS 1.0, 1.1) on API gateways.",
              es: "Implementar recomendaciones de SSL Labs: desactivar protocolos obsoletos (SSL v3, TLS 1.0, 1.1) en los gateways de las APIs."
            },
            {
              en: "Enable Mutual TLS (mTLS) for microservices using tools like Istio or Linkerd.",
              es: "Habilitar TLS Mutuo (mTLS) para microservicios utilizando herramientas como Istio o Linkerd."
            }
          ],
          snippets: {
            python: `
# PYTHON: Configuring Flask secure cookies and HSTS Headers
from flask import Flask, make_response

app = Flask(__name__)

@app.after_request
def apply_caching(response):
    # Enforce HTTPS on client browsers
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

# Enforce secure cookies in configuration
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)
`,
            js: `
// JAVASCRIPT: Enforcing Helmet headers and TLS requirements in Express
import express from 'express';
import helmet from 'helmet';

const app = express();

// Enforce standard ciphers, HSTS, and Frameguard
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));

// API endpoints force secure sessions
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, \`https://\${req.headers.host}\${req.url}\`);
  }
  next();
});
`,
            php: `
<?php
// PHP: Strict Session Security Configuration
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.use_only_cookies', 1);

// Add security headers to response
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
?>
`,
            go: `
// GO: HTTP Security Middleware enforcing HTTPS and HSTS headers
package main

import (
	"net/http"
)

func SecurityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
		
		next.ServeHTTP(w, r)
	})
}
`
          }
        },
        {
          id: "SBN-4",
          code: "SBN-4",
          weight: 4,
          criticality: "high",
          text: {
            en: "Is there an incident response plan and automated triggers to alert the APDP and users of data breaches within 72 hours?",
            es: "¿Existe un plan de respuesta ante incidentes y alertas automáticas para notificar a la APDP y usuarios sobre brechas de datos en 72 horas?"
          },
          recommendation: {
            en: "Formalize the incident response protocol. Set up automated intrusion detection (SIEM) and prepare email templates and API triggers to mass-notify affected users and generate regulatory reports quickly.",
            es: "Formalizar el protocolo de respuesta ante incidentes. Configurar sistemas automáticos de detección (SIEM) y preparar plantillas de correo y triggers de API para notificar masivamente a usuarios afectados y generar informes regulatorios rápidamente."
          },
          actions: [
            {
              en: "Integrate vulnerability alert webhooks with dev-sec-ops tools (e.g., Datadog, PagerDuty).",
              es: "Integrar webhooks de alerta de vulnerabilidades con herramientas de dev-sec-ops (ej. Datadog, PagerDuty)."
            },
            {
              en: "Draft pre-approved communication templates in Spanish/English for breach notifications to meet the 72-hour window.",
              es: "Redactar plantillas de comunicación pre-aprobadas en español/inglés para notificaciones de brechas para cumplir con el plazo de 72 horas."
            }
          ],
          snippets: {
            python: `
# PYTHON: Alert Dispatcher using PagerDuty / Webhook integrations
import requests
import json

def trigger_breach_incident(incident_title: str, affected_count: int, severity: str):
    # Sends incident payload to internal operations and SecOps teams
    webhook_url = "https://events.pagerduty.com/v2/enqueue"
    
    payload = {
        "routing_key": "YOUR_INTEGRATION_KEY",
        "event_action": "trigger",
        "payload": {
            "summary": f"DATA BREACH ALERT: {incident_title}",
            "source": "Audit Monitoring System",
            "severity": severity,
            "custom_details": {
                "estimated_affected_users": affected_count,
                "urgency_level": "CRITICAL_72H_APDP_ACTION"
            }
        }
    }
    
    response = requests.post(webhook_url, data=json.dumps(payload))
    return response.status_code == 202
`,
            js: `
// JAVASCRIPT: Breach incident dispatch job to external alerting systems
import axios from 'axios';

export async function reportSecurityEvent(eventDetails) {
  const securityEndpoint = 'https://api.securityops.internal/events';
  
  try {
    await axios.post(securityEndpoint, {
      alertType: 'DATA_EXCLUSION_DETECTED',
      reportedAt: new Date().toISOString(),
      systemId: 'core-database-01',
      details: eventDetails,
      deadline_apdp: new Date(Date.now() + 72 * 3600 * 1000).toISOString() // 72 Hour window
    });
  } catch (error) {
    console.error("Critical: Failed to alert security operations!", error);
  }
}
`,
            php: `
<?php
// PHP: Trigger email alerts to DPO and Administration on breach detection
function notifyDPOOfBreach($incidentDetails) {
    $to = "dpo@company.com";
    $subject = "⚠️ ALERTA CRÍTICA: Posible Brecha de Seguridad Detectada";
    
    $message = "Se ha detectado una anomalía en las bases de datos.\\n\\n";
    $message .= "Detalles del incidente: " . $incidentDetails . "\\n";
    $message .= "Recuerde: Plazo límite de notificación APDP: 72 horas.";
    
    $headers = "From: security-alerts@company.com\\r\\n" .
               "Reply-To: security-alerts@company.com\\r\\n" .
               "X-Mailer: PHP/" . phpversion();
               
    mail($to, $subject, $message, $headers);
}
?>
`,
            go: `
// GO: Event trigger dispatching incident payloads to Slack/Discord SecOps channel
package main

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func SendSlackBreachAlert(message string) {
	webhookURL := "https://hooks.slack.com/services/T00/B00/X00"
	
	payload := map[string]string{
		"text": "🚨 *CRITICAL DATA BREACH DETECTED* 🚨\\n" + message + "\\n⏱️ 72-Hour regulator notification window is active.",
	}
	
	jsonPayload, _ := json.Marshal(payload)
	http.Post(webhookURL, "application/json", bytes.NewBuffer(jsonPayload))
}
`
          }
        }
      ]
    },
    {
      id: "spm",
      title: {
        en: "Special Protections (Sensitives & Minors)",
        es: "Protecciones Especiales (Sensibles y Menores)"
      },
      description: {
        en: "Checks protections for vulnerable datasets, including child/teen users and high-risk sensitive attributes.",
        es: "Comprueba las protecciones para conjuntos de datos vulnerables, incluyendo usuarios niños/adolescentes y atributos sensibles de alto riesgo."
      },
      questions: [
        {
          id: "SPM-1",
          code: "SPM-1",
          weight: 4,
          criticality: "high",
          text: {
            en: "Are sensitive datasets logically isolated in the database schema and restricted via role-based access control (RBAC)?",
            es: "¿Están los conjuntos de datos sensibles aislados lógicamente en el esquema de base de datos y restringidos mediante control de accesos RBAC?"
          },
          recommendation: {
            en: "Enforce strict logical segregation. Keep health records or biometrics in separate tables or databases with distinct access credentials, ensuring backend microservices use specialized roles.",
            es: "Forzar segregación lógica estricta. Mantener registros de salud o datos biométricos en tablas o bases de datos separadas con credenciales de acceso distintas, asegurando que los microservicios usen roles especializados."
          },
          actions: [
            {
              en: "Refactor database access policies (Row-Level Security in PostgreSQL) so database users can only access rows matching their operational scope.",
              es: "Refactorizar políticas de acceso (Row-Level Security en PostgreSQL) para que los usuarios de base de datos solo accedan a filas acordes a su ámbito operativo."
            },
            {
              en: "Audit API middleware to check if roles are validated (e.g., JWT scopes) before resolving sensitive data routes.",
              es: "Auditar el middleware de las APIs para validar que se comprueben los roles (ej. JWT scopes) antes de resolver rutas con datos sensibles."
            }
          ],
          snippets: {
            python: `
# PYTHON: FastAPI middleware checking scopes for accessing sensitive routes
from fastapi import Security, HTTPException, status
from fastapi.security import SecurityScopes

def verify_sensitive_scope(security_scopes: SecurityScopes, scopes: list = ["sensitive:health:read"]):
    # Check if authorization token has the required scope
    for scope in scopes:
        if scope not in security_scopes.scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to access sensitive datasets."
            )
`,
            js: `
// JAVASCRIPT: Express middleware restricting route by user role (RBAC)
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : null;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Access Denied: You do not have permissions to read sensitive records."
      });
    }
    
    next();
  };
}
`,
            php: `
<?php
// PHP: Simple class checking permission levels before returning health records
function verifyMedicalAccess($user) {
    // Only medical personnel or administrators can access
    $allowed = ['Doctor', 'Nurse', 'ChiefComplianceOfficer'];
    
    if (!in_array($user['role'], $allowed)) {
        http_response_code(403);
        die(json_encode(["error" => "No autorizado para consultar registros médicos."]));
    }
}
?>
`,
            go: `
// GO: JWT claims validator parsing sensitive scopes
package main

import (
	"github.com/golang-jwt/jwt/v4"
)

type CustomClaims struct {
	Role   string   \`json:"role"\`
	Scopes []string \`json:"scopes"\`
	jwt.RegisteredClaims
}

func ValidateSensitiveScope(claims *CustomClaims) bool {
	for _, scope := range claims.Scopes {
		if scope == "sensitive:biometrics:write" {
			return true
		}
	}
	return false
}
`
          }
        },
        {
          id: "SPM-2",
          code: "SPM-2",
          weight: 5,
          criticality: "high",
          text: {
            en: "Does the system verify age during registration and block the tracking of users under 14 without parental consent?",
            es: "¿Verifica el sistema la edad durante el registro y bloquea el rastreo de usuarios menores de 14 años sin consentimiento parental?"
          },
          recommendation: {
            en: "Implement an age-verification gate. If birthdate indicates a user under 14, block profile activation and request parent/guardian email to send a verification and double-consent link before storing any minor data.",
            es: "Implementar un validador de edad. Si la fecha de nacimiento indica que el usuario es menor de 14 años, bloquear la activación de perfil y solicitar el correo del apoderado para enviar un link de verificación y consentimiento antes de guardar datos del menor."
          },
          actions: [
            {
              en: "Add validation step checking age on registration endpoint `/api/v1/auth/register`.",
              es: "Añadir un paso de validación que compruebe la edad en el endpoint de registro `/api/v1/auth/register`."
            },
            {
              en: "Turn off advertising cookies and profiling features automatically if user is identified as a minor.",
              es: "Desactivar automáticamente cookies publicitarias y funciones de perfilamiento si el usuario es identificado como menor de edad."
            }
          ],
          snippets: {
            python: `
# PYTHON: Age gate checking user age during registration and launching parent flow
from datetime import date, datetime

def calculate_age(birthdate_str: str) -> int:
    birthdate = datetime.strptime(birthdate_str, "%Y-%m-%d").date()
    today = date.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

def process_registration(birthdate_str: str, parent_email: str = None):
    age = calculate_age(birthdate_str)
    
    if age < 14:
        if not parent_email:
            raise ValueError("Parent's email required for users under 14.")
        trigger_parent_consent_flow(parent_email)
        return "PENDING_PARENTAL_APPROVAL"
        
    return "ACTIVE"
`,
            js: `
// JAVASCRIPT: Form controller validating age limit and blocking tracking
import { differenceInYears } from 'date-fns';

export function validateAgeAndConsent(birthdate) {
  const age = differenceInYears(new Date(), new Date(birthdate));
  
  if (age < 14) {
    // Disable tracking scripts dynamically
    window['ga-disable-UA-XXXXXX-Y'] = true; // Turn off Google Analytics
    if (window.consentManager) {
      window.consentManager.optOutAll();
    }
    return { status: 'require_parental_approval' };
  }
  return { status: 'eligible' };
}
`,
            php: `
<?php
// PHP: Calculation of minor age gate validation
function validateUserAge($dob) {
    $birthday = new DateTime($dob);
    $today = new DateTime('today');
    $age = $birthday->diff($today)->y;
    
    if ($age < 14) {
        // Enforce parental consent
        return [
            'status' => 'PENDING_PARENTAL',
            'requires_parent_auth' => true
        ];
    }
    return ['status' => 'APPROVED', 'requires_parent_auth' => false];
}
?>
`,
            go: `
// GO: Struct age calculator checking user birthdate
package main

import (
	"time"
)

func IsMinorUnder14(birthdate time.Time) bool {
	now := time.Now()
	years := now.Year() - birthdate.Year()
	
	// Adjust if birthday hasn't occurred this year yet
	if now.YearDay() < birthdate.YearDay() {
		years--
	}
	
	return years < 14
}
`
          }
        },
        {
          id: "SPM-3",
          code: "SPM-3",
          weight: 5,
          criticality: "high",
          text: {
            en: "Are biometric data (facial images, fingerprints) converted to hashes and original raw files immediately destroyed?",
            es: "¿Se convierten los datos biométricos (rostros, huellas) en hashes irreversibles y se destruyen los archivos crudos originales de inmediato?"
          },
          recommendation: {
            en: "Biometric processing cleanup. Verify that backend processes run facial recognition or fingerprint algorithms locally/in-memory, extract mathematical vectors, hash them, and immediately overwrite/delete raw files from server storage.",
            es: "Limpieza de procesamiento biométrico. Verificar que los procesos del backend ejecuten algoritmos de reconocimiento facial o de huellas localmente o en memoria, extraigan los vectores matemáticos, los hasheen y de inmediato sobrescriban/eliminen los archivos crudos del servidor."
          },
          actions: [
            {
              en: "Ensure temporary media folders are periodically cleared of raw images used for identity verification.",
              es: "Asegurar que las carpetas de archivos temporales se limpien periódicamente de imágenes crudas utilizadas en la verificación de identidad."
            },
            {
              en: "Verify backend libraries process images in-memory (`Buffer`) without writing to disk during validation.",
              es: "Verificar que las librerías del backend procesen imágenes en memoria (`Buffer`) sin escribir a disco durante la validación."
            }
          ],
          snippets: {
            python: `
# PYTHON: Facial vector extraction and immediate image cleanup
import os

def process_biometric_identity(image_path: str):
    try:
        # 1. Load image and extract mathematical facial mesh / embedding vector
        vector = extract_face_vector(image_path)
        
        # 2. Save vector/hash securely
        save_biometric_hash_to_db(vector)
        
    finally:
        # 3. Always overwrite and delete raw image files from server disk
        if os.path.exists(image_path):
            # Shred file contents
            with open(image_path, "wb") as f:
                f.write(os.urandom(os.path.getsize(image_path)))
            os.remove(image_path)
`,
            js: `
// JAVASCRIPT: In-memory image processing using sharp and deletion of temporary media
import fs from 'fs/promises';

export async function processBiometricsInMemory(tempFilePath) {
  try {
    const fileBuffer = await fs.readFile(tempFilePath);
    
    // Process entirely in memory, extracting vectors
    const faceVector = await faceApiEngine.extractVector(fileBuffer);
    await saveVectorToDB(faceVector);
    
  } finally {
    // Securely delete temporary file
    await fs.unlink(tempFilePath);
  }
}
`,
            php: `
<?php
// PHP: Clean up biometric files immediately after processing
function handleBiometricUpload($tempFile) {
    // Process features
    $vector = processImageFeatures($tempFile);
    saveVector($vector);
    
    // Destroy upload file immediately
    if (file_exists($tempFile)) {
        unlink($tempFile);
    }
}
?>
`,
            go: `
// GO: Biometric processing in memory utilizing byte buffers without writing to disk
package main

import (
	"bytes"
	"io"
	"os"
)

func ProcessBiometrics(fileReader io.Reader, tempPath string) ([]float64, error) {
	// Read into memory buffer to avoid writing raw files to server disk
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, fileReader); err != nil {
		return nil, err
	}
	defer os.Remove(tempPath) // Enforce clean deletion of temp directories

	vector := runInference(buf.Bytes())
	return vector, nil
}
`
          }
        },
        {
          id: "SPM-4",
          code: "SPM-4",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Has a Data Protection Impact Assessment (DPIA) been documented for all high-risk processing features of the platform?",
            es: "¿Se ha documentado una Evaluación de Impacto en Protección de Datos (EIPD) para todas las funciones de alto riesgo de la plataforma?"
          },
          recommendation: {
            en: "Conduct a DPIA. Analyze system processes, list threats to user privacy, define mitigation strategies (like pseudonymization), and document the analysis as part of the system architecture.",
            es: "Llevar a cabo una EIPD. Analizar procesos del sistema, listar amenazas para la privacidad de los usuarios, definir mitigaciones (como seudonimización) y documentar el análisis como parte de la arquitectura del sistema."
          },
          actions: [
            {
              en: "Draft a DPIA document specifying risk levels, database structures, and security controls for the high-risk features.",
              es: "Redactar un documento EIPD que especifique los niveles de riesgo, estructuras de base de datos y controles de seguridad para las funciones de alto riesgo."
            },
            {
              en: "Update the product launch checklist to require a privacy review before pushing new processing features to production.",
              es: "Actualizar la lista de chequeo de lanzamientos para exigir una revisión de privacidad antes de subir nuevas funciones de procesamiento a producción."
            }
          ],
          snippets: {
            python: `
# PYTHON: Structuring the DPIA checklist as code in configuration / CI/CD tests
# Ensure all release configurations declare high-risk features and flag them for approval

class DPIAConfig:
    HIGH_RISK_TRIGGERS = [
        "tracking_location",
        "processing_biometrics",
        "underage_users",
        "automated_scoring"
    ]

    @classmethod
    def audit_features(cls, active_featuresList):
        for feature in active_featuresList:
            if feature in cls.HIGH_RISK_TRIGGERS:
                # Trigger pipeline warning: require manual upload of certified DPIA artifact
                trigger_pipeline_block(f"Feature '{feature}' requires an active DPIA!")
`,
            js: `
// JAVASCRIPT: Audit check verifying if DPIA verification document is logged in the project
import fs from 'fs/promises';

export async function verifyDpiasExist(features) {
  const dpiaDocPath = './compliance/dpias/';
  
  for (const feature of features) {
    if (feature.isHighRisk) {
      try {
        await fs.access(\`\${dpiaDocPath}\${feature.name}-dpia.pdf\`);
      } catch {
        throw new Error(\`BUILD ERROR: Feature \${feature.name} lacks verified DPIA PDF!\`);
      }
    }
  }
}
`,
            php: `
<?php
// PHP: Helper function checking status of EIPD documentation before running feature
function checkEipdApproval($featureName) {
    $approvedFeatures = [
        'user_billing' => true,
        'geolocation' => false // Blocked: lacks certified EIPD/DPIA
    ];
    
    if (!$approvedFeatures[$featureName]) {
        throw new Exception("Error: Esta funcionalidad de alto riesgo requiere un análisis EIPD aprobado.");
    }
}
?>
`,
            go: `
// GO: Compliance gate verifying approved features array
package main

import (
	"errors"
)

type Feature struct {
	Name        string
	IsHighRisk  bool
	HasDPIAFile bool
}

func ValidateRelease(features []Feature) error {
	for _, f := range features {
		if f.IsHighRisk && !f.HasDPIAFile {
			return errors.New("DPIA file missing for high risk feature: " + f.Name)
		}
	}
	return nil
}
`
          }
        }
      ]
    },
    {
      id: "gov",
      title: {
        en: "Governance & Accountability",
        es: "Gobernanza y Responsabilidad"
      },
      description: {
        en: "Measures internal compliance rules, DPO implementation, training program, and prevention registries.",
        es: "Mide las reglas internas de cumplimiento, la designación del DPD, el programa de capacitación y los registros de prevención."
      },
      questions: [
        {
          id: "GOV-1",
          code: "GOV-1",
          weight: 4,
          criticality: "high",
          text: {
            en: "Is a Data Protection Officer (DPO / DPD) formally appointed and registered with the regulator (APDP)?",
            es: "¿Está designado formalmente un Delegado de Protección de Datos (DPD / DPO) y registrado ante la autoridad (APDP)?"
          },
          recommendation: {
            en: "Formalize DPO appointment. Assign DPO responsibilities to a qualified compliance/legal resource, grant them independence, set direct reporting channels to executive management, and register them on the APDP portal.",
            es: "Formalizar nombramiento del DPD. Asignar responsabilidades a un recurso calificado, otorgar independencia operativa, establecer canales de reporte directo a la gerencia y registrar el rol en el portal de la APDP."
          },
          actions: [
            {
              en: "Draft the DPO charter declaring role responsibilities, budget, and access rights.",
              es: "Redactar el acta de nombramiento del DPD declarando responsabilidades del cargo, presupuesto y derechos de acceso."
            },
            {
              en: "Publish DPO contact email (e.g. `dpo@company.com`) in the site footer and privacy policies.",
              es: "Publicar el correo del DPD (ej. `dpo@empresa.com`) en el pie de página del sitio y en las políticas de privacidad."
            }
          ],
          snippets: {
            python: `
# PYTHON: Exposing a public DPO contact endpoint in API routers
@app.route('/api/v1/compliance/dpo-contact', methods=['POST'])
def contact_dpo():
    # Allow users to directly query or trigger privacy requests to the DPO
    user_request = request.json.get('message')
    user_email = request.json.get('email')
    
    send_to_dpo_ticketing_system(email=user_email, message=user_request)
    return jsonify({"message": "Your privacy inquiry has been sent to our DPO."}), 200
`,
            js: `
// JAVASCRIPT: Contact email configuration configuration
export const DpoConfig = {
  name: "Delegado de Protección de Datos",
  email: "dpo@company.cl",
  inquiriesEndpoint: "/api/compliance/inquire",
  channels: {
    internalTicketing: "jira-compliance-board",
    externalSupport: "dpo-helpdesk"
  }
};
`,
            php: `
<?php
// PHP: Helper function directing ARCO claims directly to DPO
function routeToDpo($claimType, $details) {
    // Map claim directly to compliance ticketing dashboard
    $ticket = [
        'type' => 'PRIVACY_ARCO',
        'sub_type' => $claimType, // e.g. 'PORTABILITY'
        'assigned_to' => 'dpo@company.com',
        'priority' => 'HIGH_LEVEL'
    ];
    saveComplianceTicket($ticket);
}
?>
`,
            go: `
// GO: Simple configuration declaring DPO variables
package main

type GovernanceConfig struct {
	DPOEmail        string
	DPORegisterID   string
	IsRegisteredAPDP bool
}

func LoadGovConfig() GovernanceConfig {
	return GovernanceConfig{
		DPOEmail:        "dpo@empresa.cl",
		DPORegisterID:   "REG-2026-993",
		IsRegisteredAPDP: true,
	}
}
`
          }
        },
        {
          id: "GOV-2",
          code: "GOV-2",
          weight: 4,
          criticality: "high",
          text: {
            en: "Has the software company documented and implemented a certified Infraction Prevention Model (MPI)?",
            es: "¿Ha documentado e implementado la empresa de software un Modelo de Prevención de Infracciones (MPI) certificado?"
          },
          recommendation: {
            en: "Build and certify the MPI. Document risks, draw controls, set up internal whistleblowing channels, establish disciplinary actions, and submit the compliance framework to the APDP for validation.",
            es: "Construir y certificar el MPI. Documentar riesgos, trazar controles, habilitar canal de denuncias interno, establecer acciones disciplinarias y presentar el marco ante la APDP para su certificación."
          },
          actions: [
            {
              en: "Create a risk mapping ledger connecting processing activities, potential threats, and active mitigations.",
              es: "Crear una matriz de riesgos que conecte las actividades de tratamiento con amenazas potenciales y mitigaciones activas."
            },
            {
              en: "Implement an anonymous internal ticketing system or whistleblowing channel for security/privacy concerns.",
              es: "Implementar un sistema de tickets anónimos o canal de denuncias interno para reportar brechas de privacidad."
            }
          ],
          snippets: {
            python: `
# PYTHON: Logging compliance violations dynamically in code
def log_compliance_risk(risk_level: str, description: str):
    # Logs into SIEM/Matriz of Risks
    risk_event = {
        "logged_at": datetime.utcnow().isoformat(),
        "risk_level": risk_level, # 'LOW', 'MEDIUM', 'HIGH'
        "description": description,
        "prevention_model_code": "MPI-CONTROL-SBN-1"
    }
    write_to_risk_register(risk_event)
`,
            js: `
// JAVASCRIPT: Whistleblowing endpoint structure in Express (MPI requirement)
app.post('/api/v1/compliance/whistleblower', async (req, res) => {
  const { incident, details } = req.body; // No identifying variables requested (Anonymous)
  
  await saveAnonymousReport({
    incident,
    details,
    timestamp: new Date().toISOString()
  });
  
  res.status(201).json({ message: "Anonymous report received." });
});
`,
            php: `
<?php
// PHP: Helper logger routing security audit issues to compliance officer
function registerMpiDeviation($controlCode, $reason) {
    // Save to database mapping MPI compliance gaps
    $stmt = $pdo->prepare("INSERT INTO mpi_deviations (control_code, reason, detected_at) VALUES (?, ?, NOW())");
    $stmt->execute([$controlCode, $reason]);
}
?>
`,
            go: `
// GO: Simple Risk Matrix tracking struct
package main

type RiskItem struct {
	ProcessName    string
	ThreatType     string
	ActiveControl  string
	ResidualRisk   string // 'LOW', 'MEDIUM', 'HIGH'
}

func LoadRiskMatrix() []RiskItem {
	return []RiskItem{
		{
			ProcessName:   "Matrícula Escolar",
			ThreatType:    "Exposición de Datos de Menores",
			ActiveControl: "Cifrado AES-256 + Roles de Acceso",
			ResidualRisk:  "LOW",
		},
	}
}
`
          }
        },
        {
          id: "GOV-3",
          code: "GOV-3",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Is there an active, updated Register of Processing Activities (RoPA) detailing what data is stored and for how long?",
            es: "¿Existe un Registro de Actividades de Tratamiento (RAT) activo y actualizado que detalle qué datos se guardan y por cuánto tiempo?"
          },
          recommendation: {
            en: "Build the RoPA document. List all data types processed, purposes, target systems, retention terms, and physical storage locations.",
            es: "Construir el documento RAT. Listar los tipos de datos tratados, propósitos, sistemas de destino, plazos de conservación y ubicaciones de almacenamiento físico."
          },
          actions: [
            {
              en: "Define automatic database purging scripts to enforce data retention limits (e.g. prune logs older than 1 year).",
              es: "Definir scripts de depuración automática en base de datos para cumplir con los plazos de retención (ej. eliminar logs de más de 1 año)."
            },
            {
              en: "Consolidate the RoPA spreadsheet/dashboard and audit it quarterly.",
              es: "Consolidar la planilla o panel de RAT y auditarla de forma trimestral."
            }
          ],
          snippets: {
            python: `
# PYTHON: Cron job script deleting logs older than retention period (e.g., 365 days)
from datetime import datetime, timedelta
from database import get_db_connection

def prune_expired_logs():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # RoPA defines retention limit for activity logs is 1 year (365 days)
    limit_date = datetime.utcnow() - timedelta(days=365)
    
    cursor.execute("DELETE FROM activity_logs WHERE timestamp < %s", (limit_date,))
    deleted_rows = cursor.rowcount
    conn.commit()
    
    print(f"Purged {deleted_rows} expired logs from database.")
`,
            js: `
// JAVASCRIPT: Scheduled function using node-cron to delete inactive accounts after grace period
import cron from 'node-cron';
import { prisma } from './db.js';

// Run every night at midnight
cron.schedule('0 0 * * *', async () => {
  // RoPA defines inactive profiles get deleted after 2 years
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);
  
  const result = await prisma.user.deleteMany({
    where: {
      lastLogin: { lt: cutoffDate },
      active: false
    }
  });
  
  console.log(\`Deleted \${result.count} inactive accounts.\`);
});
`,
            php: `
<?php
// PHP: Daily cleanup script ran via CRON to erase expired items
$cutoffDate = date('Y-m-d H:i:s', strtotime('-180 days')); // Retain session tokens for 180 days max

$stmt = $pdo->prepare("DELETE FROM session_tokens WHERE created_at < ?");
$stmt->execute([$cutoffDate]);
echo "Deleted " . $stmt->rowCount() . " expired session tokens.";
?>
`,
            go: `
// GO: Database cleaner removing items based on timestamp comparisons
package main

import (
	"database/sql"
	"time"
)

func PruneTokens(db *sql.DB) error {
	// Delete tokens older than 30 days
	expirationLimit := time.Now().Add(-30 * 24 * time.Hour)
	_, err := db.Exec("DELETE FROM oauth_tokens WHERE created_at < $1", expirationLimit)
	return err
}
`
          }
        },
        {
          id: "GOV-4",
          code: "GOV-4",
          weight: 2,
          criticality: "low",
          text: {
            en: "Are developers and operations staff trained at least once a year on data privacy?",
            es: "¿Son los desarrolladores y personal de operaciones capacitados al menos una vez al año en privacidad de datos?"
          },
          recommendation: {
            en: "Launch regular compliance trainings. Conduct workshops on secure database queries, handling API payload scopes, and OWASP Top 10 vulnerabilities related to data exposure.",
            es: "Lanzar capacitaciones regulares de cumplimiento. Realizar talleres sobre consultas seguras a bases de datos, manejo de payloads en APIs y vulnerabilidades OWASP Top 10 de exposición de datos."
          },
          actions: [
            {
              en: "Create a knowledge base with secure coding snippets showing how to implement encryption, log sanitization, and DB queries.",
              es: "Crear una base de conocimientos con snippets de código seguro que muestren cómo cifrar, sanitizar logs y consultar la BD."
            },
            {
              en: "Track team participation in privacy training sessions and document attendance logs for compliance audits.",
              es: "Registrar la participación del equipo en capacitaciones y documentar las firmas de asistencia para auditorías."
            }
          ],
          snippets: {
            python: `
# PYTHON: Secure logger sanitization function to filter out passwords/RUTs from debug logs
import re

def sanitize_log_message(message: str) -> str:
    # Patterns to match Chilean RUT (e.g. 12.345.678-9) or credit cards
    rut_pattern = r'\\b\\d{1,2}\\.?\\d{3}\\.?\\d{3}-?[\\dkK]\\b'
    sanitized = re.sub(rut_pattern, "[REDACTED_RUT]", message)
    
    # Filter passwords fields in log texts
    password_pattern = r'(password|contraseña)\\s*[:=]\\s*"[^"]+"'
    sanitized = re.sub(password_pattern, r'\\1="[REDACTED]"', sanitized)
    
    return sanitized
`,
            js: `
// JAVASCRIPT: Log sanitizing logic before saving to console or files
export function cleanLogPayload(data) {
  const sensitiveKeys = ['password', 'token', 'cvv', 'creditCard', 'rut'];
  const cleaned = { ...data };
  
  for (const key of sensitiveKeys) {
    if (cleaned[key]) {
      cleaned[key] = '[HIDDEN_SENSITIVE_DATA]';
    }
  }
  return cleaned;
}
`,
            php: `
<?php
// PHP: SQL Injection mitigation guide (Secure Query Workshop)
function getSecureUser($pdo, $email) {
    // INCORRECT: $sql = "SELECT * FROM users WHERE email = '$email'"; (Vulnerable to SQLi)
    // CORRECT: Always use prepared statements with parameter binding
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>
`,
            go: `
// GO: Simple string sanitizer replacing credit card patterns from logs
package main

import (
	"regexp"
)

func SanitizeCardNumbers(logMsg string) string {
	// Mask VISA/Mastercard numbers (16 digits)
	r := regexp.MustCompile(\`\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b\`)
	return r.ReplaceAllString(logMsg, "[REDACTED_CARD_NUMBER]")
}
`
          }
        }
      ]
    },
    {
      id: "cbt",
      title: {
        en: "Cross-Border Transfers",
        es: "Transferencias Internacionales"
      },
      description: {
        en: "Validates compliance regarding the location of database hosting, external API connections, and cloud provider agreements.",
        es: "Valida el cumplimiento respecto a la ubicación del hosting de base de datos, conexiones a APIs externas y contratos de proveedores cloud."
      },
      questions: [
        {
          id: "CBT-1",
          code: "CBT-1",
          weight: 4,
          criticality: "high",
          text: {
            en: "Are the physical server locations (countries and regions) of all cloud providers hosting user databases documented?",
            es: "¿Están documentadas las ubicaciones físicas de los servidores (países y regiones) de todos los proveedores cloud que alojan bases de datos?"
          },
          recommendation: {
            en: "Map physical hosting nodes. Keep an updated map of cloud provider regions (e.g., AWS us-east-1, GCP southamerica-west1) where user databases are hosted.",
            es: "Mapear nodos de hosting físicos. Mantener un mapa actualizado de regiones de proveedores cloud (ej. AWS us-east-1, GCP southamerica-west1) donde se alojen bases de datos de usuarios."
          },
          actions: [
            {
              en: "Document architecture diagrams showing database cluster locations (primary and replicas).",
              es: "Documentar diagramas de arquitectura que muestren las ubicaciones de los clústeres de base de datos (principales y réplicas)."
            },
            {
              en: "Configure infrastructure deployment configurations (Terraform, CloudFormation) to restrict data regions.",
              es: "Configurar la implementación de infraestructura (Terraform, CloudFormation) para restringir regiones de datos permitidas."
            }
          ],
          snippets: {
            python: `
# PYTHON/TERRAFORM: Specifying GCP region southamerica-west1 (Santiago, Chile) to keep databases local
# File: main.tf

provider "google" {
  project = "your-chilean-project"
  region  = "southamerica-west1" # Restricts host location to Santiago, Chile
}

resource "google_sql_database_instance" "master" {
  name             = "users-db-instance"
  database_version = "POSTGRES_15"
  region           = "southamerica-west1" # Keep databases inside Chile
  
  settings {
    tier = "db-f1-micro"
  }
}
`,
            js: `
// JAVASCRIPT: AWS RDS Infrastructure creation via AWS-SDK specifying specific regions
import { RDSClient, CreateDBInstanceCommand } from "@aws-sdk/client-rds";

// Enforce connection region (e.g., sa-east-1: São Paulo, South America)
const client = new RDSClient({ region: "sa-east-1" });

export async function createDatabase() {
  const command = new CreateDBInstanceCommand({
    DBInstanceIdentifier: "user-database",
    Engine: "postgres",
    DBInstanceClass: "db.t4g.micro",
    AllocatedStorage: 20,
    MasterUsername: "dbadmin",
    MasterUserPassword: "SecurePassword123"
  });
  
  return await client.send(command);
}
`,
            php: `
<?php
// PHP: Laravel database host configuration checking correct region endpoints
// File: config/database.php
return [
    'connections' => [
        'pgsql' => [
            'driver' => 'pgsql',
            // Ensure endpoint connects exclusively to the local database node in Santiago
            'host' => env('DB_HOST', 'db.southamerica-west1.gcp.internal'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'users_prod'),
            'username' => env('DB_USERNAME', 'postgres'),
            'password' => env('DB_PASSWORD', ''),
        ]
    ]
];
?>
`,
            go: `
// GO: Database connection setup forcing SSL and pointing to safe region endpoints
package main

import (
	"database/sql"
	_ "github.com/lib/pq"
)

func ConnectToSafeDB() (*sql.DB, error) {
	// Force sslmode=require to protect transfer route
	dsn := "postgres://user:pass@gcp-db-sa-west1.postgres.database.azure.com/dbname?sslmode=require"
	return sql.Open("postgres", dsn)
}
`
          }
        },
        {
          id: "CBT-2",
          code: "CBT-2",
          weight: 4,
          criticality: "high",
          text: {
            en: "Are Standard Contractual Clauses (SCC) or data transfer agreements signed with cloud hosts (e.g., AWS, Azure) outside Chile?",
            es: "¿Están firmadas las Cláusulas Contractuales Tipo (CCT) o acuerdos de transferencia con proveedores cloud (ej. AWS, Azure) fuera de Chile?"
          },
          recommendation: {
            en: "Incorporate SCCs into agreements. Review and sign Cloud Service Provider Data Processing Addendums (DPAs) that contain Standard Contractual Clauses recognized under Ley 21.719 or RGPD.",
            es: "Incorporar CCT en los contratos. Revisar y firmar los Addendums de Tratamiento de Datos (DPA) de los proveedores de nube que contengan Cláusulas Contractuales Tipo reconocidas por la ley chilena o el RGPD."
          },
          actions: [
            {
              en: "Review AWS Artifact or Azure Compliance portal to select and accept the updated DPA including standard clauses.",
              es: "Revisar AWS Artifact o el portal de cumplimiento de Azure para seleccionar y aceptar el DPA actualizado que incluye cláusulas estándar."
            },
            {
              en: "Maintain a folder of signed transfer agreements with cloud hosting and backup providers.",
              es: "Mantener una carpeta de contratos de transferencia firmados con proveedores cloud y de copias de seguridad."
            }
          ],
          snippets: {
            python: `
# PYTHON: Configuration variable validating that Cloud providers have signed DPAs
# Keep a compliance configuration dictionary to map active suppliers and DPA signing status

CLOUD_COMPLIANCE_REGISTRY = {
    "amazon_web_services": {
        "dpa_signed": True,
        "scc_included": True,
        "last_verification_date": "2026-05-10"
    },
    "google_cloud_platform": {
        "dpa_signed": True,
        "scc_included": True,
        "last_verification_date": "2026-06-01"
    }
}
`,
            js: `
// JAVASCRIPT: Constant validating transfer conditions before running uploads
export function verifyProviderTransferCompliance(providerName) {
  const complianceMatrix = {
    'AWS': { hasSCC: true, country: 'US', status: 'COMPLIANT' },
    'Heroku': { hasSCC: false, country: 'US', status: 'NON_COMPLIANT' }
  };
  
  const check = complianceMatrix[providerName];
  if (!check || check.status !== 'COMPLIANT') {
    throw new Error(\`Security Alert: Transacting data with \${providerName} violates cross-border clauses.\`);
  }
}
`,
            php: `
<?php
// PHP: Helper function verifying if cloud provider is on approved compliance list
function isDpaSigned($provider) {
    $registered = [
        'Azure' => true,
        'DigitalOcean' => false
    ];
    return isset($registered[$provider]) && $registered[$provider];
}
?>
`,
            go: `
// GO: Array search validating DPA approval status
package main

import (
	"errors"
)

type CloudProvider struct {
	Name      string
	DPASigned bool
}

func CheckTransferSanction(provider CloudProvider) error {
	if !provider.DPASigned {
		return errors.New("Transfer Blocked: Cloud provider lacks signed DPA/SCC clauses.")
	}
	return nil
}
`
          }
        },
        {
          id: "CBT-3",
          code: "CBT-3",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Do external SaaS integrations (analytics, notifications, CRM) meet adequacy standards or have signed data processing clauses?",
            es: "¿Cumplen las integraciones con SaaS externos (analítica, notificaciones, CRM) con estándares de adecuación o tienen cláusulas firmadas?"
          },
          recommendation: {
            en: "SaaS provider audit. Audit third-party services (e.g., Mixpanel, Twilio, Salesforce) processing user emails or behavior to ensure data is protected and backed by active DPAs.",
            es: "Auditoría de proveedores SaaS. Auditar los servicios de terceros (ej. Mixpanel, Twilio, Salesforce) que procesen correos o comportamiento de usuarios para verificar que los datos estén resguardados por DPAs vigentes."
          },
          actions: [
            {
              en: "Create a list of active third-party APIs that process personal data, noting their jurisdiction and safety guarantees.",
              es: "Crear una lista de las APIs de terceros activas que procesen datos personales, registrando su jurisdicción y garantías de seguridad."
            },
            {
              en: "Configure SaaS SDKs (e.g., Google Analytics) to mask IP addresses and anonymize data by default.",
              es: "Configurar los SDKs de SaaS (ej. Google Analytics) para enmascarar direcciones IP y anonimizar datos por defecto."
            }
          ],
          snippets: {
            python: `
# PYTHON: Masking IP addresses and user identifiers before sending to Google Analytics API
import requests
import hashlib

def send_sanitized_event(user_id: int, user_ip: str, event_name: str):
    # Anonymize/hash user_id to prevent sharing raw PII with third party analytics
    hashed_user = hashlib.sha256(str(user_id).encode()).hexdigest()
    
    # Mask user IP: strip last octet (e.g. 192.168.100.12 -> 192.168.100.0)
    ip_parts = user_ip.split('.')
    if len(ip_parts) == 4:
        masked_ip = f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0"
    else:
        masked_ip = "0.0.0.0"
        
    payload = {
        "client_id": hashed_user,
        "uip": masked_ip, # User IP override parameter in GA
        "events": [{"name": event_name}]
    }
    
    requests.post("https://www.google-analytics.com/mp/collect", json=payload)
`,
            js: `
// JAVASCRIPT: Initializing Google Analytics with IP anonymization enabled
import ReactGA from 'react-ga4';

export function initSafeAnalytics() {
  ReactGA.initialize('G-XXXXXXXXXX', {
    gaOptions: {
      anonymizeIp: true, // Force IP Masking on client side
      allowAdFeatures: false // Disable tracking advertising hooks
    }
  });
}
`,
            php: `
<?php
// PHP: Helper function hashing email before sending to external marketing scripts
function sendHashToNewsletterSaaS($email) {
    // MD5/SHA256 hashing allows SaaS to map list without seeing plain email
    $hashedEmail = hash('sha256', strtolower(trim($email)));
    
    $payload = [
        'email_hash' => $hashedEmail,
        'status' => 'subscribed'
    ];
    
    // Dispatch webhook to SaaS
    sendWebhookToProvider($payload);
}
?>
`,
            go: `
// GO: IP masking function for outbound third party API loggers
package main

import (
	"net"
)

func MaskOutboundIP(ipStr string) string {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return "0.0.0.0"
	}
	
	ipv4 := ip.To4()
	if ipv4 != nil {
		// Zero out last octet
		ipv4[3] = 0
		return ipv4.String()
	}
	
	return "0.0.0.0"
}
`
          }
        },
        {
          id: "CBT-4",
          code: "CBT-4",
          weight: 3,
          criticality: "medium",
          text: {
            en: "Does the platform's Privacy Policy explicitly declare to which countries and entities user data is transferred?",
            es: "¿Declara explícitamente la Política de Privacidad de la plataforma a qué países y entidades se transfieren los datos de los usuarios?"
          },
          recommendation: {
            en: "Update the privacy policy. Add a clear section identifying international transfers, explaining target countries, names of host entities, and the safeguards applied.",
            es: "Actualizar la política de privacidad. Agregar una sección clara que identifique las transferencias internacionales, explicando los países de destino, nombres de entidades receptoras y las salvaguardas aplicadas."
          },
          actions: [
            {
              en: "Draft a dedicated 'International Transfers' clause in the public Privacy Policy document.",
              es: "Redactar una cláusula dedicada de 'Transferencias Internacionales' en la Política de Privacidad pública."
            },
            {
              en: "Provide a link to the updated Privacy Policy during registration and inside settings panels.",
              es: "Proporcionar un enlace a la Política de Privacidad actualizada durante el registro y dentro de los paneles de configuración."
            }
          ],
          snippets: {
            python: `
# PYTHON: Loading Privacy Policy document containing international transfer warnings
from flask import render_template

@app.route('/privacy-policy', methods=['GET'])
def get_privacy_policy():
    # Renders template incorporating international transfer disclosure:
    # 'We transfer databases to AWS servers in N. Virginia (USA), governed by SCCs.'
    return render_template('privacy.html', last_updated="2026-06-24")
`,
            js: `
// JAVASCRIPT: Exposing privacy terms endpoint with static template rendering
import express from 'express';
const router = express.Router();

router.get('/api/compliance/terms', (req, res) => {
  res.json({
    version: "2.1",
    effectiveDate: "2026-06-24",
    transfersDeclared: [
      { entity: "Amazon Web Services", country: "United States", safeguard: "Standard Contractual Clauses (SCC)" },
      { entity: "Sendgrid Inc", country: "United States", safeguard: "DPA Agreement" }
    ]
  });
});
`,
            php: `
<!-- PHP: Privacy Policy HTML snippet showing explicit transfer declarations -->
<div class="privacy-section">
    <h3>7. Transferencias Internacionales de Datos</h3>
    <p>Para prestar nuestros servicios, transferimos parte de sus datos a las siguientes entidades fuera de Chile:</p>
    <ul>
        <li><strong>Google Cloud Platform:</strong> Ubicado en EE.UU., respaldado por Cláusulas Contractuales Tipo.</li>
        <li><strong>Stripe Inc (Pagos):</strong> Ubicado en EE.UU., respaldado por políticas de privacidad certificadas.</li>
    </ul>
</div>
`,
            go: `
// GO: JSON payload mapping public privacy parameters
package main

type TransferDisclosure struct {
	Recipient string \`json:"recipient"\`
	Country   string \`json:"country"\`
	Safeguard string \`json:"safeguard"\`
}

func GetDisclosures() []TransferDisclosure {
	return []TransferDisclosure{
		{
			Recipient: "Google LLC",
			Country:   "USA",
			Safeguard: "SCC / DPA",
		},
	}
}
`
          }
        }
      ]
    }
  ]
};

// Export structure for both ES modules and browser inclusion
if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDIT_FRAMEWORK;
} else {
  window.AUDIT_FRAMEWORK = AUDIT_FRAMEWORK;
}
