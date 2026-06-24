# 🛒 Caso 4: Plataforma de Comercio Electrónico (E-commerce)
## Cumplimiento de la Ley N° 21.719 en Retail y Ventas Online

Este documento detalla la aplicación de la nueva ley de protección de datos en un **Sistema de Comercio Electrónico** que gestiona cuentas de usuarios, procesos de compra, pasarelas de pago, envíos y campañas de marketing.

---

## 📊 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Cuenta de Cliente** | RUT, nombres, correo electrónico, contraseñas, direcciones de facturación y despacho. | Datos Personales | Autenticación, procesamiento y entrega de pedidos. |
| **Pasarela de Pagos** | Datos de tarjetas bancarias, token de transacción, historial de compras. | Datos Financieros | Cobro del pedido (habitualmente delegado en un procesador externo seguro). |
| **Módulo de Envíos** | Dirección exacta de entrega, teléfono de contacto, nombre de quien recibe. | Datos Personales | Entrega física de los productos comprados. |
| **Marketing y Analítica** | Cookies de navegación, historial de clics, registros de carritos abandonados. | Datos de Comportamiento | Envío de ofertas, personalización de la tienda y publicidad dirigida. |

---

## ⚖️ 2. Bases Legales de Licitud en el E-commerce

* **Ejecución de un Contrato:**
  * Es la base legal para procesar el pago, generar la boleta o factura y enviar el producto a la dirección indicada. El cliente inicia esta relación contractual voluntariamente al realizar la compra.
* **Consentimiento Expreso (Opt-in independiente):**
  * **Obligatorio para Marketing:** El envío de promociones, newsletters o llamadas comerciales requiere autorización previa y explícita. No se permiten casillas premarcadas.
  * **Cookies Comerciales:** El uso de cookies de terceros para perfilar al usuario y mostrarle anuncios de la tienda en otras webs (Retargeting).
* **Interés Legítimo:**
  * Utilizado para prevenir fraudes transaccionales (ej. validar si la IP de compra coincide con la tarjeta utilizada o patrones inusuales de compra).

---

## 🛑 3. Riesgos Críticos bajo la Ley N° 21.719

> [!WARNING]
> La filtración de datos de tarjetas de crédito o el envío sistemático de correos publicitarios no deseados (Spam) son infracciones graves o gravísimas que pueden acarrear sanciones de hasta **10.000 o 20.000 UTM**.

* **Falta de Contratos con Empresas de Despacho (Couriers):** Entregar nombres, teléfonos y direcciones de los clientes a empresas de logística externas sin un contrato de **Encargado de Tratamiento** que limite el uso de los datos exclusivamente para el despacho.
* **Retención Excesiva de Datos de Pago:** Almacenar directamente en los servidores del e-commerce los números de tarjetas de crédito o códigos CVV (violando la ley y normativas como PCI-DSS).
* **Venta/Cruce de Bases de Datos:** Compartir la base de datos de clientes con otras marcas del mismo grupo económico o socios comerciales sin el consentimiento previo del titular.
* **Dificultad para el "Opt-out" (Revocación):** Enviar un correo promocional que no incluya un botón visible y automático para darse de baja de la lista de envíos.

---

## 🛠️ 4. Medidas de Adecuación Técnica y Organizativa

### A. Gestión de Terceros (Encargados de Tratamiento)
* Firmar anexos de confidencialidad y tratamiento de datos con todos los proveedores de software (ej. CRMs, proveedores de hosting) y empresas de despacho. 
* El contrato debe estipular que el courier no puede retener los datos de los clientes tras la entrega ni utilizarlos para sus propios fines comerciales.

```
[E-commerce] ──(Contrato de Encargado de Tratamiento)──► [Courier Externo]
  └─ Comparte solo: Nombre, Dirección, Teléfono para el despacho de un pedido.
  └─ Prohibición: El courier no puede usar los datos para marketing propio ni revenderlos.
```

### B. Seguridad en los Datos de Pago
* Integrar pasarelas de pago mediante **redirección o webhooks protegidos** (como Webpay, MercadoPago, Stripe).
* El e-commerce nunca debe "ver" ni almacenar en sus bases de datos los datos crudos de las tarjetas; solo debe almacenar un **Token de transacción** provisto por el procesador de pagos.

### C. Transparencia y Consentimiento en el Checkout
* Durante el proceso de pago y registro, incorporar casillas desmarcadas:
  * `[ ]` Acepto los Términos y Condiciones y la Política de Privacidad. (Obligatoria para la compra)
  * `[ ]` Acepto recibir ofertas, descuentos y promociones en mi correo. (Opcional)
* Habilitar un panel en la cuenta del cliente donde pueda editar sus direcciones guardadas o eliminar su cuenta de manera definitiva (Derecho de Supresión).
