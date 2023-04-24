import {getData} from "./getData"
import * as firebaseAdmin from 'firebase-admin'
import key from "../../keys/admin.json"

const http1URLs = [
    "https://vm1.research.letswhirl.com:444",
    "https://vm2.research.letswhirl.com:444",
    "https://vm3.research.letswhirl.com:444",
    "https://vm4.research.letswhirl.com:444",
    "https://vm5.research.letswhirl.com:444",
    "https://vm6.research.letswhirl.com:444",
    "https://vm7.research.letswhirl.com:444",
];
const http2URLs = [
    "https://vm1.research.letswhirl.com:442",
    "https://vm2.research.letswhirl.com:442",
    "https://vm3.research.letswhirl.com:442",
    "https://vm4.research.letswhirl.com:442",
    "https://vm5.research.letswhirl.com:442",
    "https://vm6.research.letswhirl.com:442",
    "https://vm7.research.letswhirl.com:442",
]
const http3URLs = [
    "https://vm1.research.letswhirl.com",
    "https://vm2.research.letswhirl.com",
    "https://vm3.research.letswhirl.com",
    "https://vm4.research.letswhirl.com",
    "https://vm5.research.letswhirl.com",
    "https://vm6.research.letswhirl.com",
    "https://vm7.research.letswhirl.com",
]
const forceHTTP3URLs = [
    "https://vm1.research.letswhirl.com/ping",
    "https://vm2.research.letswhirl.com/ping",
    "https://vm3.research.letswhirl.com/ping",
    "https://vm4.research.letswhirl.com/ping",
    "https://vm5.research.letswhirl.com/ping",
    "https://vm6.research.letswhirl.com/ping",
    "https://vm7.research.letswhirl.com/ping",
];

(async () => {
    const currentTime = Date.now().toString()
    const getHttp1Results = http1URLs.map(url => async () => getData({ url }));
    const getHttp2Results = http2URLs.map(url => async () => getData({url}));
    const getHttp3Results = http3URLs.map((url, index) => async () => getData({url, forceHTTP3URL: forceHTTP3URLs[index]}));
    const funcs = [getHttp1Results, getHttp2Results, getHttp3Results].flat()
    const results : {
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
    for (const f of getHttp1Results) {
        const [data, url] = await f()
        results[`http1-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (const f of getHttp2Results) {
        const [data, url] = await f()
        results[`http2-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (const f of getHttp3Results) {
        const [data, url] = await f()
        results[`http3-${url}`] = data
        await new Promise(resolve => setTimeout(resolve, 2000));
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

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(key as any),
    })

    await firebaseAdmin.firestore().collection("results").doc(currentTime).set(results)


    // const results = {http1Results, http2Results, http3Results}
    // console.log("HTTP3 Results: ", http3Results)
    // console.log("HTTP2 Results: ", http2Results)
    // console.log("HTTP1 Results: ", http1Results)
})()