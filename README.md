# KENZA — catálogo administrable + WhatsApp

Primera versión funcional de una web catálogo para **Kenza Posadas**.

## Qué incluye
- Home editorial con identidad visual inspirada en Kenza.
- Catálogo responsive con categorías.
- Ficha de producto con talle, color y cantidad.
- Mini carrito/pedido persistente en el navegador.
- Botón final que arma automáticamente el pedido y lo envía a WhatsApp.
- Sanity CMS para que el dueño cargue, edite, oculte y marque productos como agotados sin tocar código.
- Datos demo como fallback: la web funciona incluso antes de conectar Sanity.

## Estructura
- `frontend/`: React + Vite
- `sanity/`: panel de administración Sanity Studio

## Probar el frontend ahora
```bash
cd frontend
npm install
npm run dev
```

Abrir la URL que muestra Vite, normalmente `http://localhost:5173`.

## Conectar WhatsApp
1. Copiar `frontend/.env.example` a `frontend/.env.local`.
2. Reemplazar `VITE_WHATSAPP_NUMBER` por el número real de Kenza, sin +, espacios ni guiones. Ejemplo Argentina: `5493764XXXXXX`.

## Crear el panel de administración
1. Crear una cuenta/proyecto gratuito en Sanity.
2. Copiar el `projectId` generado.
3. Reemplazar `REEMPLAZAR_CON_PROJECT_ID` en `sanity/sanity.config.js`.
4. En `frontend/.env.local`, agregar ese mismo valor en `VITE_SANITY_PROJECT_ID`.
5. Ejecutar:
```bash
cd sanity
npm install
npm run dev
```
6. Desde el panel, crear productos con fotos, precio, categoría, colores y talles.

## Deploy recomendado
### Frontend
Vercel: importar el repositorio y usar `frontend` como Root Directory. Build: `npm run build`. Output: `dist`.

### Admin
Sanity Studio puede publicarse con:
```bash
cd sanity
npm run deploy
```
Luego se puede usar una URL tipo `kenza.sanity.studio` o conectar un subdominio propio más adelante.

## Datos que faltan para producción
- Número real de WhatsApp.
- Fotos originales de productos (no capturas de Instagram).
- Precios, talles y colores reales.
- Dirección/horarios si se muestran.
- Dominio que quiera usar el cliente.
