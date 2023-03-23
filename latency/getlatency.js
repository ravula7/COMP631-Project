const url = require('url')
const http = require('http')
const https = require('https')

const nano = 1e9
const mil = 1e6

function request ({req='GET', protocol,hostname,port,path,body}, callback) {
    const times = {
        startAt: process.hrtime(),
        endAt: undefined
    }
    const make_request = (protocol.startsWith('http') ? http : http).request({req,protocol,hostname,port,path,body},
        (response) => {
        //get response and the end time
        let responseBody = ''
        response.once('readable', () => {
            times.firstByteAt = process.hrtime()
        })
        response.on('data', (bytes) => {responseBody += bytes})
        response.on('end', () => {
        times.endAt = process.hrtime()

        //callback now that we have end time and response
        callback(null, {
            timings: getTimings(times),
            body: responseBody
            })
        })
    })
    make_request.end()
}

function getLatency (start, end) {
    const totalnorm = end[0] - start[0]
    const totalnano = end[1] - start[1]
    const nanotime = totalnorm * nano + totalnano
    return nanotime / mil
}

function getTimings (time) {
    return {
        Total_Latency: getLatency(time.startAt, time.endAt)
    }
}

request(Object.assign(url.parse('http://vm1.research.letswhirl.com/'), {
}), (error, response) => {
    console.log(error || response.timings)
})

request(Object.assign(url.parse('http://vm1.research.letswhirl.com/'), {
}), (error, response) => {
    console.log(error || response.body)
})
