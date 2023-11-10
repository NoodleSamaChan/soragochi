let soraSprite = document.getElementById('sora_image');

let soraNormal = './static/sora_sprite_basic.png';
let soraDead = './static/sora_dead.png';
let soraBack = './static/sora_back.png';
let SoraTired = './static/sora_tired.png';
//let SoraSideRight = ;
//let SoraHungry = ;


setInterval(async () => {
  const response = await fetch("http://127.0.0.1:5000/status", {
    method: "GET"
  });
  status_update = await response.json()
  console.log(status_update)

  if (status_update[2] === 'Normal'){
    soraSprite.src = soraNormal;
  } else if (status_update[2] === 'Tired'){
    soraSprite.src = SoraTired;
  } else {
    soraSprite.src = soraDead;
  }
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