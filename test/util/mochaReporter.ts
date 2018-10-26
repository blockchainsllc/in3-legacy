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


import * as mocha from 'mocha'
// tslint:disable-next-line:no-submodule-imports
import * as mu from 'mocha/lib/utils'
import * as fs from 'fs'
import { getLogsAndClear } from './memoryLogger'
function color(colorName, content) {
  return `<span style="color:${colorName}">${content}</span>`
}

/**
 * 
 * reporter writing html including logs
 * 
 * @export
 * @class USNReporter
 */
class TestReporter extends mocha.reporters.Spec {
  private run: mocha.IRunner
  private root = 'test/report/'
  private lastStart: number
  private results: {
    title: string, tests: {
      time: number
      title: string
      status: 'pass' | 'fail' | 'pending'
      details: string
      error: string
    }[]
  }[] = []

  constructor(runner) {
    super(runner)

    runner.on('pass', (test: mocha.ITest) => this.reportTest(test, null, false))
    runner.on('fail', (test: mocha.ITest, error) => this.reportTest(test, error, false))
    runner.on('pending', (test: mocha.ITest) => this.reportTest(test, null, true))
    runner.on('end', () => this.createIndex())
    runner.on('test', () => this.lastStart = Date.now())

    if (!fs.existsSync(this.root)) fs.mkdirSync(this.root)

  }

  writeHtml(fileName, title, body) {
    fs.writeFileSync(
      this.root + fileName,
      '<html><head><style>' +
      'body, td { background-color: black; color:white; font-family: sans-serif; vertical-align:top; padding-right:10px;padding-bottom:10px  }'
      + '</style><title>' + title + '</title></head><body>' + body + '</body></html>',
      'utf-8')
  }

  createIndex() {
    this.writeHtml(
      'index.html',
      'Test Result',
      '<h2>Test Results</h2>'
      + '<div style="padding-bottom:10px"><a style="color:yellow" href="coverage/index.html">Code Coverage</a></div>'
      + '<table border=0 cellspacing=0 cellpadding=0>'
      + this.results.map(r =>
        '<tr><td colspan=2>' + r.title + '</td></tr>' + r.tests.map(t =>
          `<tr><td>&nbsp;&nbsp;- </td><td><a style='color:${t.status === 'pass' ? 'green' : (t.status === 'fail' ? 'red' : 'white')}' href="${t.details}">${t.title}</a></td><td style='text-align:end'>${t.time} ms</td><td>${t.error || ''}</td></tr>`
        ).join('')
      ).join('')
      + '</table>'
    )
  }

  createError(test) {
    if (!test.err) return { message: '', stack: '' }
    let message = test.err.toString()
    let stackString: string

    // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
    // check for the result of the stringifying.
    if (message === '[object Error]')
      message = test.err.message

    if (test.err.stack) {
      const indexOfMessage = test.err.stack.indexOf(test.err.message)
      stackString = (indexOfMessage === -1)
        ? test.err.stack
        : test.err.stack.substr(test.err.message.length + indexOfMessage)
    } else if (test.err.sourceURL && test.err.line !== undefined) {
      // Safari doesn't give you a stack. Let's at least provide a source line.
      stackString = '\n(' + test.err.sourceURL + ':' + test.err.line + ')'
    }

    stackString = stackString || ''

    return { message, stack: stackString, err: test.err }

  }

  reportTest(test: mocha.ITest, error: any, pending: boolean) {
    const err = this.createError(test)
    const logs = getLogsAndClear()
    const title = test.fullTitle()
    const simpleTitle = test.title
    const parentTitle = test.parent.title
    const now = Date.now()
    const fName = title.replace(/\W/g, '_') + '.html'
    const eq = (error && error.expected !== undefined && '<span style="font-family:monospace; color:green">' + mu.stringify(error.expected)
      + '</span> != <br/><span style="font-family:monospace; color:red">' + mu.stringify(error.actual) + '</span>') || ''
    let suite = this.results.find(_ => _.title === parentTitle)
    if (!suite) this.results.push(suite = { title: parentTitle, tests: [] })
    this.createIndex()
    const res = {
      title: simpleTitle,
      status: pending ? 'pending' : (error ? 'fail' : 'pass'),
      time: now - this.lastStart,
      error: error && err.message + '<br/>' + eq + ' <pre style="color:grey">npm test -- --grep \"' + simpleTitle + '\" </pre>',
      details: fName
    }
    suite.tests.push(res as any)
    setTimeout(
      () => {
        const log = toHTML(logs)

        this.writeHtml(fName, simpleTitle, '<h2>' + parentTitle + ' / ' + simpleTitle + '</h2>'
          + ' <ul><li>Time : ' + res.time + '</li>'
          + '<li>Result: ' + (pending ? color('gray', 'skipped') : (error ? color('red', 'failed') : color('green', 'passed'))) + '</li>'
          + (error ? '<li>Error: ' + err.message + '<br>' + eq + getFileContent(err.stack) + ' <pre>' + err.stack + '</pre></li>' : '')
          + '</ul>'
          + '<h3>Log:</h3>' + log
        )

      },
      0)

  }

}


function toHTML(logs: { level: string, message: string, data?: any[] }[]) {
  return '<div style="font-family: monospace;white-space:pre">' + logs.map((log, i) => {
    let l = '<div style="color:'
    if (log.level === 'info') l += 'white'
    if (log.level === 'error') l += 'red'
    if (log.level === 'tx') l += 'green'
    if (log.level === 'debug') l += 'gray'
    l += '">' + (i + 1) + ' | ' + log.level.toUpperCase() + '  ' + log.message
    if (log.data) {
      l += log.data.map(d => '<div style="padding-left:30px;color:gray">' + JSON.stringify(d, null, 2) + '</div>').join('')
    }
    return l + '</div>'
  }).join('') + '</div>'
}

function getFileContent(stack) {
  const reg = /at.*?\((js\/test\/.*?\.js):(\d+)/
  const found = stack.match(reg)
  if (!found) return ''

  const file = found[1]
  const line = parseInt(found[2])

  let r = '<pre style="color:grey">'
  const content = fs.readFileSync(file, 'utf-8').split('\n')
  for (let i = Math.max(0, line - 4); i < Math.min(content.length - 1, line + 3); i++)
    r += '' + (i + 1) + ' <span ' + (i === line - 1 ? ' style="color:red"' : '') + '>' + content[i] + '</span>\n'
  return r + '</pre>'

}
module.exports = TestReporter