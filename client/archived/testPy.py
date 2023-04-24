import time
import httpx
import asyncio

url = 'https://vm1.research.letswhirl.com'
image_paths = ['/image1.jpeg', '/image2.jpeg', '/image3.jpeg']

# Function to measure loading time using HTTP/1.1
def measure_http1_1(url, path):
    start_time = time.time()
    response = httpx.get(url + path, http_versions=["HTTP/1.1"])
    end_time = time.time()
    return end_time - start_time

# Function to measure loading time using HTTP/2
def measure_http2(url, path):
    start_time = time.time()
    response = httpx.get(url + path, http_versions=["HTTP/2"])
    end_time = time.time()
    return end_time - start_time

# Function to measure loading time using HTTP/3
async def measure_http3(url, path):
    async with httpx.AsyncClient(http_versions=["HTTP/3"]) as client:
        start_time = time.time()
        response = await client.get(url + path)
        end_time = time.time()
        return end_time - start_time

# Main function to run the script
async def main():
    for i, image_path in enumerate(image_paths):
        http1_1_time = measure_http1_1(url, image_path)
        http2_time = measure_http2(url, image_path)
        http3_time = await measure_http3(url, image_path)
        
        print(f"Image {i + 1} loading times:")
        print(f"HTTP/1.1: {http1_1_time:.4f} seconds")
        print(f"HTTP/2: {http2_time:.4f} seconds")
        print(f"HTTP/3: {http3_time:.4f} seconds")
        print()

# Run the script
if __name__ == "__main__":
    asyncio.run(main())
