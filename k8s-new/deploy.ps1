# Script para construir imágenes Docker y desplegarlas en Minikube para Windows PowerShell

# Verificar que Minikube esté en ejecución
Write-Host "Verificando que Minikube esté en ejecución..."
$minikubeStatus = minikube status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Minikube no está en ejecución. Iniciando..."
    minikube start
}
else {
    Write-Host $minikubeStatus
}

# Usar el Docker daemon de Minikube
Write-Host "Usando el Docker daemon de Minikube..."
# Ejecuta el comando y captura su salida
$dockerEnvCmd = minikube -p minikube docker-env --shell powershell
# Evalúa la salida como comandos
$dockerEnvCmd | Invoke-Expression

# Construir imágenes Docker
Write-Host "Construyendo imágenes Docker..."
Set-Location ..

# Construir cada imagen
Write-Host "Construyendo imagen para client-app..."
docker build -t stadium-delivery/client-app:latest ./client-app

Write-Host "Construyendo imagen para restaurant-admin..."
docker build -t stadium-delivery/restaurant-admin:latest ./restaurant-admin

Write-Host "Construyendo imagen para inventory-service..."
docker build -t stadium-delivery/inventory-service:latest ./inventory-service

Write-Host "Construyendo imagen para order-service..."
docker build -t stadium-delivery/order-service:latest ./order-service

Write-Host "Construyendo imagen para notification-service..."
docker build -t stadium-delivery/notification-service:latest ./notification-service

# Desplegar en Kubernetes
Write-Host "Desplegando en Kubernetes..."
Set-Location k8s-new

# Crear namespace y aplicar configuraciones
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-config.yaml
kubectl apply -f 02-storage.yaml

# Desplegar servicios de infraestructura
Write-Host "Desplegando servicios de infraestructura..."
kubectl apply -f 03-mongodb.yaml
kubectl apply -f 04-postgres.yaml
kubectl apply -f 05-kafka.yaml

# Esperar a que los servicios de infraestructura estén listos
Write-Host "Esperando a que los servicios de infraestructura estén listos..."
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=mongodb --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=zookeeper --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=kafka --timeout=120s

# Desplegar microservicios
Write-Host "Desplegando microservicios..."
kubectl apply -f 06-inventory-service.yaml
kubectl apply -f 07-order-service.yaml
kubectl apply -f 08-notification-service.yaml

# Esperar a que los microservicios estén listos
Write-Host "Esperando a que los microservicios estén listos..."
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=inventory-service --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=order-service --timeout=120s
kubectl -n stadium-delivery wait --for=condition=ready pod -l app=notification-service --timeout=120s

# Desplegar aplicaciones frontend
Write-Host "Desplegando aplicaciones frontend..."
kubectl apply -f 09-client-app.yaml
kubectl apply -f 10-restaurant-admin.yaml

# Habilitar el addon de ingress
Write-Host "Habilitando el addon de ingress en Minikube..."
minikube addons enable ingress

# Obtener URL
Write-Host "Configuración completada. Las aplicaciones estarán disponibles en:"
Write-Host "Cliente: $(minikube service -n stadium-delivery client-app --url)"
Write-Host "Admin: $(minikube service -n stadium-delivery restaurant-admin --url)"

Write-Host "Puede monitorear los pods con: kubectl -n stadium-delivery get pods"
Write-Host ""
Write-Host "IMPORTANTE: Para acceder a las aplicaciones, ejecute 'minikube tunnel' en otra ventana de PowerShell como administrador" 