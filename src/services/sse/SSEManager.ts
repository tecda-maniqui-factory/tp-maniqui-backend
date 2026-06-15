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
 * Mantiene conexiones vivas para emitir actualizaciones en tiempo real a los clientes conectados.
 */
class SSEManager {
  private clients: Response[] = [];
  private ordenesActivas: OrdenCompra[] = [];

  constructor() {
    this.cargarOrdenesDesdeBD();
  }

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
   * Agrega un nuevo cliente al hub de notificaciones.
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
   * Registra una nueva orden y notifica a todos los clientes.
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
   * Marca una orden como completada (cuando ingresa a stock).
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
   * Notifica a todos los clientes que el stock general ha cambiado (ej. por ensamblaje).
   */
  notificarStockActualizado() {
    this.broadcast('stock_actualizado', { timestamp: Date.now() });
  }

  /**
   * Envía un evento a todos los clientes conectados.
   */
  private broadcast(event: string, data: any) {
    this.clients.forEach(client => this.sendToClient(client, event, data));
  }

  private sendToClient(client: Response, event: string, data: any) {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export const sseManager = new SSEManager();
