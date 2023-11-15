let soraSprite = document.getElementById('sora_image');

let soraNormal = './static/sora_sprite_basic.png';
let soraDead = './static/sora_dead_hd.png';
let soraBack = './static/sora_back_2.png';
let soraTired = './static/sora_tired.png';
let soraWave = './static/sora_wave.png';
let soraJump = './static/sora_jump.png';


setInterval(async () => {
  const response = await fetch("http://127.0.0.1:5000/status", {
    method: "GET"
  });
  status_update = await response.json()
  console.log(status_update)

  if (status_update[2] === 'Normal'){
    let position = Math.floor(Math.random() * 3)
    if (position === 1) {
      soraSprite.src = soraNormal;
    } else if (position === 2) {
      soraSprite.src = soraBack
    } else {
      soraSprite.src = soraWave
    }
  } else if (status_update[2] === 'Tired'){
    soraSprite.src = soraTired;
  } else {
    soraSprite.src = soraDead;
  }
}, 3000);

let feeding = document.getElementById('feeding_button')
feeding.onclick = async function() {
  await fetch("http://127.0.0.1:5000/feed", {
    method: "PUT"
  })
}

let sleeping = document.getElementById('sleeping_button')
sleeping.onclick = async function() {
  await fetch("http://127.0.0.1:5000/sleep", {
    method: "PUT"
  })
}

function jumpup () {
  soraSprite.src = soraJump;
  soraSprite.style.bottom = '400px';
}

function jumpdown () {
  soraSprite.src = soraJump;
  soraSprite.style.bottom = '50px';
}

document.addEventListener('keydown', jumpup);
document.addEventListener('keyup', jumpdown);