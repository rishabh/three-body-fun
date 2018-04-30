// Rishabh Moudgil
// rishabhmoudgil.com

// Rish's gravitational constant
float G = 1;
float randomPush = 5e-3;
ArrayList<Body> bodies = new ArrayList<Body>();

class Body {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float mass = 1;
  color colour;

  Body(float x, float y) {
    this.location = new PVector(x, y);
    this.velocity = new PVector(random(-randomPush, randomPush), random(-randomPush, randomPush));
    this.acceleration = new PVector(0, 0);
    this.mass = random(1, 5);
    this.colour = giveMeNiceColour();
  }

  PVector Attract(Body b) {
    PVector force = PVector.sub(location, b.location);
    float d = max(force.mag(), 10);
    force.setMag((G * mass * b.mass )/(d * d));
    return force;
  }

  void ApplyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }

  void Update() {
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.x = acceleration.y = 0;
  }

  void Draw() {
    fill(colour);
    float r = map(mass, 1, 5, 5, 10);
    ellipse(location.x, location.y, r, r);
  }

  boolean OutOfBounds() {
    return dist(width/2, height/2, location.x, location.y) > 800;
  }
}

void setup() {
  size(672, 300);

  int l = 50;
  bodies.add(new Body((width / 2) - l/2, (height / 2)));
  bodies.add(new Body((width / 2), (height / 2) - (sqrt(3) * l/2)));
  bodies.add(new Body((width / 2) + l/2, (height / 2)));

  noStroke();
  background(33);
}


void draw() {
  fill (33, 30);
  rect(0, 0, width, height);

  for (int i = 0; i < bodies.size(); ++i) {
    Body b = bodies.get(i);

    for (int j = 0; j < bodies.size(); ++j) {
      Body t = bodies.get(j);
      if (b == t) continue;

      PVector force = b.Attract(t);
      t.ApplyForce(force);
    }
  }

  for (int i = bodies.size() - 1; i >= 0; --i) {
    Body b = bodies.get(i);
    b.Update();
    if (b.OutOfBounds()) {
      bodies.remove(i);
    } else {
      b.Draw();
    }
  }
}

void mousePressed() {
  Body t = new Body(mouseX, mouseY);
  bodies.add(t);
}

color giveMeNiceColour() {
  float r = random(20, 256) + 255;
  float g = random(20, 256) + 255;
  float b = random(20, 256) + 255;
  return color(r / 2f, g / 2f, b / 2f);
}