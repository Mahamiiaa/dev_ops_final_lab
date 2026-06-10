pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'zsthedev'
        CLIENT_IMAGE    = "zsthedev/taskmanager-client:v1"
        SERVER_IMAGE    = "zsthedev/taskmanager-server:v1"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Mahamiiaa/dev_ops_final_lab.git'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Client') {
                    steps { dir('client') { sh 'npm install' } }
                }
                stage('Server') {
                    steps { dir('server') { sh 'npm install' } }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy fs . --exit-code 0 --severity HIGH,CRITICAL'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${CLIENT_IMAGE} ./client'
                sh 'docker build -t ${SERVER_IMAGE} ./server'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'zsthedev',
                    passwordVariable: 'maham05sep'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push ${CLIENT_IMAGE}'
                    sh 'docker push ${SERVER_IMAGE}'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success { echo '✅ Pipeline completed!' }
        failure { echo '❌ Pipeline failed!' }
    }
}