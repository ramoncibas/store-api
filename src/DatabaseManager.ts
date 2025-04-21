import sqlite3, { Database, RunResult } from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { DatabaseError } from "builders/errors";

/**
 * Configuração para conexão com o banco de dados
 */
interface DatabaseConfig {
  url: string;
  readonly?: boolean;
  timeout?: number;
  maxRetries?: number;
  poolSize?: number;
}

/**
 * Interface para transações
 */
interface Transaction {
  id: string;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Configuração para queries
 */
interface QueryOptions {
  timeout?: number;
  readonly?: boolean;
  maxRetries?: number;
}

/**
 * Gerenciador de banco de dados aprimorado com recursos de segurança,
 * monitoramento, pool de conexões e resiliência.
 */
class DatabaseManager {
  private static connectionPool: Map<string, Database> = new Map();
  private static poolSize: number = 10;
  private static metrics: {
    queries: number;
    errors: number;
    transactions: number;
    transactionErrors: number;
    queryTimes: number[];
  } = {
    queries: 0,
    errors: 0,
    transactions: 0,
    transactionErrors: 0,
    queryTimes: [],
  };

  protected db: Database;
  protected databaseUrl: string;
  protected connectionId: string;
  protected isTransaction: boolean = false;
  protected transactionId: string | null = null;
  protected queryTimeout: number = 30000; // 30 segundos
  protected maxRetries: number = 3;
  protected readonly: boolean = false;
  protected logger: any;

  /**
   * Cria uma nova instância do gerenciador de banco de dados
   * @param config Configuração opcional para a conexão
   */
  constructor(config?: DatabaseConfig) {
    this.databaseUrl = config?.url || process.env.DATABASE_URL!;
    this.queryTimeout = config?.timeout || parseInt(process.env.DB_TIMEOUT || "30000");
    this.maxRetries = config?.maxRetries || parseInt(process.env.DB_MAX_RETRIES || "3");
    this.readonly = config?.readonly || false;
    
    if (config?.poolSize) {
      DatabaseManager.poolSize = config.poolSize;
    }
    
    this.connectionId = uuidv4();
    this.db = this.getConnection();
    
    // Configurar logger (mock para exemplo)
    this.logger = {
      info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ""),
      error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || ""),
      warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ""),
      debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta || "")
    };
  }

  /**
   * Obtém uma conexão do pool ou cria uma nova se necessário
   */
  private getConnection(): Database {
    // Verifica se já existe uma conexão disponível no pool
    if (DatabaseManager.connectionPool.size < DatabaseManager.poolSize) {
      for (const [id, connection] of DatabaseManager.connectionPool.entries()) {
        // Usar apenas conexões que não estão em transações ativas
        if (!connection.inTransaction) {
          this.connectionId = id;
          return connection;
        }
      }
    }

    // Criar nova conexão
    const db = this.connect();
    DatabaseManager.connectionPool.set(this.connectionId, db);
    
    this.logger.info(`New database connection created: ${this.connectionId}`);
    
    // Limitar tamanho do pool
    if (DatabaseManager.connectionPool.size > DatabaseManager.poolSize) {
      const oldestConnection = DatabaseManager.connectionPool.keys().next().value;
      const conn = DatabaseManager.connectionPool.get(oldestConnection);
      
      if (conn && !conn.inTransaction) {
        conn.close();
        DatabaseManager.connectionPool.delete(oldestConnection);
        this.logger.debug(`Closed old connection: ${oldestConnection}`);
      }
    }
    
    return db;
  }

  /**
   * Cria uma nova conexão com o banco de dados
   */
  private connect(): Database {
    const connectionMode = this.readonly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
    
    this.logger.debug(`Connecting to database: ${this.databaseUrl}`);
    const dbConnection = new sqlite3.Database(this.databaseUrl, connectionMode, (err) => {
      if (err) {
        this.logger.error('Error connecting to database:', err);
        throw DatabaseError.connectionFailed(err);
      } else {
        this.logger.debug(`Connected to database: ${this.databaseUrl}`);
      }
    });

    // Configurar pragmas importantes para SQLite
    dbConnection.run("PRAGMA foreign_keys = ON");
    dbConnection.run("PRAGMA journal_mode = WAL");  // Write-Ahead Logging para melhor concorrência
    dbConnection.run("PRAGMA busy_timeout = 5000");  // Tempo de espera para tabelas bloqueadas
    
    // Monitoramento da conexão
    dbConnection.on('trace', (sql: string) => {
      this.logger.debug(`SQL Query: ${sql.substring(0, 200)}${sql.length > 200 ? '...' : ''}`);
    });

    return dbConnection;
  }

  /**
   * Fecha a conexão e a remove do pool
   */
  public async close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      
      this.db.close((err) => {
        if (err) {
          this.logger.error('Error closing database connection:', err);
          reject(DatabaseError.connectionCloseFailed(err));
        } else {
          this.logger.debug(`Database connection closed: ${this.connectionId}`);
          
          // Remover do pool
          DatabaseManager.connectionPool.delete(this.connectionId);
          
          resolve();
        }
      });
    });
  }

  /**
   * Inicia uma nova transação e retorna um objeto de transação
   */
  public async beginTransaction(): Promise<Transaction> {
    if (this.isTransaction) {
      throw DatabaseError.alreadyInTransaction();
    }
    
    this.transactionId = uuidv4();
    this.isTransaction = true;
    DatabaseManager.metrics.transactions++;
    
    this.logger.debug(`Starting transaction: ${this.transactionId}`);
    
    try {
      await this.executeWithTimeout(
        new Promise<void>((resolve, reject) => {
          this.db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }), 
        this.queryTimeout
      );
      
      // Retorna um objeto de transação com métodos commit e rollback
      return {
        id: this.transactionId,
        commit: async () => this.commit(),
        rollback: async () => this.rollback()
      };
    } catch (error) {
      this.isTransaction = false;
      this.transactionId = null;
      DatabaseManager.metrics.transactionErrors++;
      throw DatabaseError.transactionStartFailed(error);
    }
  }

  /**
   * Finaliza uma transação com commit
   */
  public async commit(): Promise<void> {
    if (!this.isTransaction) {
      throw DatabaseError.noActiveTransaction();
    }
    
    this.logger.debug(`Committing transaction: ${this.transactionId}`);
    
    try {
      await this.executeWithTimeout(
        new Promise<void>((resolve, reject) => {
          this.db.run('COMMIT', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }),
        this.queryTimeout
      );
      
      this.isTransaction = false;
      this.transactionId = null;
    } catch (error) {
      DatabaseManager.metrics.transactionErrors++;
      throw DatabaseError.commitFailed(error);
    }
  }

  /**
   * Cancela uma transação com rollback
   */
  public async rollback(): Promise<void> {
    if (!this.isTransaction) {
      this.logger.warn("Attempting to rollback when no transaction is active");
      return;
    }
    
    this.logger.debug(`Rolling back transaction: ${this.transactionId}`);
    
    try {
      await this.executeWithTimeout(
        new Promise<void>((resolve, reject) => {
          this.db.run('ROLLBACK', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }),
        this.queryTimeout
      );
    } catch (error) {
      this.logger.error(`Failed to rollback transaction: ${this.transactionId}`, error);
      // Mesmo com erro, resetamos o estado da transação
    } finally {
      this.isTransaction = false;
      this.transactionId = null;
    }
  }

  /**
   * Executa uma consulta SQL com mecanismo de retry e timeout
   */
  public async run(
    sql: string, 
    params: string | number | Array<number | string> = [], 
    options?: QueryOptions
  ): Promise<RunResult> {
    const data = Array.isArray(params) ? params : [params];
    const timeout = options?.timeout || this.queryTimeout;
    const maxRetries = options?.maxRetries || this.maxRetries;
    
    return this.executeWithRetry(async () => {
      DatabaseManager.metrics.queries++;
      const startTime = Date.now();
      
      try {
        const result = await this.executeWithTimeout(
          new Promise<RunResult>((resolve, reject) => {
            this.db.run(sql, data, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve(this);
              }
            });
          }),
          timeout
        );
        
        const queryTime = Date.now() - startTime;
        DatabaseManager.metrics.queryTimes.push(queryTime);
        this.logger.debug(`Query executed in ${queryTime}ms`);
        
        return result;
      } catch (error) {
        DatabaseManager.metrics.errors++;
        throw error;
      }
    }, maxRetries);
  }

  /**
   * Busca um único registro com mecanismo de retry e timeout
   */
  public async get(
    sql: string, 
    params: string | number | Array<number | string> = [], 
    options?: QueryOptions
  ): Promise<any> {
    const data = Array.isArray(params) ? params : [params];
    const timeout = options?.timeout || this.queryTimeout;
    const maxRetries = options?.maxRetries || this.maxRetries;
    
    return this.executeWithRetry(async () => {
      DatabaseManager.metrics.queries++;
      const startTime = Date.now();
      
      try {
        const result = await this.executeWithTimeout(
          new Promise<any>((resolve, reject) => {
            this.db.get(sql, data, function (err, row) {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          }),
          timeout
        );
        
        const queryTime = Date.now() - startTime;
        DatabaseManager.metrics.queryTimes.push(queryTime);
        this.logger.debug(`Query executed in ${queryTime}ms`);
        
        return result;
      } catch (error) {
        DatabaseManager.metrics.errors++;
        throw error;
      }
    }, maxRetries);
  }

  /**
   * Busca múltiplos registros com mecanismo de retry e timeout
   */
  public async all(
    sql: string, 
    params: string | number | Array<number | string> = [], 
    options?: QueryOptions
  ): Promise<any[]> {
    const data = Array.isArray(params) ? params : [params];
    const timeout = options?.timeout || this.queryTimeout;
    const maxRetries = options?.maxRetries || this.maxRetries;
    
    return this.executeWithRetry(async () => {
      DatabaseManager.metrics.queries++;
      const startTime = Date.now();
      
      try {
        const result = await this.executeWithTimeout(
          new Promise<any[]>((resolve, reject) => {
            this.db.all(sql, data, function (err, rows) {
              if (err) {
                reject(err);
              } else {
                resolve(rows || []);
              }
            });
          }),
          timeout
        );
        
        const queryTime = Date.now() - startTime;
        DatabaseManager.metrics.queryTimes.push(queryTime);
        this.logger.debug(`Query executed in ${queryTime}ms`);
        
        return result;
      } catch (error) {
        DatabaseManager.metrics.errors++;
        throw error;
      }
    }, maxRetries);
  }

  /**
   * Executa uma função dentro de uma transação
   */
  public async transaction<T>(
    callback: (dbManager: DatabaseManager) => Promise<T>
  ): Promise<T> {
    // Criar uma instância de DB para esta transação específica
    const dbManager = new DatabaseManager({
      url: this.databaseUrl,
      timeout: this.queryTimeout,
      maxRetries: this.maxRetries
    });
    
    try {
      // Iniciar transação
      const transaction = await dbManager.beginTransaction();
      this.logger.info(`Transaction started: ${transaction.id}`);
      
      // Executar o callback
      const result = await callback(dbManager);
      
      // Commit da transação
      await transaction.commit();
      this.logger.info(`Transaction committed: ${transaction.id}`);
      
      return result;
    } catch (error) {
      // Rollback em caso de erro
      await dbManager.rollback().catch(rollbackErr => {
        this.logger.error("Error during rollback:", rollbackErr);
      });
      
      this.logger.error("Transaction failed:", error);
      throw DatabaseError.transactionFailed(error);
    } finally {
      // Fechar conexão
      await dbManager.close().catch(closeErr => {
        this.logger.error("Error closing connection:", closeErr);
      });
    }
  }

  /**
   * Executa uma operação com mecanismo de timeout
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(DatabaseError.queryTimeout(`Query exceeded timeout of ${timeoutMs}ms`));
      }, timeoutMs);
      
      promise
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Executa uma operação com mecanismo de retry
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>, 
    maxRetries: number
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Se estiver em uma transação, não tentamos novamente
        if (this.isTransaction) {
          throw error;
        }
        
        // Alguns erros não vale a pena tentar novamente
        if (error.code === 'SQLITE_CONSTRAINT' || error.code === 'SQLITE_SYNTAX') {
          throw error;
        }
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 100; // Backoff exponencial
          this.logger.warn(`Retrying database operation, attempt ${attempt}/${maxRetries} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Utilitário para sleep
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retorna estatísticas e métricas do banco de dados
   */
  public static getMetrics() {
    const avgQueryTime = DatabaseManager.metrics.queryTimes.length > 0 
      ? DatabaseManager.metrics.queryTimes.reduce((a, b) => a + b, 0) / DatabaseManager.metrics.queryTimes.length 
      : 0;
      
    return {
      ...DatabaseManager.metrics,
      activeConnections: DatabaseManager.connectionPool.size,
      avgQueryTime: Math.round(avgQueryTime),
      timestamp: new Date()
    };
  }

  /**
   * Limpa o pool de conexões (útil em testes ou quando a aplicação é encerrada)
   */
  public static async closeAll(): Promise<void> {
    const closePromises: Promise<void>[] = [];
    
    for (const [id, connection] of DatabaseManager.connectionPool.entries()) {
      closePromises.push(
        new Promise<void>((resolve, reject) => {
          connection.close((err) => {
            if (err) {
              console.error(`Error closing connection ${id}:`, err);
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    }
    
    DatabaseManager.connectionPool.clear();
    await Promise.allSettled(closePromises);
  }
}

export default DatabaseManager;