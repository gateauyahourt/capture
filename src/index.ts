import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

// Create Fastify server with TypeBox for type validation
const server: FastifyInstance = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Define the response schema for the lambda execution
const LambdaResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  lambda: Type.String(),
  timestamp: Type.String(),
});

// Define the request body schema for POST requests
const LambdaRequestSchema = Type.Object({
  payload: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

// Register the GET route for running lambdas
server.get(
  '/run/:lambda_name',
  {
    schema: {
      params: Type.Object({
        lambda_name: Type.String(),
      }),
      response: {
        200: LambdaResponseSchema,
      },
    },
  },
  async (request, reply) => {
    const { lambda_name } = request.params as { lambda_name: string };
    
    // In the future, this is where you would actually execute the lambda
    // For now, just return confirmation that the lambda was called
    
    return {
      success: true,
      message: `Lambda "${lambda_name}" was called successfully (GET)`,
      lambda: lambda_name,
      timestamp: new Date().toISOString(),
    };
  }
);

// Register the POST route for running lambdas with data
server.post(
  '/run/:lambda_name',
  {
    schema: {
      params: Type.Object({
        lambda_name: Type.String(),
      }),
      body: LambdaRequestSchema,
      response: {
        200: LambdaResponseSchema,
      },
    },
  },
  async (request, reply) => {
    const { lambda_name } = request.params as { lambda_name: string };
    const { payload } = request.body as { payload?: Record<string, unknown> };
    
    // In the future, this is where you would actually execute the lambda with the payload
    // For now, just return confirmation that the lambda was called with the payload
    
    return {
      success: true,
      message: `Lambda "${lambda_name}" was called successfully (POST)`,
      lambda: lambda_name,
      timestamp: new Date().toISOString(),
    };
  }
);

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
