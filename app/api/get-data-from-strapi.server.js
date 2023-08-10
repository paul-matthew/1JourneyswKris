  export async function getDataFromStrapi(path, query) {

  try {
    let baseUrl;
    let apiToken;

    if (process.env.NODE_ENV !== 'production') {
      baseUrl = "http://127.0.0.1:1337";
      apiToken = "81215aca64cd92af2705e286cd018e20a0de82bc2df5db3e7eb1b83c62eddc01098ebc0d66acdde8e480f277c2f7d85c69b79e9b899267cf398649a1b8b508fd82a3e52bf9174421af2b94a3790c973178b833bd5cd4b003d6a0e0953302c51db9e2f7657c46573412d835983ca2a2e84c9d58695ccee501110b6765cfdf128c";
      console.log("This is a local build yo");
    } else {
      baseUrl = "https://journeyswkris-938066b97596.herokuapp.com"; //UPDATE SECTION API TOKEN
      apiToken = "81215aca64cd92af2705e286cd018e20a0de82bc2df5db3e7eb1b83c62eddc01098ebc0d66acdde8e480f277c2f7d85c69b79e9b899267cf398649a1b8b508fd82a3e52bf9174421af2b94a3790c973178b833bd5cd4b003d6a0e0953302c51db9e2f7657c46573412d835983ca2a2e84c9d58695ccee501110b6765cfdf128c";
      console.log("This is a production build");
    }
    const url = `${baseUrl}/api/${path}?${query}`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    console.log(response);


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