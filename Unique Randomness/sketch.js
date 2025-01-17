let table;
let data = [];
let hoveredData = null;
let offsets = [];

function preload() {
  table = loadTable('random_temperature_dataset.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(30);

  for (let i = 0; i < table.getRowCount(); i++) {
    let city = table.getString(i, 'City');
    let temp = table.getNum(i, 'Temperature (°C)');
    data.push({ city, temp });

    offsets.push({
      angleOffset: random(TWO_PI),
      speedOffset: random(0.01, 0.05),
      gravity: random(0.1, 0.3),
      rotationSpeed: random(0.01, 0.03),
    });
  }
}

function draw() {
  for (let y = 0; y < height; y++) {
    stroke(map(y, 0, height, 200, 360), 60, 30, 10);
    line(0, y, width, y);
  }

  translate(width / 2, height / 2);
  hoveredData = null;

  for (let i = 0; i < data.length; i++) {
    let offset = offsets[i];
    let angle = map(i, 0, data.length, 0, TWO_PI) + frameCount * 0.01 + offset.angleOffset;
    let distance = map(data[i].temp, -10, 40, 100, 500) + sin(frameCount * 0.02 + i) * 30;

    let shapeSize = map(data[i].temp, -10, 40, 10, 60);
    let hue = map(data[i].temp, -10, 40, 200, 360);

    let x = cos(angle) * distance + sin(frameCount * offset.speedOffset + i) * 40;
    let y = sin(angle) * distance + offset.gravity * sin(frameCount * 0.05 + i);

    if (dist(mouseX - width / 2, mouseY - height / 2, x, y) < shapeSize / 2) {
      hoveredData = data[i];
    }

    fill(hue, 60, 80, 80);
    noStroke();
    push();
    translate(x, y);

    beginShape();
    for (let j = 0; j < 6; j++) {
      let theta = map(j, 0, 6, 0, TWO_PI);
      let radius = shapeSize * 0.5 + sin(frameCount * 0.05 + j) * 10;
      let sx = cos(theta) * radius;
      let sy = sin(theta) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();

    stroke(hue, 50, 70, 30);
    line(0, 0, x, y);
  }

  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(50, 100, 100, map(sin(frameCount * 0.02 + i), -1, 1, 5, 20));
    ellipse(0, 0, width * 0.4 + i * 15, height * 0.4 + i * 15);
  }

 
  if (hoveredData) {
    fill(0, 0, 100);
    textSize(20);
    textAlign(CENTER);
    text(`City: ${hoveredData.city}, Temp: ${hoveredData.temp}°C`, 0, height / 2 - 20);
  }
}
