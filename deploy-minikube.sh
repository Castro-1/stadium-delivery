#!/bin/bash
# Archivo: deploy-minikube.sh

# Verificar si minikube está en ejecución
if ! minikube status > /dev/null 2>&1; then
  echo "Iniciando Minikube..."
  minikube start --memory=4096 --cpus=2
else
  echo "Minikube ya está en ejecución"
fi

# Habilitar ingress
echo "Habilitando addon de Ingress..."
minikube addons enable ingress

# Configurar entorno para usar el Docker daemon de minikube
echo "Configurando Docker para usar el daemon de Minikube..."
eval $(minikube docker-env)

# Construir imágenes con el Docker daemon de minikube
echo "Construyendo imágenes Docker..."
docker build -t stadium-delivery/inventory-service:latest ./inventory-service
docker build -t stadium-delivery/order-service:latest ./order-service
docker build -t stadium-delivery/notification-service:latest ./notification-service
docker build -t stadium-delivery/frontend:latest ./frontend

# Aplicar configuraciones de Kubernetes
echo "Aplicando configuraciones de Kubernetes para bases de datos y Kafka..."
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/zookeeper-deployment.yaml
kubectl apply -f k8s/zookeeper-service.yaml
kubectl apply -f k8s/kafka-deployment.yaml
kubectl apply -f k8s/kafka-service.yaml

# Esperar a que las bases de datos y Kafka estén listos
echo "Esperando a que las bases de datos y Kafka estén listos..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb
kubectl wait --for=condition=available --timeout=300s deployment/postgres
kubectl wait --for=condition=available --timeout=300s deployment/zookeeper
kubectl wait --for=condition=available --timeout=300s deployment/kafka

echo "Aplicando configuraciones de Kubernetes para los microservicios..."
kubectl apply -f k8s/inventory-deployment.yaml
kubectl apply -f k8s/inventory-service.yaml
kubectl apply -f k8s/order-deployment.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/notification-deployment.yaml
kubectl apply -f k8s/notification-service.yaml

# Esperar a que los microservicios estén listos
echo "Esperando a que los microservicios estén listos..."
kubectl wait --for=condition=available --timeout=300s deployment/inventory-service
kubectl wait --for=condition=available --timeout=300s deployment/order-service
kubectl wait --for=condition=available --timeout=300s deployment/notification-service

# Desplegar el frontend y el ingress
echo "Desplegando frontend e ingress..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml

# Esperar a que el frontend esté listo
echo "Esperando a que el frontend esté listo..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend

# Obtener URL de acceso
echo "Obteniendo URL de acceso..."
MINIKUBE_IP=$(minikube ip)
echo ""
echo "======================="
echo "Despliegue completado!"
echo "======================="
echo ""
echo "La aplicación estará disponible en: http://$MINIKUBE_IP"
echo ""
echo "Para agregar una entrada en tu archivo /etc/hosts, ejecuta:"
echo "echo \"$MINIKUBE_IP stadium.local\" | sudo tee -a /etc/hosts"
echo ""
echo "Luego podrás acceder a la aplicación en: http://stadium.local"