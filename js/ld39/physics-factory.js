var LD39 = LD39 || {};

var Body = Matter.Body;
var Composite = Matter.Composite;
var Bodies = Matter.Bodies;
var Constraint = Matter.Constraint;

LD39.createTrainComposite = function(xx, yy, width, height, wheelSize) {
  	var group = Body.nextGroup(true),
        wheelBase = 20,
        wheelAOffset = -width * 0.55 + wheelBase,
        wheelBOffset = width * 0.55 - wheelBase,
        wheelYOffset = wheelSize * 0.1;

    var car = Composite.create({ label: 'Car' }),
        body = Bodies.rectangle(xx, yy, width, height, {
            collisionFilter: {
                group: group
            },
            chamfer: {
                radius: height * 0.5
            },
            density: 0.0002
        });

    var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
        collisionFilter: {
            group: group
        },
        friction: 0.8
    });

    var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
        collisionFilter: {
            group: group
        },
        friction: 0.8
    });

    var axelA = Constraint.create({
        bodyB: body,
        pointB: { x: wheelAOffset, y: wheelYOffset },
        bodyA: wheelA,
        stiffness: 1,
        length: 0
    });

    var axelB = Constraint.create({
        bodyB: body,
        pointB: { x: wheelBOffset, y: wheelYOffset },
        bodyA: wheelB,
        stiffness: 1,
        length: 0
    });

    Composite.addBody(car, body);
    Composite.addBody(car, wheelA);
    Composite.addBody(car, wheelB);
    Composite.addConstraint(car, axelA);
    Composite.addConstraint(car, axelB);

    return car;
}
