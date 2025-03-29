# Script para crear un túnel que permita acceder a los servicios de Kubernetes
Write-Host "Creando túnel para acceder a los servicios..."
Write-Host "NOTA: Este comando debe ejecutarse como Administrador y se mantendrá en ejecución"
Write-Host "mientras necesites acceder a las aplicaciones."
Write-Host "Para detener, presiona Ctrl+C"
Write-Host ""
Write-Host "Tus aplicaciones estarán disponibles en:"
Write-Host "Cliente: http://localhost"
Write-Host "Admin: http://localhost/admin"
Write-Host ""

# Ejecutar el comando de túnel
minikube tunnel 