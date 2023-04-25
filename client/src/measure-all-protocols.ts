import { getData } from "./getData"
import * as firebaseAdmin from 'firebase-admin'
import key from "../keys/admin.json"

const http1URLs = [
    "https://vm1.research.letswhirl.com:444",
    "https://vm2.research.letswhirl.com:444",
    "https://vm3.research.letswhirl.com:444",
    "https://vm4.research.letswhirl.com:444",
    "https://vm5.research.letswhirl.com:444",
    "https://vm6.research.letswhirl.com:444",
    "https://vm7.research.letswhirl.com:444",
    "https://vm8.research.letswhirl.com:444",
    "https://vm9.research.letswhirl.com:444",
    "https://vm10.research.letswhirl.com:444",
    "https://vm11.research.letswhirl.com:444",
    "https://vm12.research.letswhirl.com:444",
    "https://vm13.research.letswhirl.com:444",
];
const http2URLs = [
    "https://vm1.research.letswhirl.com:442",
    "https://vm2.research.letswhirl.com:442",
    "https://vm3.research.letswhirl.com:442",
    "https://vm4.research.letswhirl.com:442",
    "https://vm5.research.letswhirl.com:442",
    "https://vm6.research.letswhirl.com:442",
    "https://vm7.research.letswhirl.com:442",
    "https://vm8.research.letswhirl.com:442",
    "https://vm9.research.letswhirl.com:442",
    "https://vm10.research.letswhirl.com:442",
    "https://vm11.research.letswhirl.com:442",
    "https://vm12.research.letswhirl.com:442",
    "https://vm13.research.letswhirl.com:442",
]
const http3URLs = [
    "https://vm1.research.letswhirl.com",
    "https://vm2.research.letswhirl.com",
    "https://vm3.research.letswhirl.com",
    "https://vm4.research.letswhirl.com",
    "https://vm5.research.letswhirl.com",
    "https://vm6.research.letswhirl.com",
    "https://vm7.research.letswhirl.com",
    "https://vm8.research.letswhirl.com",
    "https://vm9.research.letswhirl.com",
    "https://vm10.research.letswhirl.com",
    "https://vm11.research.letswhirl.com",
    "https://vm12.research.letswhirl.com",
    "https://vm13.research.letswhirl.com",
]
const forceHTTP3URLs = [
    "https://vm1.research.letswhirl.com/ping",
    "https://vm2.research.letswhirl.com/ping",
    "https://vm3.research.letswhirl.com/ping",
    "https://vm4.research.letswhirl.com/ping",
    "https://vm5.research.letswhirl.com/ping",
    "https://vm6.research.letswhirl.com/ping",
    "https://vm7.research.letswhirl.com/ping",
    "https://vm8.research.letswhirl.com/ping",
    "https://vm9.research.letswhirl.com/ping",
    "https://vm10.research.letswhirl.com/ping",
    "https://vm11.research.letswhirl.com/ping",
    "https://vm12.research.letswhirl.com/ping",
    "https://vm13.research.letswhirl.com/ping",
];

(async () => {
    const currentTime = Date.now().toString()
    const getHttp1Results = http1URLs.map(url => async () => getData({ url }));
    const getHttp2Results = http2URLs.map(url => async () => getData({ url }));
    const getHttp3Results = http3URLs.map((url, index) => async () => getData({ url, forceHTTP3URL: forceHTTP3URLs[index] }));
    const funcs = [getHttp1Results, getHttp2Results, getHttp3Results].flat()
    const results: {
        [key: string]: {
            url: string,
            protocol: string, // HTTP/1.1, HTTP/2, HTTP/2
            timing: {
                startTime: number;
                domainLookupStart: number;
                domainLookupEnd: number;
                connectStart: number;
                secureConnectionStart: number;
                connectEnd: number;
                requestStart: number;
                responseStart: number;
                responseEnd: number;
            },
            headers: {
                [key: string]: string;
            },
            lossRate: string | undefined
        }[];
    } = {}
    for (const f of getHttp3Results) {
        const [data, url] = await f()
        results[`http3-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    for (const f of getHttp2Results) {
        const [data, url] = await f()
        results[`http2-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    for (const f of getHttp1Results) {
        const [data, url] = await f()
        results[`http1-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    

    const logResults = () => {
        const http1Keys = Object.keys(results).filter(key => key.startsWith("http1"))
        const http2Keys = Object.keys(results).filter(key => key.startsWith("http2"))
        const http3Keys = Object.keys(results).filter(key => key.startsWith("http3"))
        const http1Results = http1Keys.map(k => results[k])
        const http2Results = http2Keys.map(k => results[k])
        const http3Results = http3Keys.map(k => results[k])
        let aggregateResults: {
            [url: string]: {
                http1: string,
                http2: string,
                http3: string,
            }
        } = {}

        const getRealResponseTime = (result: {
            url: string,
            protocol: string, // HTTP/1.1, HTTP/2, HTTP/2
            timing: {
                startTime: number;
                domainLookupStart: number;
                domainLookupEnd: number;
                connectStart: number;
                secureConnectionStart: number;
                connectEnd: number;
                requestStart: number;
                responseStart: number;
                responseEnd: number;
            },
            headers: {
                [key: string]: string;
            },
            lossRate: string | undefined
        }) => {
            const { timing } = result
            const {
                startTime,
                domainLookupStart,
                domainLookupEnd,
                connectStart,
                secureConnectionStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
            } = timing
            const domainTime = (domainLookupEnd - domainLookupStart) || 0
            const connectionTime = (connectEnd - connectStart) || 0
            const realResponseTime = responseEnd - connectionTime - domainTime
            return realResponseTime
        }

        http1Results.forEach(result => {
            result.forEach(result => {
                let {url} = result
                url = url.replace(":444", "").replace(":442", "")
                if (url.endsWith("/")) {
                    // remove trailing slash
                    url = url.slice(0, -1)
                }
                const responseTime: number = getRealResponseTime(result)
                if (aggregateResults[url]) {
                    aggregateResults[url].http1 = responseTime.toString()
                } else {
                    aggregateResults[url] = {
                        http1: responseTime.toString(),
                        http2: "",
                        http3: "",
                    }
                }
            })
        })
        http2Results.forEach(result => {
            result.forEach(result => {
                let {url} = result
                url = url.replace(":444", "").replace(":442", "")
                if (url.endsWith("/")) {
                    // remove trailing slash
                    url = url.slice(0, -1)
                }
                const responseTime: number = getRealResponseTime(result)
                if (aggregateResults[url]) {
                    aggregateResults[url].http2 = responseTime.toString()
                } else {
                    aggregateResults[url] = {
                        http1: "",
                        http2: responseTime.toString(),
                        http3: "",
                    }
                }
            })
        })
        http3Results.forEach(result => {
            result.forEach(result => {
                let {url} = result
                url = url.replace(":444", "").replace(":442", "")
                if (url.endsWith("/")) {
                    // remove trailing slash
                    url = url.slice(0, -1)
                }
                const responseTime: number = getRealResponseTime(result)
                if (aggregateResults[url]) {
                    aggregateResults[url].http3 = responseTime.toString()
                } else {
                    aggregateResults[url] = {
                        http1: "",
                        http2: "",
                        http3: responseTime.toString(),
                    }
                }
            })
        })

        const onlyShowMedia = process.argv.includes('-m')

        const getMediaEntries = () => {
            const keys = Object.keys(aggregateResults).filter(key => key.includes("mp4"))
            return keys.map(k => aggregateResults[k])
        }

        console.log(onlyShowMedia ? getMediaEntries() : aggregateResults)
    }
    // for (const f of funcs) {
    //     const [data, url] = await f()
    //     switch (run) {
    //         case 0:
    //             results["http1Results"] = r
    //             break;
    //         case 1:
    //             results["http2Results"] = r
    //             break;
    //         case 2:
    //             results["http3Results"] = r
    //             break;
    //     }
    //     run++;
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    // }

    // ignore undefined values in firestore

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(key as any),
    })

    firebaseAdmin.firestore().settings({ ignoreUndefinedProperties: true })

    await firebaseAdmin.firestore().collection("results").doc(currentTime).set(results)

    if (process.argv.includes('--log-results')) logResults()


    // const results = {http1Results, http2Results, http3Results}
    // console.log("HTTP3 Results: ", http3Results)
    // console.log("HTTP2 Results: ", http2Results)
    // console.log("HTTP1 Results: ", http1Results)
})()