// Rishabh Moudgil
// rishabhmoudgil.com

// Rish's magical gravitational constant
var G = 1;
var randomPush = 0.0005;
var bodies = [];    
var proportion = 300.0 / 672.0;

function giveMeNiceColour() {
    var r = random(20, 256) + 255;
    var g = random(20, 256) + 255;
    var b = random(20, 256) + 255;
    return color(r / 2.0, g / 2.0, b / 2.0);
}

function Body(x, y) {
    this.location = createVector(x, y);
    this.velocity = createVector(random(-randomPush, randomPush), random(-randomPush, randomPush));
    this.acceleration = createVector(0, 0); 
    this.mass = random(1, 5);
    this.colour = giveMeNiceColour();

    this.Attract = function(b) {
        var force = p5.Vector.sub(this.location, b.location);
        var d = max(force.mag(), 10);
        force.setMag((G * this.mass * b.mass) / (d * d));
        return force;
    };
    
    this.ApplyForce = function(force) {
        var f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    };
    
    this.Update = function() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.x = this.acceleration.y = 0;
    };

    this.Draw = function() {
        fill(this.colour);
        var r = map(this.mass, 1.0, 5.0, 5.0, 10.0);
        ellipse(this.location.x, this.location.y, r, r);
    };

    this.OutOfBounds = function() {
        return dist(width / 2, height / 2, this.location.x, this.location.y) > 800;
    };
}

function setup() {
    var realWidth = parseInt(getComputedStyle(document.getElementById("articleBody"), null).getPropertyValue("width"));

    var canvas = createCanvas(realWidth, 300);
    canvas.parent('sketch');

    var l = 50;
    bodies.push(new Body((width / 2) - l / 2, (height / 2)));
    bodies.push(new Body((width / 2), (height / 2) - (sqrt(3) * l / 2)));
    bodies.push(new Body((width / 2) + l / 2, (height / 2)));

    noStroke();
    background(33);
}


function draw() {
    background('rgba(51, 51, 51, 0.3)')

    for (var i = 0; i < bodies.length; ++i) {
        var b = bodies[i];

        for (var j = 0; j < bodies.length; ++j) {
            var t = bodies[j];
            if (b == t) continue;

            var force = b.Attract(t);
            t.ApplyForce(force);
        }
    }

    for (var i = bodies.length - 1; i >= 0; --i) {
        var b = bodies[i];
        b.Update();
        if (b.OutOfBounds()) {
            bodies.splice(i, 1);
        } else {
            b.Draw();
        }
    }
}

function mouseClicked() {
    var t = new Body(mouseX, mouseY);
    bodies.push(t);
}

function windowResized() {
    var realWidth = parseInt(getComputedStyle(document.getElementById("articleBody"), null).getPropertyValue("width"));
    resizeCanvas(realWidth, 300);
}