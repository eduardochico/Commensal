# Commensal Backend

API construida con NestJS para enviar y validar códigos de verificación vía WhatsApp usando Twilio y Redis.

## Requisitos

- Node.js 18+
- Redis local en ejecución
- Cuenta de Twilio con acceso a la API de WhatsApp

## Configuración

1. Copia `.env.example` a `.env` y completa las variables necesarias:

```bash
cp .env.example .env
```

Variables principales:

- `API_KEY`: llave que deben enviar los clientes en el header `x-api-key`.
- `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`: credenciales de Twilio.
- `TWILIO_WHATSAPP_FROM`: número autorizado por Twilio en formato `whatsapp:+1234567890`.
- `VERIFICATION_TTL`: segundos que dura vigente el código (default 600).
- Datos de conexión a Redis (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).

2. Instala las dependencias:

```bash
npm install
```

3. Levanta el servidor en modo desarrollo:

```bash
npm run start:dev
```

4. Para construir la versión compilada:

```bash
npm run build
```

## Endpoints

Todos los endpoints requieren el header `x-api-key`.

### POST `/verification/send`

Body:

```json
{
  "email": "usuario@correo.com",
  "phoneNumber": "+521234567890"
}
```

Genera un código de 4 dígitos, lo guarda en Redis y envía un WhatsApp con el código.

### POST `/verification/verify`

Body:

```json
{
  "email": "usuario@correo.com",
  "phoneNumber": "+521234567890",
  "code": "1234"
}
```

Valida el código contra Redis y, si coincide, marca la verificación como exitosa.

## Notas

- Los números telefónicos deben venir en formato E.164.
- Redis almacena los códigos usando como llave la combinación de correo y teléfono.
- Al validar correctamente, el código se elimina de Redis.
