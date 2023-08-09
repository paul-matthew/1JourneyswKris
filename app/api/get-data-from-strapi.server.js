export async function getDataFromStrapi(path, query) {

try {
  let baseUrl;
  let apiToken;

  if (process.env.NODE_ENV !== 'production') {
    baseUrl = "http://127.0.0.1:1337";
    apiToken = "2d1cc176200bc504886bd120dbbb5b862bfa9d7b94581bedab26a1acae5650970bf6185d55a4cc9adda13b97d1706b5b60d4b15d8fbad32bdbca2ddc5d05e3afbb1c1783031b7ad14af7bd49541119c3842c93f7a37b7c0857fd11dd42067b1ddbd768315fd17d407fc631ba6766fbb9494b7c6634d597ed91eaacc3806b2474";
    console.log("This is a local build yo");
  } else {
    baseUrl = "https://journeyswkris-938066b97596.herokuapp.com/"; //UPDATE THIS SECTION
    apiToken = "e24148405165ce1ea76caf74504d058ac49892d30d3a6b8c64af9bed17471354619a0a87886c0e93d619740fce277dceb9e256c84bd35ce3c1d50aba294b150bc0916c0efb2bfce586dfc668e290cff2a0cca4602029a779ed080d27c536d7d2b87a4098981e39d5e909a7296ea4ac995b0976a64160cd6da51b40c0d7a16cec";
    console.log("This is a production build");
  }
  const url = `${baseUrl}/api/${path}?${query}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
} 

  catch (error) {
  console.error(error);
  throw new Error('Error fetching data from Strapi');
}
}