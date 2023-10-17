setInterval(async () => {
  const response = await fetch("http://127.0.0.1:5000/status", {
    method: "GET"
  });
  status_update = await response.json()
  console.log(status_update)
}, 1000);
