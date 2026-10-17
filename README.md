# Cancun Tours

Catálogo turístico de demostración para explorar experiencias de la Riviera Maya y probar un recorrido de reserva completo.

Demo de portafolio de **Lester David Uicab Gongora**. Reconstrucción independiente, desarrollada con Vite, JavaScript, HTML y CSS.

## Funcionalidades

- Búsqueda por experiencia y destino, categorías y orden por precio.
- Ficha con inclusiones e itinerario de muestra.
- Reserva con fecha, adultos, niños y cálculo de tarifa.
- Cupo local de 12 viajeros por tour y fecha; una cancelación libera los lugares.
- Historial de reservas, referencia y cancelación simulada.

## Ejecutar

Requiere Node.js 22.12 o superior. Abre una terminal en esta carpeta:

```bash
npm ci
npm run dev
```

## Validar y compilar

```bash
npm test
npm run build
npm run preview
```

Las pruebas de Node.js validan la lógica del dominio. GitHub Actions ejecuta instalación, pruebas y compilación en pull requests y cambios de main/develop.

## Recorrido de prueba

1. Abre Isla Mujeres en catamarán y selecciona Reservar demo.
2. Elige fecha, 2 adultos y 1 niño; observa el cambio en el total.
3. Confirma con los datos ficticios precargados.
4. Abre Mis reservas, recarga el navegador y verifica que la reserva sigue disponible.
5. Cancela la reserva para restaurar la capacidad de muestra.

## Persistencia y alcance

Los precios, cupos e itinerarios son ficticios. No procesa pagos, envía correos ni contacta operadores. Las reservas pertenecen únicamente al navegador actual.

Los datos se guardan en localStorage bajo la clave `les-tours-bookings-v1`. No hay servidor, cuentas reales ni sincronización entre dispositivos. Para reiniciar la demo, utiliza Reiniciar demo en el pie de página y confirma el restablecimiento. Utiliza datos ficticios y evita documentos sensibles.

## Estructura

```text
src/main.js       Interfaz y eventos
src/model.js      Catálogo y reglas del dominio
src/utils.js      Almacenamiento, diálogos y utilidades
src/style.css     Estilos y diseño adaptable
public/           Recursos estáticos
tests/            Pruebas de lógica
vercel.json       Compilación y reescritura de rutas
```

Cada carpeta es autosuficiente. No importa archivos de los otros proyectos. Puedes modificar datos y reglas en model.js, la interfaz en main.js y el diseño en style.css.

## Repositorio y demo

- [Ver demo](https://cancun-tours26.vercel.app/)
- [Ver código](https://github.com/davida209/cancun-tours)
- [Portafolio de Lester David](https://portfoliolester.vercel.app/)

## Git y despliegue

```bash
git clone https://github.com/davida209/cancun-tours.git
cd cancun-tours
npm ci
npm run dev
```

El repositorio está conectado a su proyecto de Vercel. Los cambios en `main` activan un despliegue automático. GitHub Actions valida las pruebas y la compilación en cambios de `main` y `develop`, y en pull requests.

Configuración: framework Vite, instalación `npm ci`, compilación `npm run build`, salida `dist`. No requiere variables de entorno. No subas `node_modules`, `dist`, `.env` ni `.vercel`; `.gitignore` ya los excluye.

Antes de subir cambios, ejecuta `npm test` y `npm run build`. Usa ramas `feature/*` y pull requests para revisar cambios. Conserva el proyecto de Vercel existente para mantener su dirección pública.

## Recursos visuales

Las fotografías de referencia están incluidas en public/images. Consulta CREDITOS.md para sus fuentes. No representan servicios u obras reales.

Las fuentes se incluyen en `public/fonts`, con sus licencias OFL. No se requiere Google Fonts para visualizar el diseño.
