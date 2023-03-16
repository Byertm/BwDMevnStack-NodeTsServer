import { type Express, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from '@/utils/swaggerDocument.json';
import { version } from '@@/package.json';
import logger from '@/config/logger';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'REST API Docs',
			version
		},
		components: {
			securitySchemas: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		},
		security: [{ bearerAuth: [] }]
	},
	apis: ['./src/routes/*.ts', './src/models/*.ts']
	// apis: ['./src/routes.ts', './src/schema/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

const getSwaggerJsonFile = async (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
};

function swaggerDocs(app: Express, port: number) {
	// Swagger page
	// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// // Docs in JSON format
	// app.get('/docs.json', getSwaggerJsonFile);

	// logger.info(`Docs available at http://localhost:${port}/docs`);

	// * Swagger Options Changed

	// Swagger page
	app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	// Docs in JSON format
	app.get('/swagger.json', getSwaggerJsonFile);

	logger.info(`Docs available at http://localhost:${port}/swagger`);
}

export default swaggerDocs;