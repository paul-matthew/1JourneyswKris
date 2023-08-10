  export async function getDataFromStrapi(path, query) {

  try {
    let baseUrl;
    let apiToken;

    if (process.env.NODE_ENV !== 'production') {
      baseUrl = "http://127.0.0.1:1337";
      apiToken = "2d1cc176200bc504886bd120dbbb5b862bfa9d7b94581bedab26a1acae5650970bf6185d55a4cc9adda13b97d1706b5b60d4b15d8fbad32bdbca2ddc5d05e3afbb1c1783031b7ad14af7bd49541119c3842c93f7a37b7c0857fd11dd42067b1ddbd768315fd17d407fc631ba6766fbb9494b7c6634d597ed91eaacc3806b2474";
      console.log("This is a local build yo");
    } else {
      baseUrl = "https://journeyswkris-938066b97596.herokuapp.com/"; //UPDATE SECTION API TOKEN
      apiToken = "81215aca64cd92af2705e286cd018e20a0de82bc2df5db3e7eb1b83c62eddc01098ebc0d66acdde8e480f277c2f7d85c69b79e9b899267cf398649a1b8b508fd82a3e52bf9174421af2b94a3790c973178b833bd5cd4b003d6a0e0953302c51db9e2f7657c46573412d835983ca2a2e84c9d58695ccee501110b6765cfdf128c";
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