declare global {
	export namespace NodeJS {
		export interface ProcessEnv {
			readonly PORT: string;
			// readonly NODE_ENV: string;
			readonly CORS_ORIGIN: string;

			/**
			 * ### CORS ORIGINS
			 */
			readonly CORS_ORIGINS?: Array<string>;
			/**
			 * ### APP URL
			 */
			readonly APP_URI?: string;
			/**
			 * ### APP PORT
			 */
			readonly APP_PORT?: number;
			/**
			 * ### APP ENV
			 */
			readonly APP_ENV?: 'dev' | 'development' | 'prod' | 'production' | 'test' | 'stage';
			/**
			 * ### APP PREFIX PATH
			 */
			readonly APP_PREFIX_PATH?: string;
			/**
			 * ### NODE ENV
			 */
			readonly NODE_ENV?: 'dev' | 'development' | 'prod' | 'production' | 'test' | 'stage';
			/**
			 * ### NODE MODULES CACHE
			 */
			readonly NODE_MODULES_CACHE?: boolean;
			/**
			 * ### JWT SECRET
			 */
			readonly JWT_SECRET?: string;
			/**
			 * ### JWT EXPIRE
			 */
			readonly JWT_EXPIRE?: string;
			/**
			 * ### UPLOAD DIR
			 */
			readonly UPLOAD_DIR?: string;
			/**
			 * ### UPLOAD MAN DIR
			 */
			readonly UPLOAD_MAN_DIR?: string;
			/**
			 * ### FILE MAX SIZE
			 */
			readonly FILE_MAX_SIZE?: number;
			/**
			 * ### FILE PATH
			 */
			readonly FILE_PATH?: string;
			/**
			 * ### FILE PATH SLUG
			 */
			readonly FILE_PATH_SLUG?: string;
			/**
			 * ### FILE CACHE TIME
			 */
			readonly FILE_CACHE_TIME?: number;
			/**
			 * ### IMAGE PATH SLUG
			 */
			readonly IMAGE_PATH_SLUG?: string;
			/**
			 * ### ASSETS PATH
			 */
			readonly ASSETS_PATH?: string;
			/**
			 * ### ASSETS PATH SLUG
			 */
			readonly ASSETS_PATH_SLUG?: string;
			/**
			 * ### DB_URI
			 */
			readonly DB_URI?: string;
			/**
			 * ### DB USER
			 */
			readonly DB_USER?: string;
			/**
			 * ### DB USER PWD
			 */
			readonly DB_USER_PWD?: string;
			/**
			 * ### DB HOST
			 */
			readonly DB_HOST?: string;
			/**
			 * ### DB NAME
			 */
			readonly DB_NAME?: string;
			/**
			 * ### DB PORT
			 */
			readonly DB_PORT?: number;
			/**
			 * ### NM AUTH EMAIL
			 */
			readonly NM_AUTH_EMAIL?: string;
			/**
			 * ### NM AUTH PASS
			 */
			readonly NM_AUTH_PASS?: string;
			/**
			 * ### DEBUG
			 */
			readonly DEBUG?: boolean;
		}
	}
}

export { };
