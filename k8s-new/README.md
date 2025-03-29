# Despliegue de Stadium Delivery en Kubernetes con Minikube

Este directorio contiene los archivos YAML necesarios para desplegar la aplicación Stadium Delivery en un cluster de Kubernetes local usando Minikube.

## Requisitos previos

- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/)

## Estructura de archivos

- `00-namespace.yaml`: Define el namespace para la aplicación
- `01-config.yaml`: ConfigMaps y Secrets para la configuración
- `02-storage.yaml`: Recursos de almacenamiento persistente
- `03-mongodb.yaml`: Deployment y Service para MongoDB
- `04-postgres.yaml`: Deployment y Service para PostgreSQL
- `05-kafka.yaml`: Deployments y Services para Kafka y Zookeeper
- `06-inventory-service.yaml`: Deployment y Service para el servicio de inventario
- `07-order-service.yaml`: Deployment y Service para el servicio de órdenes
- `08-notification-service.yaml`: Deployment y Service para el servicio de notificaciones
- `09-client-app.yaml`: Deployment, Service e Ingress para la aplicación cliente
- `10-restaurant-admin.yaml`: Deployment, Service e Ingress para la aplicación de administración
- `build-and-deploy.sh`: Script para construir las imágenes y desplegar en Minikube (Bash)
- `deploy.ps1`: Script para construir las imágenes y desplegar en Minikube (PowerShell)
- `access.ps1`: Script para abrir los puertos y acceder a las aplicaciones (PowerShell)
- `cleanup.ps1`: Script para limpiar todos los recursos creados (PowerShell)

## Pasos para el despliegue en Windows (PowerShell)

1. Abre PowerShell y navega a la carpeta k8s-new:
   ```
   cd k8s-new
   ```

2. Ejecuta el script de despliegue:
   ```
   .\deploy.ps1
   ```

3. Una vez completado el despliegue, ejecuta el script para acceder a las aplicaciones:
   ```
   .\access.ps1
   ```

4. El script abrirá dos ventanas de PowerShell adicionales con las URLs para acceder a:
   - Cliente App: La URL se mostrará en la primera ventana 
   - Restaurant Admin: La URL se mostrará en la segunda ventana
   
   Estas URLs serán algo como http://127.0.0.1:XXXXX donde XXXXX es un puerto aleatorio.

5. Mantén estas ventanas abiertas mientras usas las aplicaciones.

6. Para limpiar todos los recursos cuando hayas terminado, ejecuta:
   ```
   .\cleanup.ps1
   ```

## Pasos para el despliegue en Linux/macOS (Bash)

1. Inicia Minikube:
   ```
   minikube start
   ```

2. Habilita el addon de Ingress:
   ```
   minikube addons enable ingress
   ```

3. Ejecuta el script de construcción y despliegue (asegúrate de hacerlo ejecutable primero):
   ```
   chmod +x build-and-deploy.sh
   ./build-and-deploy.sh
   ```

4. Para acceder a las aplicaciones:
   ```
   minikube service -n stadium-delivery client-app
   minikube service -n stadium-delivery restaurant-admin
   ```

5. Para eliminar todos los recursos creados:
   ```
   kubectl delete namespace stadium-delivery
   ```

## Aplicación manual de archivos YAML

Si prefieres aplicar los archivos manualmente, sigue este orden:
```
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-config.yaml
kubectl apply -f 02-storage.yaml
kubectl apply -f 03-mongodb.yaml
kubectl apply -f 04-postgres.yaml
kubectl apply -f 05-kafka.yaml
kubectl apply -f 06-inventory-service.yaml
kubectl apply -f 07-order-service.yaml
kubectl apply -f 08-notification-service.yaml
kubectl apply -f 09-client-app.yaml
kubectl apply -f 10-restaurant-admin.yaml
```

## Monitoreo

Puedes monitorear los pods con:
```
kubectl -n stadium-delivery get pods
```

Para ver los logs de un servicio específico:
```
kubectl -n stadium-delivery logs -f deployment/[nombre-del-servicio]
```

## Solución de problemas

- Si no puedes acceder a las aplicaciones, prueba ejecutando `.\access.ps1` nuevamente.
- Si los servicios no se inician correctamente, verifica los logs con `kubectl logs`.
- Si necesitas reiniciar un despliegue: `kubectl -n stadium-delivery rollout restart deployment/[nombre-del-servicio]`
- Si hay problemas con Kafka, no te preocupes; las aplicaciones deberían funcionar para demostraciones básicas.
- Si ves mensajes de "port in use", significa que ya hay un proceso utilizando ese puerto. Cierra las ventanas anteriores y ejecuta `.\access.ps1` nuevamente. 