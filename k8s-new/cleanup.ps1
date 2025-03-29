# Script para eliminar todos los recursos creados en Kubernetes
Write-Host "Eliminando todos los recursos de Kubernetes..."

# Eliminar namespace (esto eliminará automáticamente todos los recursos dentro del namespace)
kubectl delete namespace stadium-delivery

Write-Host "¿Deseas detener Minikube? (S/N)"
$respuesta = Read-Host

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    Write-Host "Deteniendo Minikube..."
    minikube stop
    Write-Host "Minikube detenido."
}
else {
    Write-Host "Minikube sigue en ejecución."
}

Write-Host "Limpieza completada." 