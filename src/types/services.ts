import { ICliente, IUsuario, IManiqui, IVenta } from './entities.js';

/**
 * Interfaz para el servicio de Autenticación y Sesiones.
 * 
 * Define las operaciones requeridas para el registro de nuevos usuarios
 * y el inicio de sesión. Implementado por {@link AuthService}.
 */
export interface IAuthService {
  /**
   * Registra un nuevo usuario en el sistema.
   * 
   * @param userData - Datos del usuario a registrar, incluyendo contraseña.
   * @returns Promesa que resuelve con los datos del usuario creado.
   * @throws {AppError} Si el nombre de usuario ya existe o es omitido.
   */
  register(userData: Partial<IUsuario> & { password?: string }): Promise<Partial<IUsuario>>;

  /**
   * Valida credenciales e inicia sesión de un usuario.
   * 
   * @param username - Nombre de usuario único.
   * @param password - Contraseña en texto plano.
   * @returns Promesa que resuelve con el token JWT de acceso y los detalles básicos del usuario.
   * @throws {AppError} Si las credenciales son incorrectas.
   */
  login(username: string, password: string): Promise<{ token: string; usuario: Partial<IUsuario> & { nombre?: string | undefined } }>;
}

/**
 * Interfaz para el servicio Comercial.
 * 
 * Gestiona el alta y listado de clientes y el registro de ventas.
 * Implementado por {@link ComercialService}.
 */
export interface IComercialService {
  /**
   * Obtiene la lista de clientes registrados aplicando filtros de búsqueda.
   * 
   * @param filters - Filtros opcionales para la consulta (ej. búsqueda por nombre).
   * @returns Promesa que resuelve con el listado de clientes {@link ICliente}.
   */
  listarClientes(filters?: Record<string, unknown>): Promise<ICliente[]>;

  /**
   * Registra un nuevo cliente.
   * 
   * @param data - Datos parciales del cliente a dar de alta.
   * @returns Promesa con el cliente {@link ICliente} registrado.
   * @throws {AppError} Si el cliente ya existe o los datos no superan las validaciones.
   */
  registrarCliente(data: Partial<ICliente>): Promise<ICliente>;

  /**
   * Obtiene la lista de ventas registradas aplicando filtros.
   * 
   * @param filters - Filtros de consulta (ej. fecha, cliente).
   * @returns Promesa con la lista de ventas {@link IVenta}.
   */
  listarVentas(filters?: Record<string, unknown>): Promise<IVenta[]>;

  /**
   * Registra una transacción de venta de maniquíes.
   * 
   * @param data - Datos de la venta, incluyendo el ID de cliente, método de pago y maniquíes a vender.
   * @returns Promesa con la venta {@link IVenta} creada.
   * @throws {AppError} Si el cliente no existe o los maniquíes seleccionados no están disponibles.
   */
  registrarVenta(data: { cliente_id: number; metodo_pago?: string; maniquies: any[]; moneda?: string }): Promise<IVenta>;

  /**
   * Obtiene el detalle completo de una venta por su ID.
   * 
   * @param id - Identificador de la venta.
   * @returns Promesa con el detalle de la venta {@link IVenta}.
   * @throws {AppError} Si la venta no existe.
   */
  obtenerVenta(id: number): Promise<IVenta>;
}

/**
 * Interfaz para el servicio de Producción.
 * 
 * Gestiona el inventario de maniquíes y piezas y coordina el ensamblaje técnico.
 * Implementado por {@link ProduccionService}.
 */
export interface IProduccionService {
  /**
   * Obtiene la lista de maniquíes ensamblados o en producción.
   * 
   * @param filters - Filtros opcionales (ej. modelo, rango de fechas).
   * @returns Promesa con el listado de maniquíes {@link IManiqui}.
   */
  listarManiquies(filters?: Record<string, unknown>): Promise<IManiqui[]>;

  /**
   * Obtiene un maniquí específico por su número de serie.
   * 
   * @param serie - Número de serie único del maniquí.
   * @returns Promesa con el maniquí {@link IManiqui}.
   * @throws {AppError} Si el maniquí no existe.
   */
  obtenerManiqui(serie: string): Promise<IManiqui>;

  /**
   * Ejecuta el proceso de ensamblaje técnico de un maniquí a partir de sus piezas.
   * 
   * @param modelo_id - ID del modelo a ensamblar.
   * @param numero_serie - Serie que se asignará al maniquí.
   * @returns Promesa con el resultado de la operación.
   * @throws {AppError} Si el inventario no cuenta con las piezas necesarias.
   */
  ensamblarManiqui(modelo_id: number, numero_serie: string): Promise<unknown>;

  /**
   * Obtiene la cantidad de piezas individuales en stock clasificados por tipo de parte.
   * 
   * @returns Promesa con el listado y cantidades de piezas.
   */
  obtenerStockPiezas(): Promise<any[]>;

  /**
   * Registra el ingreso de un lote de piezas al almacén.
   * 
   * @param origen_codigo - Código del proveedor de origen.
   * @param tipo_parte_codigo - Tipo de parte física.
   * @param modelo_id - ID de modelo al que pertenecen las piezas.
   * @param cantidad - Cantidad de piezas ingresadas.
   * @param costo - Costo total del lote.
   * @returns Promesa vacía al completar el ingreso.
   * @throws {AppError} Si falla la validación de entidades asociadas.
   */
  ingresarPiezas(origen_codigo: string, tipo_parte_codigo: string, modelo_id: number, cantidad: number, costo: number): Promise<void>;
}

/**
 * Interfaz para el servicio de Sistema.
 * 
 * Provee herramientas operativas como reportes financieros, de producción,
 * catálogo de modelos, cálculo de descuentos y gestión de proveedores.
 * Implementado por {@link SistemaService}.
 */
export interface ISistemaService {
  /**
   * Obtiene la lista de todos los modelos del catálogo técnico.
   * 
   * @returns Promesa con la lista de modelos.
   */
  listarModelos(): Promise<any[]>;

  /**
   * Registra un nuevo modelo técnico en el catálogo.
   * 
   * @param data - Datos del modelo, incluyendo nombre, partes asociadas y costos.
   * @returns Promesa con el modelo creado.
   */
  crearModelo(data: { nombre: string; partes: string[]; sexo_id: number; costo_unitario: number; precio_venta: number }): Promise<any>;

  /**
   * Obtiene métricas resumen del estado de producción.
   * 
   * @returns Promesa con el desglose de métricas de producción.
   */
  obtenerResumenProduccion(): Promise<any[]>;

  /**
   * Obtiene el reporte financiero de rentabilidad de ventas.
   * 
   * @returns Promesa con el detalle financiero.
   */
  obtenerRentabilidad(): Promise<any[]>;

  /**
   * Obtiene la lista de piezas y modelos que se encuentran en stock crítico (bajo mínimo).
   * 
   * @returns Promesa con el listado crítico.
   */
  obtenerStockCritico(): Promise<any[]>;

  /**
   * Calcula el precio de venta final aplicando un descuento mediante una UDF en base de datos.
   * 
   * @param modeloId - ID del modelo técnico.
   * @param porcentaje - Porcentaje de descuento a aplicar.
   * @returns Promesa con el resultado de la función.
   * @throws {Error} Si el ID de modelo o el porcentaje no son válidos.
   */
  calcularDescuento(modeloId: number, porcentaje: number): Promise<unknown>;

  /**
   * Obtiene la lista de todos los proveedores registrados.
   * 
   * @returns Promesa con la lista de proveedores.
   */
  listarProveedores(): Promise<any[]>;

  /**
   * Crea un nuevo proveedor en el sistema.
   * 
   * @param nombre - Nombre del proveedor.
   * @param codigo - Código único identificador del proveedor.
   * @returns Promesa vacía al registrarse exitosamente.
   * @throws {AppError} Si el código de proveedor ya está registrado.
   */
  crearProveedor(nombre: string, codigo: string): Promise<void>;
}
