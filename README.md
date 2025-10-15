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
- `TWILIO_MOCK_MODE`: si lo estableces en `true`, no se intentará contactar a Twilio y los códigos solo se registrarán en logs (útil para desarrollo local).

> **Nota:** Al iniciar la aplicación Nest se validará automáticamente que estas variables estén presentes (a menos que `TWILIO_MOCK_MODE` esté activo) y que `VERIFICATION_TTL` y `REDIS_PORT` tengan valores numéricos positivos. Si falta alguna credencial obligatoria, Nest fallará en el arranque con un mensaje indicando qué variable debes revisar.
- `VERIFICATION_TTL`: segundos que dura vigente el código (default 600).
- Datos de conexión a Redis (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).

2. Instala las dependencias:

```bash
npm install
```

3. Genera los archivos estáticos del frontend (opcional en desarrollo, pero necesario si modificas `frontend/main.tsx`):

```bash
npm run build:frontend
```

4. Levanta el servidor en modo desarrollo:

```bash
npm run start:dev
```

5. Para construir la versión compilada del backend únicamente:

```bash
npm run build
```

Si quieres generar el backend y el frontend en un solo paso, ejecuta:

```bash
npm run build:all
```

El servidor sirve la API bajo el prefijo `/api` y expone los archivos estáticos generados en `/`.

## Acceso al frontend en producción

Cuando despliegues la aplicación en un servidor, el frontend compilado queda disponible en la raíz del dominio que utilices. Por ejemplo, si el backend está publicado en `https://tu-dominio.com`, podrás ingresar a la interfaz web navegando directamente a `https://tu-dominio.com/`. La API REST continuará disponible bajo el prefijo `/api`, por lo que cualquier cliente externo deberá seguir utilizando rutas como `https://tu-dominio.com/api/verification/send`.

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
- Si recibes un error `401` de Twilio (código `20003`), revisa las credenciales configuradas o activa `TWILIO_MOCK_MODE=true` para ejecutar en modo simulación durante el desarrollo.
- El servidor intentará iniciar en HTTPS por defecto. Si faltan certificados válidos, retrocede automáticamente a HTTP.
