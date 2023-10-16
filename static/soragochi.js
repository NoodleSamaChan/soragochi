function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));

}

while (sleep(1000)) {
  fetch( "http://127.0.0.1:5000/status", {
      method: "GET" 
  })
  .then((status) => {
    console.log(status.sora_mood)
  } )
  
}


async function timer() {
    for (let i = 0; i < 10; i++) {
        await sleep(i * 1000);
    }
