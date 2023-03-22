import fetch from 'node-fetch';

async function getMP4() {
    try {
        const fetched = await fetch('http://146.148.34.33/');
        if (!fetched.ok) {
            throw new Error(`Error! status: ${fetched.status}`);
        }
        return fetched
    }catch (error) {
        console.log(error);
    }
}

console.log(await getMP4())