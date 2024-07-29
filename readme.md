# Kittens: Python with MongoDB and Angular project

This is a demo project built-in Python with mongoDB as database and [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.

## Requirements

- Make sure you have docker and docker-compose installed

- Download and follow instructions: [Windows](https://docs.docker.com/desktop/install/windows-install/), [Linux](https://docs.docker.com/compose/install/linux/)

- [Node.js version v20.15.1](https://nodejs.org/en) required to run Angular CLI

## Backend FastAPI server setup

Run following command from project root path (kittens_py/): 

**Warning:** In case of using Windows: open WSL2 terminal (Ubuntu) first.

```python	
docker-compose -p kittens up --build
```	

You should see the API at: http://localhost:8000/docs

## Frontend Angular setup

Install all required dependencies:

  - Use following command from project root path (kittens_py/):

```node.js
npm install
```

## Angular snippets

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Commit

To ensure good code quality before committing, some hooks have been added, in case of a problem with `pre-commit` about binary files, please use following command: `git config --unset core.hooksPath` (it can be required just once).



Created by [Rafael López Pérez](https://github.com/rlp1990)
