# turnos-google

Base técnica mínima para una app de reservas con **Google Apps Script** (backend) y **Google Calendar** (fuente futura de disponibilidad), versionada en GitHub y preparada para trabajar desde **GitHub Codespaces** (PC o Android).

> Estado actual: estructura inicial funcional. No incluye todavía lógica completa de reservas.

## Estructura del proyecto

```text
.
├── .clasp.json.example
├── .claspignore
├── .devcontainer/
│   └── devcontainer.json
├── .gitignore
├── appsscript.json
├── package.json
└── src/
    ├── Admin.html
    ├── Client.html
    ├── Code.js
    ├── Index.html
    └── Styles.html
```

## Decisiones técnicas

- **Backend**: Google Apps Script (runtime V8), sin Node.js en producción.
- **Frontend**: HTML/CSS/JavaScript vanilla embebido en Apps Script.
- **Sin frameworks ni build step** para mantener simplicidad.
- **`@google/clasp`** se usa solo como herramienta de sincronización local.
- **Separación clara** entre servidor (`Code.js`) e interfaz (`Index.html`, `Styles.html`, `Client.html`).

## Requisitos previos

- Cuenta de Google con acceso a Apps Script.
- Cuenta de GitHub con acceso al repositorio.
- GitHub Codespaces (desde PC o Android).

## Flujo recomendado desde Codespaces

### 1) Abrir el repositorio en Codespaces

Al crear el Codespace se ejecuta `npm install` (según `.devcontainer/devcontainer.json`) para instalar `@google/clasp`.

Si hace falta manualmente:

```bash
npm install
```

### 2) Crear proyecto en Google Apps Script

1. Ir a https://script.google.com
2. Crear un **Nuevo proyecto**.
3. Copiar el **Script ID** desde:
   - Configuración del proyecto > IDs > Script ID.

### 3) Crear `.clasp.json` local (no subir a Git)

Copiar el ejemplo y completar el ID real:

```bash
cp .clasp.json.example .clasp.json
```

Editar `.clasp.json`:

```json
{
  "scriptId": "TU_SCRIPT_ID_REAL",
  "rootDir": "."
}
```

> `rootDir` se mantiene en `.` para conservar `appsscript.json` en raíz y código en `src/`.

### 4) Autenticar clasp

```bash
npx clasp login
```

Esto abre el flujo OAuth. En Android podés copiar/pegar URL y código de autorización desde el navegador.

### 5) Sincronizar con Apps Script

Descargar contenido remoto (si el proyecto ya tiene archivos):

```bash
npx clasp pull
```

Subir cambios locales:

```bash
npx clasp push
```

## Probar como Web App

1. En Apps Script: **Deploy > New deployment**.
2. Tipo: **Web app**.
3. Ejecutar como: tu usuario.
4. Acceso: según necesidad (por ejemplo, “Anyone with Google account” para pruebas controladas).
5. Deploy y abrir URL.

La página inicial debe mostrar:
- Título exacto: **“Reserva de turnos”**.
- Mensaje de bienvenida.
- Estado de comunicación con `getAppStatus()` vía `google.script.run`.

## Comandos útiles

```bash
npm run clasp:login
npm run clasp:pull
npm run clasp:push
npm run clasp:deploy
```

También podés usar `npx clasp <comando>` directamente.

## Seguridad y secretos (nunca subir)

No subir a GitHub:

- `.clasprc.json` (token OAuth local de clasp)
- `.clasp.json` con Script ID real de trabajo
- `.env*`, claves, tokens, credenciales

Revisar `.gitignore` antes de commitear.

## Particularidades de `src/` y despliegue

- El código fuente principal vive en `src/`.
- `.claspignore` limita qué archivos se envían a Apps Script.
- Verificar siempre que se incluyan `appsscript.json` y `src/**/*.{js,html}`.

## Limitaciones importantes para siguientes etapas

- **Versionado y despliegue**: cada despliegue de Web App usa una versión; cambios nuevos requieren nuevo despliegue.
- **Concurrencia**: múltiples usuarios pueden intentar reservar simultáneamente.
- **Validación server-side obligatoria**: nunca confiar solo en validaciones del navegador.
- **Google Calendar**: no exponer detalles privados del calendario al frontend.
- **Locks temporales**: un lock por sí solo no evita reservas duplicadas en todos los escenarios (reintentos, latencia, estados intermedios). La confirmación final debe hacerse en servidor con verificación de disponibilidad en el momento de confirmar.

## Trabajo desde Android y PC

- **PC**: flujo normal con terminal y navegador.
- **Android**: podés usar Codespaces en navegador móvil; para `clasp login`, completar OAuth en navegador y volver a la terminal.
- Mantener siempre el mismo flujo: pull -> editar -> push -> deploy.

## Próximos pasos sugeridos (no implementados aún)

- Definir modelo de disponibilidad en servidor con Calendar.
- Implementar validación/confirmación atómica de turnos.
- Diseñar endpoint server-side para crear reservas sin exponer datos sensibles.
- Completar `Admin.html` con funciones administrativas reales.
