# OmmPlants

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Website

How the frontend works unchanged
The index.html already calls fetch('/api/subscribe', ...) — the netlify.toml redirect maps /api/* to the functions, so no frontend changes needed.

To deploy

cd website
npx netlify login        # one-time auth
npx netlify init         # link to a Netlify site
npx netlify deploy --prod
Or connect the repo to Netlify via the dashboard — set Base directory to website/ and it'll auto-deploy on push.

To test locally

cd website
npx netlify dev
This runs functions + static site together on localhost:8888. The Express server in server/ still works independently for local dev without Netlify (npm run dev on port 4000).