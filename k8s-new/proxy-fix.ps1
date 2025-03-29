# Este script configura el port-forwarding y actualiza la configuración de las aplicaciones frontend

# Asegurar que estamos en el namespace correcto
kubectl config set-context --current --namespace=stadium-delivery

# Actualizar ConfigMap con las URLs locales
kubectl apply -f k8s-new/frontend-config.yaml

# Reiniciar frontends para aplicar la configuración
Write-Host "Reiniciando deployments frontend..."
kubectl rollout restart deployment/client-app deployment/restaurant-admin

# Reiniciar servicios de backend para reconectar con Kafka
Write-Host "Reiniciando servicios de backend..."
kubectl rollout restart deployment/order-service deployment/notification-service 

# Esperar a que los pods estén listos
Write-Host "Esperando que los pods estén listos..."
kubectl rollout status deployment/client-app --timeout=60s
kubectl rollout status deployment/restaurant-admin --timeout=60s
kubectl rollout status deployment/order-service --timeout=60s
kubectl rollout status deployment/notification-service --timeout=60s

# Configurar port-forwarding para los servicios de backend
Write-Host "Configurando port-forwarding para inventory-service en puerto 8081..."
Start-Process powershell -ArgumentList "-Command kubectl port-forward service/inventory-service 8081:8081 -n stadium-delivery"

Write-Host "Configurando port-forwarding para order-service en puerto 8082..."
Start-Process powershell -ArgumentList "-Command kubectl port-forward service/order-service 8082:8082 -n stadium-delivery"

Write-Host "Configurando port-forwarding para notification-service en puerto 8083..."
Start-Process powershell -ArgumentList "-Command kubectl port-forward service/notification-service 8083:8083 -n stadium-delivery"

# Abrir aplicaciones frontend usando minikube tunnel
Write-Host "Abriendo aplicaciones en el navegador con minikube service..."
Start-Process powershell -ArgumentList "-Command minikube service client-app -n stadium-delivery"
Start-Process powershell -ArgumentList "-Command minikube service restaurant-admin -n stadium-delivery"

Write-Host ""
Write-Host "===== IMPORTANTE ====="
Write-Host "Mantén TODAS las ventanas de PowerShell abiertas para que el port-forwarding siga funcionando."
Write-Host "Las aplicaciones frontend ahora deberían conectarse correctamente a los servicios backend."
Write-Host "====================" 