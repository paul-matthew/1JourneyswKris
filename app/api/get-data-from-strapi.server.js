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
      apiToken = "a217fcdce3aae794d40d333ccbfff4df8dceb1301f87a03c4c1811def9ed9dd44c84d5542c4e16554aaadfdfd9de170e42ddde35cef0b6688cd64922082cd3a90835b4cd037bebb8aaea3a6ae43f773199a71485de75644e2f73b52babd3d6bd27da0137dd6fb4561410e0bf3cb0a5836f9152b3fc98abcb740653fc91315ec8";
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