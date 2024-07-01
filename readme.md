# NodeJs server

## Description
A Node.js server built to support a front-end in React. The server is hosted at [https://express-hello-world-ok4t.onrender.com/](https://express-hello-world-ok4t.onrender.com/). The project includes environment variable management for different deployment stages and has been containerized using Docker.



## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [CI-CD](#CI-CD)

## Installation
To install the dependencies, run the following command:
```bash
npm install
```
## Usage
To start the project, run:
```bash
npm start
```

## Environment Variables

This project uses environment variables to manage configuration for different deployment stages. The BASEURL should be set to the host URL.

### Environment Files
local.env - Used for local development

deploy.env - Used for deployment

# Docker
In order to run locally the back-end as container - localhost:8000
```bash
docker build -t nodejs .
docker run -p 8000:8000 nodejs
```
# CI-CD

This project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The workflow builds the Docker image and pushes it to Docker-Hub with the tag format edencoania/release:nodeJs-bakal-server-${{ github.run_number }}.

## Setup
Create GitHub Secrets - in repository secrets

DOCKER_USERNAME: Your Docker Hub username.
DOCKER_PASSWORD: Your Docker Hub password.
DOCKERHUB_REPO: Your Docker Hub repo.

change the repository in .github/workflows/docker-image.yml - instead of "edencoania/release"