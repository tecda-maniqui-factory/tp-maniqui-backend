import { Router, Request, Response } from 'express';
import { sseManager } from '../services/sse/SSEManager.js';
import { verifyToken, esGerente, esGerenteOOperario } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router: Router = Router();

/**
 * Endpoint SSE. Los clientes (Dashboard/Suministros) se conectan aquí 
 * para escuchar eventos en vivo.
 */
router.get('/stream', verifyToken, (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Registrar cliente en el hub
  sseManager.addClient(res);
});

/**
 * Endpoint para generar una nueva orden de compra desde el Dashboard.
 */
router.post('/ordenes', verifyToken, esGerenteOOperario, asyncHandler(async (req: Request, res: Response) => {
  const { modelo, parte } = req.body;
  const orden = await sseManager.nuevaOrden(modelo, parte);
  
  res.status(201).json({ success: true, orden });
}));

export default router;
