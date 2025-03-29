# Script para actualizar la configuración con la IP de Minikube
Write-Host "Actualizando configuración con la IP de Minikube..."

# Obtener la IP de Minikube
$minikubeIP = minikube ip

Write-Host "La IP de Minikube es: $minikubeIP"

# Actualizar la configuración
$configYaml = Get-Content k8s-new/01-config.yaml -Raw
$configYaml = $configYaml -replace "MINIKUBE_IP", $minikubeIP

# Crear un archivo temporal con la configuración actualizada
$configYaml | Out-File -FilePath k8s-new/01-config-updated.yaml -Encoding utf8

# Aplicar la configuración actualizada
kubectl apply -f k8s-new/01-config-updated.yaml

# Reiniciar los deployments para que tomen la nueva configuración
Write-Host "Reiniciando deployments para aplicar la nueva configuración..."
kubectl rollout restart deployment/client-app -n stadium-delivery
kubectl rollout restart deployment/restaurant-admin -n stadium-delivery
kubectl rollout restart deployment/inventory-service -n stadium-delivery
kubectl rollout restart deployment/order-service -n stadium-delivery
kubectl rollout restart deployment/notification-service -n stadium-delivery

# Ejecutar el seed-data
Write-Host "Ejecutando job para inicializar datos..."
kubectl delete job/seed-data -n stadium-delivery
kubectl apply -f k8s-new/06-inventory-service.yaml

Write-Host "Configuración actualizada."
Write-Host "Espera unos segundos para que los servicios se reinicien y luego ejecuta .\access.ps1 para acceder a las aplicaciones." 