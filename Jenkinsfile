pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKERHUB_NAMESPACE = 'your-dockerhub-username'
        IMAGE_NAME = 'your-image-name'
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository
                git 'https://github.com/your-repo/your-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js version 14.x using the NodeJS Plugin
                script {
                    def nodejs = tool name: 'NodeJS 14', type: 'NodeJSInstallation'
                    env.PATH = "${nodejs}/bin:${env.PATH}"
                }
                // Install dependencies
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    def dockerImage = docker.build("${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def dockerImage = docker.build("${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}")
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

