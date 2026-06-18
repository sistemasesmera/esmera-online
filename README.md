# Esmera Online

Web de captación para Esmera Online (grupo Esmera Global): formación profesional online con tutor asignado, tutorías semanales y comunidad. La web no vende cursos directamente — captura leads que se gestionan después por el equipo comercial.

## Stack

- [Astro](https://astro.build) (sitio 100% estático, sin backend ni base de datos)
- TypeScript
- Tailwind CSS v4
- Content Collections para cursos, categorías, tutores, testimonios y empresas colaboradoras

## Comandos

| Comando               | Acción                                                |
| :--------------------- | :----------------------------------------------------- |
| `npm install`           | Instala las dependencias                               |
| `npm run dev`            | Arranca el servidor de desarrollo en `localhost:4321`   |
| `npm run build`          | Genera el build de producción en `./dist/`              |
| `npm run preview`        | Previsualiza el build de producción en local            |
| `npm run astro check`    | Comprueba tipos y errores del proyecto                  |

## Estructura de contenido

Los cursos, categorías, tutores, testimonios y empresas colaboradoras se gestionan como archivos Markdown en `src/content/`, validados con Zod en `src/content.config.ts`. No hay panel de administración: el contenido se edita directamente en el repositorio.

## Estado actual

- Captación de leads vía formulario (sin checkout ni pagos online).
- Chatbot flotante con guion fijo (no es IA real todavía).
- CRM, CMS visual y despliegue en Vercel: pendientes de decidir.
- Integración con Moodle (matrícula de alumnos): fuera del alcance de esta fase.
