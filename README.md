## Scope Sentence

My friends and I, wastes our time on budgeting and financial planning. The smallest version is one local React website that helps track expenses and maintains our budgets.

## Prerequisites 

The only prerequisite for this project is that you must have NodeJS installed. 

Here follow the instructions for installation [here](https://nodejs.org/en/download).

There are no environment variable requirements.

## Building / running the project 

### Without a container

```
git clone git@github.com:mhit30/ds219-final-project.git

cd ds219-final-project

npm install 

npm run start
```

### With container

```
docker build -f Containerfile -t my-app:latest .

docker run -p 5173:5173 my-app:latest
```

## How to use the application

![Screenshot](./image.png)

## Additional settings or requirements

None