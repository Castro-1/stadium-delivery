# Script para abrir puertos y acceder a las aplicaciones de Stadium Delivery
Write-Host "Abriendo puertos para acceder a las aplicaciones..."

Write-Host "IMPORTANTE: Este script abrirá dos ventanas de PowerShell adicionales para mantener los puertos abiertos."
Write-Host "No cierres esas ventanas mientras estés usando las aplicaciones."
Write-Host ""

# Abrir puertos para cada servicio en ventanas separadas
Start-Process powershell -ArgumentList "-Command", "Write-Host 'Cliente App - No cierres esta ventana'; minikube service -n stadium-delivery client-app"
Start-Process powershell -ArgumentList "-Command", "Write-Host 'Restaurant Admin - No cierres esta ventana'; minikube service -n stadium-delivery restaurant-admin"

Write-Host ""
Write-Host "Puedes acceder a tus aplicaciones en las URLs mostradas en las ventanas de PowerShell."
Write-Host "Cuando termines, cierra todas las ventanas de PowerShell relacionadas." 