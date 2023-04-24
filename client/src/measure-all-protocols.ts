import {getData} from "./getData"
import * as firebaseAdmin from 'firebase-admin'
import key from "../../keys/admin.json"

const http1URL = "https://vm1.research.letswhirl.com:444";
const http2URL = "https://vm1.research.letswhirl.com:442";
const http3URL = "https://vm1.research.letswhirl.com";
const forceHTTP3URL = "https://vm1.research.letswhirl.com/ping";

(async () => {
    const currentTime = Date.now().toString()
    const getHttp1Results = () => getData({ url : http1URL});
    const getHttp2Results = () => getData({url: http2URL});
    const getHttp3Results = () => getData({url: http3URL, forceHTTP3URL});
    const funcs = [getHttp1Results, getHttp2Results, getHttp3Results]
    let run = 0
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
            }
        }[];
    } = {}
    for (const f of funcs) {
        const r = await f()
        switch (run) {
            case 0:
                results["http1Results"] = r
                break;
            case 1:
                results["http2Results"] = r
                break;
            case 2:
                results["http3Results"] = r
                break;
        }
        run++;
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(key as any),
    })

    await firebaseAdmin.firestore().collection("results").doc(currentTime).set(results)


    // const results = {http1Results, http2Results, http3Results}
    // console.log("HTTP3 Results: ", http3Results)
    // console.log("HTTP2 Results: ", http2Results)
    // console.log("HTTP1 Results: ", http1Results)
})()