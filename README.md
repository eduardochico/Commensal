# Commensal Backend


API construida con NestJS para enviar y validar códigos de verificación vía SMS usando Twilio y Redis.

## Requisitos

- Node.js 18+
- Redis local en ejecución

- Cuenta de Twilio con un número habilitado para SMS

## Configuración

1. Copia `.env.example` a `.env` y completa las variables necesarias:

```bash
cp .env.example .env
```

Variables principales:

- `HTTPS_ENABLED`: activa/desactiva el arranque en HTTPS (default `true`).
- `HTTPS_KEY_PATH` y `HTTPS_CERT_PATH`: rutas al archivo `.key` y `.crt/.pem` para el servidor HTTPS.
- `HTTPS_CA_PATH`: (opcional) ruta a la cadena de certificados si es necesaria.
- `API_KEY`: llave que deben enviar los clientes en el header `x-api-key`.
- `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`: credenciales de Twilio.
- `TWILIO_SMS_FROM`: número autorizado por Twilio en formato `+1234567890`.
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

Genera un código de 4 dígitos, lo guarda en Redis y envía un SMS con el código.

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
- El servidor intentará iniciar en HTTPS por defecto. Si faltan certificados válidos, retrocede automáticamente a HTTP.
