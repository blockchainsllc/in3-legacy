import { run_test } from './util/testRunner'


let filter = -1;
const files = []
for (const a of process.argv.slice(2)) {
    if (a == '-t') filter = -2
    else if (filter === -2)
        filter = parseInt(a)
    else if(a.indexOf('.json') != -1)
        files.push(a)
}
//console.log("files:", JSON.stringify(files))
run_test(files, filter).then(() => console.log('done'), console.log)

