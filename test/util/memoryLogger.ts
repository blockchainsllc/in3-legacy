

const messages: { level: string, message: string, data?: any[] }[] = []

export function getLogsAndClear() {
  const copy = [...messages]
  messages.length = 0
  return copy
}
export function log(level: string, message: string, ...data: any[]) {
  messages.push({ level, message, data })
}

export function info(message: string, ...data: any[]) {
  log('info', message, ...data)
}
export function debug(message: string, ...data: any[]) {
  log('debug', message, ...data)
}

export function error(message: string, ...data: any[]) {
  log('error', message, ...data)
}


