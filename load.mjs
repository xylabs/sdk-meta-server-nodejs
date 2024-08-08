import axios from 'axios'

// Array of URLs to test
const urls = [
  'http://localhost:8083/blog/googles-delayed-cookie-policy-a-step-toward-digital-sovereignty-or-strategic-maneuvering',
  'http://localhost:8083/blog/xyo-is-now-available-on-base',
  'http://localhost:8083/blog/xyo-enhances-digital-autonomy-data-sovereignty-with-xyos-beta-launch-2',
  'http://localhost:8083/blog/introducing-xyos-pioneering-the-path-to-a-sovereign-internet',
  'http://localhost:8083/blog/xyo-announces-membership-in-singapore-based-digital-assets-association',
  'http://localhost:8083/blog/charting-the-course-to-brilliance-unveiling-the-xyo-2024-roadmap',
]

// Function to fetch a URL
async function fetchUrl(url) {
  try {
    const response = await axios.get(url)
    console.log(`Fetched ${url}: Status ${response.status}`)
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message)
  }
}

// Function to get random URLs and fetch them in parallel
async function fetchRandomUrls(concurrentRequests = 300) {
  const tasks = []

  for (let i = 0; i < concurrentRequests; i++) {
    // Get a random URL from the array
    const randomUrl = urls[Math.floor(Math.random() * urls.length)]
    tasks.push(fetchUrl(randomUrl))
  }

  // Wait for all requests to complete
  await Promise.all(tasks)
  console.log('All requests completed.')
}

// Run the load test
fetchRandomUrls()
