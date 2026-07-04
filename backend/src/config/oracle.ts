import '../utilPolyfill'
import oracledb from 'oracledb'

let pool: oracledb.Pool | null = null

const requiredEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} not set in environment`)
  }
  return value
}

export const initOraclePool = async () => {
  if (pool) return pool

  if (process.env.ORACLE_CLIENT_LIB_DIR) {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR })
  }

  pool = await oracledb.createPool({
    user: requiredEnv('ORACLE_USER'),
    password: requiredEnv('ORACLE_PASSWORD'),
    connectString: requiredEnv('ORACLE_CONNECT_STRING'),
    poolMin: 2,
    poolMax: 12,
    poolIncrement: 2,
    poolTimeout: 60,
    queueTimeout: 120000
  })

  await withOracleConnection((connection) => connection.execute('SELECT 1 FROM DUAL'))

  console.log('Connected to Oracle')
  return pool
}

export const withOracleConnection = async <T>(
  action: (connection: oracledb.Connection) => Promise<T>
): Promise<T> => {
  if (!pool) {
    throw new Error('Oracle pool is not initialized')
  }

  const connection = await pool.getConnection()
  try {
    return await action(connection)
  } finally {
    try {
      await connection.close()
    } catch (closeError) {
      console.error('Failed to release Oracle connection', closeError)
    }
  }
}

export const executeQuery = (
  sql: string,
  binds: oracledb.BindParameters = {},
  options: oracledb.ExecuteOptions = {}
) =>
  withOracleConnection((connection) =>
    connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    })
  )

export const closeOraclePool = async () => {
  if (pool) {
    await pool.close(0)
    pool = null
  }
}

export default initOraclePool
