function setup() {
  // let x = 0
  createCanvas(200, 200);
  background(255);
  textSize(72)
  setInterval(getData, 500)
}

function getData() {
  httpGet("/gpio", "json", false, (x) => {
    clear()
    text(x[2], 50, 100)
    
  })
}