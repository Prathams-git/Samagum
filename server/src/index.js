// Samaagum backend server (Fastify, ES modules)
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

// Load configuration from .env file
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const fastify = Fastify({
  logger: true,
});

// Enable CORS for client origin
await fastify.register(cors, {
  origin: CLIENT_ORIGIN,
  credentials: true,
});

// Health check route: GET /health returns {"status":"ok"}
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Also support /api/health for Vite dev proxy convenience
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
