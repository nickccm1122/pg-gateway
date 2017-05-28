import debug from 'debug'

/**
 * Logger function with namespace 'pg-gateway'
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export default function logger(params) {
  return debug('pg-gateway')(params)
}