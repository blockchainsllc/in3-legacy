/***********************************************************
* This file is part of the Slock.it IoT Layer.             *
* The Slock.it IoT Layer contains:                         *
*   - USN (Universal Sharing Network)                      *
*   - INCUBED (Trustless INcentivized remote Node Network) *
************************************************************
* Copyright (C) 2016 - 2018 Slock.it GmbH                  *
* All Rights Reserved.                                     *
************************************************************
* You may use, distribute and modify this code under the   *
* terms of the license contract you have concluded with    *
* Slock.it GmbH.                                           *
* For information about liability, maintenance etc. also   *
* refer to the contract concluded with Slock.it GmbH.      *
************************************************************
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/

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


