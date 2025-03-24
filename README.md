# Stadium Delivery - Sistema de Pedidos en Estadios

Este proyecto implementa una aplicación tipo Rappi para entrega de comidas y bebidas dentro de estadios utilizando una arquitectura de microservicios. Los usuarios pueden navegar por un catálogo de productos, añadirlos a un carrito, realizar pedidos y recibir notificaciones en tiempo real sobre el estado de sus pedidos.

## Arquitectura

El sistema utiliza una arquitectura de microservicios con los siguientes componentes:

![Diagrama de Arquitectura](https://github.com/user-attachments/assets/2991b754-622a-4de3-b654-ec722c9f6c1f)

### Microservicios

- **Servicio de Inventario**: Gestiona los productos disponibles, categorías y stock.
- **Servicio de Pedidos**: Procesa la creación de pedidos y gestiona su ciclo de vida.
- **Servicio de Notificaciones**: Envía notificaciones en tiempo real a los usuarios.
- **Frontend**: Interfaz de usuario desarrollada en React.

### Tecnologías Utilizadas

- **Backend**: Node.js con Express
- **Frontend**: React con Material-UI
- **Bases de Datos**:
  - MongoDB (para inventario y notificaciones)
  - PostgreSQL (para pedidos)
- **Comunicación**: 
  - REST API entre microservicios y frontend
  - Kafka para comunicación asíncrona entre microservicios
  - Socket.io para notificaciones en tiempo real
- **Contenedores**: Docker y Kubernetes (Minikube)

## Estructura del Proyecto

```
stadium-delivery/
│
├── frontend/                    # Aplicación frontend (React)
│   ├── src/
│   │   ├── api/                 # Servicios API
│   │   ├── components/          # Componentes React
│   │   └── pages/               # Páginas principales
│   └── Dockerfile               # Configuración Docker para frontend
│
├── inventory-service/           # Microservicio de inventario
│   ├── controllers/             # Controladores REST
│   ├── models/                  # Modelos de datos
│   ├── routes/                  # Rutas API
│   ├── scripts/                 # Scripts de utilidad (datos de prueba)
│   └── Dockerfile               # Configuración Docker
│
├── order-service/               # Microservicio de pedidos
│   ├── config/                  # Configuración de base de datos
│   ├── controllers/             # Controladores REST
│   ├── models/                  # Modelos de datos
│   ├── routes/                  # Rutas API
│   ├── services/                # Servicios (Kafka)
│   └── Dockerfile               # Configuración Docker
│
├── notification-service/        # Microservicio de notificaciones
│   ├── controllers/             # Controladores REST
│   ├── models/                  # Modelos de datos
│   ├── routes/                  # Rutas API
│   ├── services/                # Servicios (Kafka, Socket.io)
│   └── Dockerfile               # Configuración Docker
│
├── k8s/                         # Configuración de Kubernetes
│   ├── frontend-deployment.yaml # Despliegue del frontend
│   ├── inventory-deployment.yaml# Despliegue del servicio de inventario
│   ├── order-deployment.yaml    # Despliegue del servicio de pedidos
│   ├── notification-deployment.yaml # Despliegue del servicio de notificaciones
│   ├── mongodb-deployment.yaml  # Despliegue de MongoDB
│   ├── postgres-deployment.yaml # Despliegue de PostgreSQL
│   ├── kafka-deployment.yaml    # Despliegue de Kafka
│   └── ingress.yaml             # Configuración del Ingress
│
├── docker-compose.yml           # Configuración de Docker Compose
└── deploy-minikube.sh           # Script para despliegue en Minikube
```

## Flujo de Datos

1. El usuario accede a la aplicación frontend y visualiza los productos disponibles.
2. Al seleccionar productos, el frontend hace peticiones GET al microservicio de inventario.
3. Cuando el usuario realiza un pedido, el frontend hace una petición POST al microservicio de pedidos.
4. El microservicio de pedidos:
   - Valida el pedido y consulta los productos con el microservicio de inventario
   - Actualiza el stock en el microservicio de inventario
   - Guarda el pedido en la base de datos
   - Publica un evento de "pedido creado" en Kafka
5. El microservicio de notificaciones:
   - Consume el evento desde Kafka
   - Crea una notificación en la base de datos
   - Envía una notificación en tiempo real al usuario mediante Socket.io

## Instalación y Ejecución

### Requisitos Previos

- Docker y Docker Compose
- Minikube (opcional, para despliegue en Kubernetes)
- kubectl (opcional, para despliegue en Kubernetes)
- Node.js y npm (para desarrollo local)

### Ejecución con Docker Compose

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/stadium-delivery.git
   cd stadium-delivery
   ```

2. Iniciar los servicios:
   ```bash
   docker-compose up -d
   ```

3. Cargar datos de ejemplo:
   ```bash
   docker-compose exec inventory-service node scripts/seed-data.js
   ```

4. Acceder a la aplicación en http://localhost:3000

### Ejecución con Minikube (Kubernetes)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/stadium-delivery.git
   cd stadium-delivery
   ```

2. Ejecutar el script de despliegue:
   ```bash
   chmod +x deploy-minikube.sh
   ./deploy-minikube.sh
   ```

3. Cargar datos de ejemplo:
   ```bash
   # Obtener el nombre del pod de inventario
   kubectl get pods
   
   # Ejecutar el script de datos
   kubectl exec [NOMBRE-DEL-POD-INVENTARIO] -- node scripts/seed-data.js
   ```

4. Obtener la URL para acceder:
   ```bash
   minikube ip
   ```

5. Acceder a la aplicación usando la IP obtenida

## Pruebas

### Prueba del Flujo Completo

1. Abrir la aplicación en el navegador
2. Explorar los productos disponibles
3. Añadir productos al carrito
4. Ingresar la ubicación de asiento (por ejemplo: "Sección A, Fila 5, Asiento 12")
5. Hacer clic en "Realizar Pedido"
6. Verificar la recepción de la notificación de confirmación

### Verificación de APIs

Puedes verificar directamente las APIs:

```bash
# Listar productos
curl http://localhost:8081/api/products

# Ver pedidos
curl http://localhost:8082/api/orders

# Ver notificaciones
curl http://localhost:8083/api/notifications/user/user123
```

## Desarrollo

### Agregar Nuevos Productos

Puedes modificar el script `inventory-service/scripts/seed-data.js` para añadir nuevos productos.

### Modificar Frontend

El frontend está construido con React y Material-UI. Los principales componentes que podrías querer modificar son:

- `frontend/src/components/products/ProductList.jsx`: Lista de productos
- `frontend/src/components/cart/ShoppingCart.jsx`: Carrito de compras
- `frontend/src/pages/OrderPage.jsx`: Página principal de pedidos

### Extender los Microservicios

Para añadir nuevas funcionalidades a los microservicios, puedes seguir estos pasos:

1. Crear nuevos modelos en el directorio `models/`
2. Añadir nuevos controladores en `controllers/`
3. Registrar las nuevas rutas en `routes/`
4. Actualizar el servicio Kafka si es necesario

## Solución de Problemas

### Logs de Servicios

```bash
# Ver logs de un servicio específico
docker-compose logs frontend
docker-compose logs inventory-service
docker-compose logs order-service
docker-compose logs notification-service

# Ver logs en tiempo real
docker-compose logs -f
```

En Kubernetes:
```bash
kubectl logs -f deployment/frontend
kubectl logs -f deployment/inventory-service
kubectl logs -f deployment/order-service
kubectl logs -f deployment/notification-service
```

### Problemas Comunes

1. **No se muestran productos**: Verificar que se hayan cargado datos de ejemplo con el script seed-data.js.

2. **Error de conexión a Kafka**: Asegurarse de que el servicio de Kafka esté funcionando correctamente.

3. **Notificaciones no funcionan**: Verificar los logs del servicio de notificaciones y asegurarse de que Socket.io esté configurado correctamente.

4. **No se pueden crear pedidos**: Revisar los logs del servicio de pedidos y asegurarse de que puede comunicarse con el servicio de inventario.

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.
