# Script para abrir puertos y probar directamente las APIs
Write-Host "Abriendo puertos para acceder a las APIs..."

# Abrir puerto para inventory-service y hacer una prueba
Start-Process powershell -ArgumentList "-Command", "Write-Host 'Inventory API - Productos'; minikube service inventory-service -n stadium-delivery --url | Tee-Object -Variable invUrl; Start-Sleep 2; curl -UseBasicParsing `$invUrl/api/products/venue/venue456"

# Abrir puerto para order-service y hacer una prueba
Start-Process powershell -ArgumentList "-Command", "Write-Host 'Order API - Pedidos'; minikube service order-service -n stadium-delivery --url | Tee-Object -Variable orderUrl; Start-Sleep 2; curl -UseBasicParsing `$orderUrl/api/orders"

# Abrir puerto para notification-service y hacer una prueba
Start-Process powershell -ArgumentList "-Command", "Write-Host 'Notification API - Notificaciones'; minikube service notification-service -n stadium-delivery --url | Tee-Object -Variable notifUrl; Start-Sleep 2; curl -UseBasicParsing `$notifUrl/api/notifications"

Write-Host ""
Write-Host "Se han abierto ventanas para probar cada API."
Write-Host "Si ves datos JSON en las ventanas, significa que las APIs están funcionando correctamente."
Write-Host "" 