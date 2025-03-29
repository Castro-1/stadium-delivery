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
- `proxy-fix.ps1`: Script para configurar port-forwarding y corregir conexiones (PowerShell)
- `test-api.ps1`: Script para probar las APIs directamente
- `cleanup.ps1`: Script para limpiar todos los recursos creados (PowerShell)

## Guía rápida para desplegar la aplicación

Sigue estos pasos para desplegar rápidamente la aplicación:

1. Abre PowerShell y navega a la carpeta k8s-new:
   ```
   cd k8s-new
   ```

2. Asegúrate de que Minikube esté ejecutándose:
   ```
   minikube start
   ```

3. Ejecuta el script de despliegue:
   ```
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\deploy.ps1
   ```

4. Inicializa los datos de ejemplo:
   ```
   kubectl exec -it -n stadium-delivery deployment/inventory-service -- node scripts/seed-data.js
   ```

5. Configura port-forwarding y ejecuta las aplicaciones frontend:
   ```
   .\proxy-fix.ps1
   ```

6. Mantén todas las ventanas de PowerShell abiertas mientras usas la aplicación.

7. Para limpiar todos los recursos cuando hayas terminado:
   ```
   .\cleanup.ps1
   ```

## Estructura de la aplicación

La aplicación Stadium Delivery consta de los siguientes componentes:

- **client-app**: Aplicación web para los clientes que quieren ordenar comida
- **restaurant-admin**: Panel de administración para restaurantes
- **inventory-service**: Gestiona productos disponibles (MongoDB)
- **order-service**: Gestiona órdenes y pedidos (PostgreSQL)
- **notification-service**: Gestiona notificaciones (MongoDB)
- **Kafka**: Broker de mensajes para comunicación entre servicios (nota: opcional)

## Flujo de la aplicación

1. El usuario ve los productos disponibles (desde inventory-service)
2. El usuario crea una orden (almacenada en order-service)
3. La orden se procesa y se envían notificaciones (a través de notification-service)

## Solución de problemas

### Problema: No puedo acceder a las aplicaciones frontend (This site can't be reached)
Solución: Este problema se debe a que el driver de Docker en Windows no puede exponer los servicios NodePort directamente. Hay dos formas de solucionarlo:

1. Usar el comando `minikube tunnel` en una ventana separada:
   ```
   minikube tunnel
   ```
   Esto creará un túnel para todos los servicios. Déjalo corriendo mientras usas la aplicación.

2. Usar los comandos de servicio directamente, que crean un túnel específico:
   ```
   minikube service client-app -n stadium-delivery
   minikube service restaurant-admin -n stadium-delivery
   ```

El script `proxy-fix.ps1` ha sido actualizado para usar la segunda opción automáticamente.

### Problema: No puedo conectarme a las APIs desde las aplicaciones frontend
Solución: Ejecuta `.\proxy-fix.ps1` que:
1. Configura port-forwarding para las APIs (http://localhost:808X)
2. Actualiza la configuración de las apps frontend para usar estas URLs
3. Reinicia las aplicaciones y las abre en el navegador

### Problema: Kafka está en CrashLoopBackOff
Solución: Esto no afecta la funcionalidad básica de la aplicación. Algunas notificaciones en tiempo real podrían no funcionar, pero puedes usar el resto de la aplicación normalmente.

Para actualizar manualmente el estado de una orden cuando Kafka no funciona:
```
# Accede a la URL de la API de órdenes directamente
PUT http://localhost:8082/api/orders/1/status
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

Esto cambiará el estado de la orden de PENDING a PROCESSING. También puedes cambiar a:
- "PREPARING" (En preparación)
- "READY" (Listo para entrega)
- "DELIVERED" (Entregado)
- "CANCELLED" (Cancelado)

Alternativamente, puedes intentar implementar la solución Kafka con:
```
kubectl delete -f 05-kafka.yaml
kubectl apply -f 05-kafka.yaml
kubectl -n stadium-delivery rollout restart deployment/order-service deployment/notification-service
```

### Problema: La inicialización de datos (seed-data) falla
Solución: Ejecuta este comando para inicializar manualmente los datos:
```
kubectl exec -it -n stadium-delivery deployment/inventory-service -- node scripts/seed-data.js
```

### Problema: Necesito reiniciar los servicios
Solución: Usa estos comandos para reiniciar un servicio específico:
```
kubectl rollout restart deployment/client-app -n stadium-delivery
kubectl rollout restart deployment/restaurant-admin -n stadium-delivery
kubectl rollout restart deployment/inventory-service -n stadium-delivery
kubectl rollout restart deployment/order-service -n stadium-delivery
kubectl rollout restart deployment/notification-service -n stadium-delivery
```

## Probar las APIs directamente

Para probar las APIs sin usar las aplicaciones frontend:

1. Ejecuta el script de prueba de APIs:
   ```
   .\test-api.ps1
   ```

2. Este script abrirá ventanas de PowerShell que mostrarán las URLs de las APIs y harán pruebas básicas.

## APIs disponibles

Una vez ejecutado el script `proxy-fix.ps1`, puedes acceder a las siguientes URLs:

- **Productos**: http://localhost:8081/api/products/venue/venue456
- **Órdenes**: http://localhost:8082/api/orders
- **Notificaciones**: http://localhost:8083/api/notifications

## Monitoreo

Puedes monitorear los pods con:
```
kubectl -n stadium-delivery get pods
```

Para ver los logs de un servicio específico:
```
kubectl -n stadium-delivery logs -f deployment/[nombre-del-servicio]
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