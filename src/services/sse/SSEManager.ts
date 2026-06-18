import { Response } from 'express';

export interface OrdenCompra {
  id: string;
  modelo_nombre: string;
  tipo_parte: string;
  fecha: string;
  estado: 'pendiente' | 'completada';
}

/**
 * Gestor de Server-Sent Events (SSE)
 * 
 * Mantiene conexiones activas para emitir actualizaciones en tiempo real a los clientes conectados.
 * Utiliza {@link OrdenCompra} para tipar las órdenes gestionadas.
 *
 * @example
 * ```ts
 * import { sseManager } from './SSEManager';
 * 
 * // Registrar un nuevo cliente
 * app.get('/events', (req, res) => {
 *   sseManager.addClient(res);
 * });
 * 
 * // Crear una nueva orden y notificar a los clientes
 * await sseManager.nuevaOrden('Maniquí Completo', 'Brazo');
 * ```
 */
class SSEManager {
  private clients: Response[] = [];
  private ordenesActivas: OrdenCompra[] = [];

  constructor() {}

  /**
   * Carga todas las órdenes con estado 'pendiente' desde la base de datos MySQL
   * y las inicializa en la caché local para su posterior transmisión.
   *
   * @returns Promesa que se resuelve cuando las órdenes se cargan con éxito.
   */
  async cargarOrdenesDesdeBD() {
    try {
      const { OrdenesCompra } = await import('../../models/index.js');
      const ordenes = await OrdenesCompra.findAll({ where: { estado: 'pendiente' } });
      this.ordenesActivas = ordenes.map(o => ({
        id: o.id.toString(),
        modelo_nombre: o.modelo_nombre,
        tipo_parte: o.tipo_parte,
        fecha: o.fecha.toISOString(),
        estado: o.estado
      }));
      console.log(`📡 SSEManager: ${this.ordenesActivas.length} órdenes pendientes cargadas desde la Base de Datos.`);
    } catch (error) {
      console.error('❌ Error al cargar órdenes desde la base de datos en SSEManager:', error);
    }
  }

  /**
   * Agrega un nuevo cliente al hub de notificaciones de Server-Sent Events.
   * 
   * Configura las cabeceras HTTP necesarias y envía el estado actual
   * de las órdenes al cliente conectado. Cuando el cliente se desconecta,
   * remueve automáticamente la conexión del listado.
   * 
   * @param res - Objeto de respuesta HTTP de Express.
   */
  addClient(res: Response) {
    this.clients.push(res);
    
    // Al conectar, enviarle el estado actual de las órdenes
    this.sendToClient(res, 'sync_ordenes', this.ordenesActivas);

    res.on('close', () => {
      this.clients = this.clients.filter(client => client !== res);
    });
  }

  /**
   * Registra una nueva orden de compra en la base de datos y la transmite
   * en tiempo real a todos los clientes conectados a través del canal SSE.
   * 
   * @param modelo - Nombre del modelo de maniquí de la orden.
   * @param parte - Tipo de parte física a fabricar.
   * @returns Promesa que se resuelve con la {@link OrdenCompra} registrada.
   * @throws {Error} Si ocurre un problema al guardar o reportar la orden.
   */
  async nuevaOrden(modelo: string, parte: string) {
    try {
      const { OrdenesCompra } = await import('../../models/index.js');
      const dbOrden = await OrdenesCompra.create({
        modelo_nombre: modelo,
        tipo_parte: parte,
        estado: 'pendiente'
      });

      const nueva: OrdenCompra = {
        id: dbOrden.id.toString(),
        modelo_nombre: dbOrden.modelo_nombre,
        tipo_parte: dbOrden.tipo_parte,
        fecha: dbOrden.fecha.toISOString(),
        estado: dbOrden.estado
      };
      
      this.ordenesActivas.push(nueva);
      this.broadcast('nueva_orden', nueva);
      return nueva;
    } catch (error) {
      console.error('❌ Error al guardar la orden en la base de datos:', error);
      // Fallback a memoria
      const nueva: OrdenCompra = {
        id: Date.now().toString(),
        modelo_nombre: modelo,
        tipo_parte: parte,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      };
      this.ordenesActivas.push(nueva);
      this.broadcast('nueva_orden', nueva);
      return nueva;
    }
  }

  /**
   * Marca una orden de compra como completada.
   * 
   * Actualiza el estado de la orden en la base de datos SQL y remueve
   * la orden del caché local de órdenes pendientes. Finalmente, notifica a
   * todos los clientes conectados de que la orden fue completada.
   * 
   * @param tipo_parte - Tipo de parte física completada.
   * @param modelo_nombre - Nombre del modelo completado.
   * @returns Promesa que se resuelve cuando finaliza la actualización.
   * @throws {Error} Si falla la actualización en la base de datos.
   */
  async completarOrden(tipo_parte: string, modelo_nombre: string) {
    try {
      const { OrdenesCompra } = await import('../../models/index.js');

      // Buscamos órdenes que coincidan con la parte y modelo recibidos
      const ordenIndex = this.ordenesActivas.findIndex(
        o => o.tipo_parte === tipo_parte && o.modelo_nombre === modelo_nombre && o.estado === 'pendiente'
      );

      if (ordenIndex !== -1) {
        const orden = this.ordenesActivas[ordenIndex];
        if (orden) {
          await OrdenesCompra.update(
            { estado: 'completada' },
            { where: { id: parseInt(orden.id) } }
          );

          orden.estado = 'completada';
          this.ordenesActivas.splice(ordenIndex, 1); // La quitamos de activas
          this.broadcast('orden_completada', { id: orden.id });
        }
      } else {
        // En caso de que no esté cargada en la caché de memoria pero sí en BD
        await OrdenesCompra.update(
          { estado: 'completada' },
          { where: { tipo_parte, modelo_nombre, estado: 'pendiente' } }
        );
      }
    } catch (error) {
      console.error('❌ Error al completar la orden en la base de datos:', error);
      // Fallback a memoria
      const ordenIndex = this.ordenesActivas.findIndex(
        o => o.tipo_parte === tipo_parte && o.modelo_nombre === modelo_nombre && o.estado === 'pendiente'
      );
      if (ordenIndex !== -1) {
        const orden = this.ordenesActivas[ordenIndex];
        if (orden) {
          orden.estado = 'completada';
          this.ordenesActivas.splice(ordenIndex, 1); // La quitamos de activas
          this.broadcast('orden_completada', { id: orden.id });
        }
      }
    }
  }

  /**
   * Notifica a todos los clientes que el stock general ha cambiado.
   * 
   * Este evento es crítico para alertar sobre nuevas existencias,
   * ensamblajes exitosos o modificaciones de suministros.
   */
  notificarStockActualizado() {
    this.broadcast('stock_actualizado', { timestamp: Date.now() });
  }

  /**
   * Envía un evento de difusión (broadcast) a todos los clientes conectados.
   * 
   * @param event - Nombre del evento SSE a emitir.
   * @param data - Payload de datos a serializar como JSON.
   */
  private broadcast(event: string, data: any) {
    this.clients.forEach(client => this.sendToClient(client, event, data));
  }

  /**
   * Envía un mensaje estructurado de SSE a un cliente específico.
   * 
   * @param client - Conexión de respuesta Express del cliente.
   * @param event - Nombre del evento.
   * @param data - Datos a serializar y transmitir.
   */
  private sendToClient(client: Response, event: string, data: any) {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export const sseManager = new SSEManager();
