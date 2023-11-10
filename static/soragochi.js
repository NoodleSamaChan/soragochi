//let soraNormal = ./static/sora_sprite_basic.png;
//let soraDead = ./static/soraDead.png;
//let soraBack = ./static/soraBack.png;
//let SoraSideLeft = ;
//let SoraSideRight = ;
//let SoraHungry = ;


setInterval(async () => {
  const response = await fetch("http://127.0.0.1:5000/status", {
    method: "GET"
  });
  status_update = await response.json()
  console.log(status_update)
}, 1000);

let feeding = document.getElementById('feeding_button')
feeding.onclick = async function() {
  await fetch("http://127.0.0.1:5000/feed", {
    method: "GET"
  })
}

let sleeping = document.getElementById('sleeping_button')
sleeping.onclick = async function() {
  await fetch("http://127.0.0.1:5000/sleep", {
    method: "GET"
  })
}