# Este script agrega encabezados CORS a las APIs para permitir solicitudes desde cualquier origen
# Esto es solo para desarrollo, no para producción

$jsonPayload = '[{"op":"add","path":"/spec/template/spec/containers/0/env/-","value":{"name":"CORS_ALLOW_ORIGIN","value":"*"}}]'

Write-Host "Aplicando CORS a inventory-service..."
kubectl patch deployment inventory-service -n stadium-delivery --type json -p $jsonPayload

Write-Host "Aplicando CORS a order-service..."
kubectl patch deployment order-service -n stadium-delivery --type json -p $jsonPayload

Write-Host "Aplicando CORS a notification-service..."
kubectl patch deployment notification-service -n stadium-delivery --type json -p $jsonPayload

Write-Host "Encabezados CORS agregados a todas las APIs"
Write-Host "Esperando a que los pods se reinicien..."
Start-Sleep -Seconds 5

kubectl -n stadium-delivery get pods 