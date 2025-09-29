# Prueba técnica BBVA autoclicker

<a href="https://bbvaengineering.github.io/challenges/kill/" target="_blank">https://bbvaengineering.github.io/challenges/kill/</a>


## Requisitos propuestos
- [x] La aplicación deberá contener funcionalmente, como mínimo, las instrucciones detalladas en el enunciado.
- [x] El código debe ser público
- [x] Se deberán realizar tests unitarios de las vistas y de los componentes de la aplicación.
- [x] Se podrá utilizar cualquier infraestructura de alojamiento pública como, por ejemplo, Vercel, ***Netlify*** o Github Pages.
- [x] Se debe subir un fichero README.md al repositorio con las instrucciones para hacer funcionar la aplicación en local. Puedes añadir cualquier otro dato que consideres necesario.
  Url App: <a href="kill-risetto.netlify.app" target="_blank">kill-risetto.netlify.app</a>

## Tambien:
- [x] Se ha utilizado un linter para mantener la calidad del código "eslint".
- [x] Se ha utilizado un formateador de código para mantener la calidad del código "prettier".


## Decisiones tomadas respecto a la implementación
  ### Tecnologias
- ***lit-element*** para la creación de componentes web, ya que es sencilla y ligera.
- ***typeScript*** para tener un tipado estricto y prevenir errores.
- ***Vite*** para empaquetar la aplicación, ya que es una herramienta que permite empaquetar la aplicación de forma rápida, sencilla y posee plugins que facilitan la generación dinámica de service Workers.
- ***Vitest*** para los test dada su integración en Vite, velocidad y compatibilidad con typscript de forma nativa.
- ***@vaadin/router*** para poder crear una spa con sus rutas ya que es un router ligero e dieal para WC

### Decisiones especificas
- Los componentes están separados en tres carpetas en la src.
  - ***game/components*** para componentes relativos al juego
  - ***shared/components*** para componentes independientes reutilizables en cualquier vista
  - ***pages*** para componentes de las vistas.
- La ruta ***/game*** comprobará sí se ha introducido un nombre de usuario, en caso contrario redirigirá a la vista home ('/')
- El juego recordará a los usuarios una vez se introduzca el nombre ( ignorará caracteres especiales y mayúsculas ), así como la última dificultad en la que se jugó y las máximas puntuaciones en cada una de las mismas.
- Las máximas puntuaciones se actualizarán cuando se pare el juego y se actualizará automáticamente.
- Para la gestión de la memoria se ha usado el ***localStorage*** del navegador
- Se ha separado la lógica del juego y del usuario en dos servicios (***user-data.service.ts y game.service.ts***)
    -***user-data.service.ts*** se encarga de gestionar toda la lógica correspondiente a los jugadores: creación de nuevos usuarios, comprobación de usuarios ya existentes, actualización de las diferentes puntuaciones máximas
    así como suministrar las herramientas a los componentes para obtener o administrar la infromación del usuario
    -***game.service.ts*** se encarga de gestionar la lógica del interna del juego brindando las funciones y eventos necesarios para el funcionamiento.
- Los test están ubicados en la raíz del proyecto replicando la estructura de la carpeta src con el fin de asegurar que este no entre en el bundle final.
- Se han creado tests básicos de funcionamiento asegurando que los componentes rendericen correctamente y muestren la información debida
- Sobre el funcionamiento del juego:
    - Entrará por defecto en la ruta '/', aquí se deberá el nombre del jugador/a con el fin de habilitar el botón y se actualizará el item del localStorage.
    - En el caso de tratarse de un/a nuevo/a usuario/a iniciará en modo fácil de lo contrario, en la última dificultad jugada por el usuario con su respectiva máxima puntuación.
    - Al hacer click sobre la foto de perfil se regresará a la vista anterior.
    - Al cambiar la dificultad en el elemento select el componente ***GamePage*** detectará el evento y ejecutará la función **GameService.initGame()** que ejecutará la lógica de los intervalos según la dificultad seleccionada,
      este emitirá un customEvent ***game-started*** para indicar a los componentes que lo necesiten que deben actualizar su estado (ej: cambiar el texto del botón). También se actualizará la última dificultad jugada por el/la usuario/a
    - Tras esto se comenzarán a emitir los eventos ***risetto-shown*** y ***risetto-hidden*** para indicar al componente ***GameBoard*** cuando debe actualizar los componentes ***GameCell*** a su estados activo e inactivo respectivamente.
    - Al pausar el juego se enviará de nuevo un customEvent ***game-ended*** para actualizar los estados necesarios y se enviará la información de la partida para ser actualizada en memoria si es necesario.
    - Si se recarga la página se devolverá a la ruta '/' ya que el usuario actual no persiste.


## Instrucciones para hacer funcionar la aplicación en local
para el funcionamiento en local, se deben seguir los siguientes pasos:
1. Clonar el repositorio
```bash
git clone
```
2. Instalar las dependencias
```bash
npm install
```
3. Iniciar la aplicación
```bash
npm run dev
```
4. Abrir el navegador en la siguiente url
```bash
http://localhost:3000/
```
5. Para preparar el bundle de producción
```bash
npm run build
```

### para lanzar los tests

```bash
npm run test
```
