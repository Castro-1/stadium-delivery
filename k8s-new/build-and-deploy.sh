#!/bin/bash

# Script para construir imágenes Docker y desplegarlas en Minikube

# Verificar que Minikube esté en ejecución
echo "Verificando que Minikube esté en ejecución..."
minikube status || { echo "Minikube no está en ejecución. Iniciando..."; minikube start; }

# Usar el Docker daemon de Minikube
echo "Usando el Docker daemon de Minikube..."
eval $(minikube docker-env)

# Construir imágenes Docker
echo "Construyendo imágenes Docker..."
cd ..

# Construir cada imagen
echo "Construyendo imagen para client-app..."
docker build -t stadium-delivery/client-app:latest ./client-app

echo "Construyendo imagen para restaurant-admin..."
docker build -t stadium-delivery/restaurant-admin:latest ./restaurant-admin

echo "Construyendo imagen para inventory-service..."
docker build -t stadium-delivery/inventory-service:latest ./inventory-service

echo "Construyendo imagen para order-service..."
docker build -t stadium-delivery/order-service:latest ./order-service

echo "Construyendo imagen para notification-service..."
docker build -t stadium-delivery/notification-service:latest ./notification-service

# Desplegar en Kubernetes
echo "Desplegando en Kubernetes..."
cd k8s-new

# Crear namespace y aplicar configuraciones
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-config.yaml
kubectl apply -f 02-storage.yaml

# Desplegar servicios de infraestructura
echo "Desplegando servicios de infraestructura..."
kubectl apply -f 03-mongodb.yaml
kubectl apply -f 04-postgres.yaml
kubectl apply -f 05-kafka.yaml

# Esperar a que los servicios de infraestructura estén listos
echo "Esperando a que los servicios de infraestructura estén listos..."
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=mongodb --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=zookeeper --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=kafka --timeout=120s

# Desplegar microservicios
echo "Desplegando microservicios..."
kubectl apply -f 06-inventory-service.yaml
kubectl apply -f 07-order-service.yaml
kubectl apply -f 08-notification-service.yaml

# Esperar a que los microservicios estén listos
echo "Esperando a que los microservicios estén listos..."
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=inventory-service --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=order-service --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=notification-service --timeout=120s

# Desplegar aplicaciones frontend
echo "Desplegando aplicaciones frontend..."
kubectl apply -f 09-client-app.yaml
kubectl apply -f 10-restaurant-admin.yaml

# Habilitar el addon de ingress
echo "Habilitando el addon de ingress en Minikube..."
minikube addons enable ingress

# Obtener URL
echo "Configuración completada. Las aplicaciones estarán disponibles en:"
echo "Cliente: $(minikube service -n stadium-delivery client-app --url)"
echo "Admin: $(minikube service -n stadium-delivery restaurant-admin --url)"

echo "Puede monitorear los pods con: kubectl -n stadium-delivery get pods" 