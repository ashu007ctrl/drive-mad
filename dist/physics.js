/**
 * DRIVE MAD — 2D Rigid Body Physics Engine
 * Handles:
 * - Car chassis + multi-point wheel suspension & traction
 * - Static terrain (flats, ramps, bridges, bumps)
 * - Dynamic See-Saws
 * - Moving Platforms
 * - Rotating Spinner Obstacles
 * - Driver Head collision & crash detection
 */

class Vec2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  add(v)    { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v)    { return new Vec2(this.x - v.x, this.y - v.y); }
  scale(s)  { return new Vec2(this.x * s, this.y * s); }
  dot(v)    { return this.x * v.x + this.y * v.y; }
  len()     { return Math.sqrt(this.x * this.x + this.y * this.y); }
  norm()    { const l = this.len() || 1; return new Vec2(this.x / l, this.y / l); }
  perp()    { return new Vec2(-this.y, this.x); }
  rot(a)    { const c = Math.cos(a), s = Math.sin(a); return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c); }
  clone()   { return new Vec2(this.x, this.y); }
}

class Body {
  constructor({ x = 0, y = 0, mass = 1, isStatic = false }) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2();
    this.angle = 0;
    this.angVel = 0;
    this.mass = isStatic ? Infinity : mass;
    this.invM = isStatic ? 0 : 1 / mass;
    this.inertia = mass * 0.5;
    this.invI = isStatic ? 0 : 1 / this.inertia;
    this.isStatic = isStatic;
    this.restitution = 0.08;
    this.friction = 0.5;
  }

  applyForce(f, dt) {
    if (this.isStatic) return;
    this.vel.x += f.x * this.invM * dt;
    this.vel.y += f.y * this.invM * dt;
  }

  applyTorque(t, dt) {
    if (this.isStatic) return;
    this.angVel += t * this.invI * dt;
  }

  applyImpulse(imp, r) {
    if (this.isStatic) return;
    this.vel.x += imp.x * this.invM;
    this.vel.y += imp.y * this.invM;
    this.angVel += (r.x * imp.y - r.y * imp.x) * this.invI;
  }

  integrate(dt) {
    if (this.isStatic) return;
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.angle += this.angVel * dt;
  }
}

class Wheel {
  constructor(offsetX, offsetY) {
    this.localOffset = new Vec2(offsetX, offsetY);
    this.spin = 0;
    this.contact = false;
    this.contactNormal = new Vec2(0, 1);
    this.contactPoint = new Vec2();
    this.suspensionComp = 0; // 0 = relaxed, 1 = fully compressed
    this.surfaceVel = new Vec2();
  }

  worldPos(body) {
    return body.pos.add(this.localOffset.rot(body.angle));
  }
}

class TrackGeometry {
  static build(segments) {
    const lines = [];

    segments.forEach(seg => {
      switch (seg.type) {
        case 'flat': {
          const y = seg.y;
          const x0 = seg.x, x1 = seg.x + seg.w;
          lines.push(TrackGeometry.seg(x0, y, x1, y));
          if (seg.x <= 0.1) {
            lines.push(TrackGeometry.seg(x0, y, x0, y - 8));
          }
          break;
        }
        case 'ramp': {
          const y0 = seg.y;
          const y1 = seg.y + seg.rise;
          const x0 = seg.x, x1 = seg.x + seg.w;
          lines.push(TrackGeometry.seg(x0, y0, x1, y1));
          break;
        }
        case 'boost': {
          // Turbo boost pad or accelerating ramp
          const y0 = seg.y;
          const y1 = seg.y + (seg.rise || 0);
          const x0 = seg.x, x1 = seg.x + seg.w;
          const line = TrackGeometry.seg(x0, y0, x1, y1);
          line.isBoost = true;
          line.boostPower = seg.power || 32;
          lines.push(line);
          break;
        }
        case 'bounce': {
          // High bounce jump pad
          const y = seg.y;
          const x0 = seg.x, x1 = seg.x + seg.w;
          const line = TrackGeometry.seg(x0, y, x1, y);
          line.isBounce = true;
          line.bouncePower = seg.power || 16;
          lines.push(line);
          break;
        }
        case 'bridge': {
          const numPlanks = Math.max(4, Math.ceil(seg.w * 2));
          for (let i = 0; i < numPlanks; i++) {
            const t0 = i / numPlanks;
            const t1 = (i + 1) / numPlanks;
            const dip0 = Math.sin(t0 * Math.PI) * (seg.sag || 1.5);
            const dip1 = Math.sin(t1 * Math.PI) * (seg.sag || 1.5);
            const x0 = seg.x + t0 * seg.w;
            const x1 = seg.x + t1 * seg.w;
            lines.push(TrackGeometry.seg(x0, seg.y - dip0, x1, seg.y - dip1));
          }
          break;
        }
        case 'bump': {
          const h = (seg.h || 0.6);
          lines.push(TrackGeometry.seg(seg.x, seg.y, seg.x + seg.w * 0.5, seg.y + h));
          lines.push(TrackGeometry.seg(seg.x + seg.w * 0.5, seg.y + h, seg.x + seg.w, seg.y));
          break;
        }
        default: break;
      }
    });

    return lines;
  }

  static seg(x0, y0, x1, y1) {
    const a = new Vec2(x0, y0);
    const b = new Vec2(x1, y1);
    const d = b.sub(a).norm();
    return { a, b, normal: new Vec2(-d.y, d.x) };
  }
}

class SeeSaw {
  constructor(x, y, w) {
    this.pivot = new Vec2(x + w / 2, y);
    this.angle = 0;
    this.angVel = 0;
    this.w = w;
    this.inertia = 400;    // very heavy plank — resists tipping strongly
    this.damping = 0.80;   // heavy damping kills oscillation quickly
  }

  applyTorque(t, dt) {
    this.angVel += (t / this.inertia) * dt;
  }

  integrate(dt) {
    this.angVel -= this.angle * 35 * dt;   // very strong spring restoring force
    this.angVel *= Math.pow(this.damping, dt * 60);
    this.angle += this.angVel * dt;
    this.angle = Math.max(-Math.PI * 0.10, Math.min(Math.PI * 0.10, this.angle)); // ±18° max tilt
  }

  getSurface() {
    const half = this.w / 2;
    const dx = Math.cos(this.angle) * half;
    const dy = Math.sin(this.angle) * half;
    return {
      a: new Vec2(this.pivot.x - dx, this.pivot.y - dy),
      b: new Vec2(this.pivot.x + dx, this.pivot.y + dy)
    };
  }
}

class MovingPlatform {
  constructor(seg) {
    this.baseX = seg.x;
    this.y = seg.y;
    this.w = seg.w;
    this.range = seg.range || 5;
    this.speed = seg.speed || 2;
    this.time = 0;
    this.x = seg.x;
    this.vx = 0;
  }

  update(dt) {
    this.time += dt * this.speed;
    const prevX = this.x;
    this.x = this.baseX + Math.sin(this.time) * this.range;
    this.vx = (this.x - prevX) / dt;
  }

  getSurface() {
    const a = new Vec2(this.x, this.y);
    const b = new Vec2(this.x + this.w, this.y);
    const normal = new Vec2(0, 1);
    return { a, b, normal, vx: this.vx };
  }
}

class SpinnerObstacle {
  constructor(obs) {
    this.pos = new Vec2(obs.x, obs.y);
    this.r = obs.r || 1.3;
    this.speed = obs.speed || 3;
    this.angle = 0;
  }

  update(dt) {
    this.angle += this.speed * dt;
  }

  getSegments() {
    // 4 arms (cross shaped spinner)
    const arms = [];
    for (let i = 0; i < 4; i++) {
      const a = this.angle + (i * Math.PI) / 2;
      const end = new Vec2(this.pos.x + Math.cos(a) * this.r, this.pos.y + Math.sin(a) * this.r);
      arms.push({ a: this.pos.clone(), b: end, isObstacle: true });
    }
    return arms;
  }
}

class PhysicsWorld {
  constructor(cfg) {
    this.cfg = cfg;
    this.gravity = cfg.gravity;
    this.lines = [];
    this.seeSaws = [];
    this.boxes = [];
    this.movingPlatforms = [];
    this.spinners = [];
  }

  loadLevel(levelData) {
    this.lines = TrackGeometry.build(levelData.segments || []);
    this.seeSaws = [];
    this.boxes = [];
    this.movingPlatforms = [];
    this.spinners = [];

    (levelData.segments || []).forEach(seg => {
      if (seg.type === 'see-saw') {
        this.seeSaws.push(new SeeSaw(seg.x, seg.y, seg.w));
      } else if (seg.type === 'box') {
        this.boxes.push({ ...seg });
      } else if (seg.type === 'moving') {
        this.movingPlatforms.push(new MovingPlatform(seg));
      }
    });

    (levelData.obstacles || []).forEach(obs => {
      if (obs.type === 'spinner') {
        this.spinners.push(new SpinnerObstacle(obs));
      }
    });
  }

  createCar(spawnX, spawnY) {
    const cfg = this.cfg;
    this.car = new Body({ x: spawnX, y: spawnY + 1.2, mass: cfg.mass });
    this.car.angle = 0;
    this.car.vel = new Vec2();
    this.car.angVel = 0;

    this.car.wheels = [
      new Wheel(-cfg.bodyWidth / 2 + 0.35, -cfg.bodyHeight / 2 - 0.12),
      new Wheel(cfg.bodyWidth / 2 - 0.35, -cfg.bodyHeight / 2 - 0.12),
    ];

    this.car.airTime = 0;
    this.car.rotAccum = 0;
    this.car.flips = 0;
    this.car.lastStunt = null;
    this.car.boostTime = 0;
    this.car.bounceTime = 0;
    this.car.landingImpact = 0;

    this.driveForce = 0;
    this.brakeForce = 0;
    return this.car;
  }

  step(dt, controls) {
    const car = this.car;
    const cfg = this.cfg;
    if (!car) return { crashed: false };

    // Update dynamic entities
    this.seeSaws.forEach(ss => ss.integrate(dt));
    this.movingPlatforms.forEach(mp => mp.update(dt));
    this.spinners.forEach(sp => sp.update(dt));

    // Inputs: Forward (Right/Up/W/D) & Backward (Left/Down/A/S)
    const isForward = controls.forward || controls.right || controls.up;
    const isBackward = controls.backward || controls.left || controls.down;
    const isBraking = controls.brake;

    const anyWheelContact = car.wheels.some(w => w.contact);

    if (isBraking) {
      this.driveForce = 0;
      this.brakeForce = cfg.brakeForce;
    } else if (isForward && !isBackward) {
      this.driveForce = cfg.engineForce;
      this.brakeForce = 0;
      if (anyWheelContact) {
        car.applyTorque(-cfg.tiltTorque * 0.7, dt); // slight forward tilt on ground
      }
    } else if (isBackward && !isForward) {
      this.driveForce = -cfg.reverseForce;
      this.brakeForce = 0;
      if (anyWheelContact) {
        car.applyTorque(cfg.tiltTorque * 0.7, dt);  // slight backward tilt on ground
      }
    } else {
      this.driveForce = 0;
      this.brakeForce = 0;
    }

    // PRO FEATURE: Air Control / Stunt Flips when wheels are airborne!
    if (!anyWheelContact) {
      car.airTime += dt;
      car.rotAccum += car.angVel * dt;

      // Detect full 360 flips
      if (car.rotAccum >= Math.PI * 1.8) {
        car.flips++;
        car.lastStunt = '★ BACKFLIP! +500 ★';
        car.rotAccum = 0;
      } else if (car.rotAccum <= -Math.PI * 1.8) {
        car.flips++;
        car.lastStunt = '★ FRONTFLIP! +500 ★';
        car.rotAccum = 0;
      }

      // Air pitch control for stunts and smooth ramp landing
      if (isBackward && !isForward) {
        car.angVel += 7.5 * dt; // pitch back
      } else if (isForward && !isBackward) {
        car.angVel -= 7.5 * dt; // pitch forward
      }
    } else {
      // Landing detection
      if (car.airTime > 0.8) {
        car.lastStunt = `AIR TIME ${car.airTime.toFixed(1)}s!`;
        car.landingImpact = Math.abs(car.vel.y);
      }
      car.airTime = 0;
      car.rotAccum = 0;
    }

    if (car.boostTime > 0) car.boostTime -= dt;
    if (car.bounceTime > 0) car.bounceTime -= dt;

    // Gravity & Air Drag
    car.applyForce(new Vec2(0, this.gravity * car.mass), dt);
    car.vel.x *= Math.pow(cfg.airFriction, dt * 60);
    car.vel.y *= Math.pow(cfg.airFriction, dt * 60);
    car.angVel *= Math.pow(anyWheelContact ? 0.88 : 0.96, dt * 60);

    // Speed Cap (boost raises cap temporarily)
    const effectiveMaxSpeed = car.boostTime > 0 ? cfg.maxSpeed * 1.5 : cfg.maxSpeed;
    const spd = car.vel.len();
    if (spd > effectiveMaxSpeed) {
      car.vel.x *= effectiveMaxSpeed / spd;
      car.vel.y *= effectiveMaxSpeed / spd;
    }

    // Integrate body
    car.integrate(dt);

    // Collect all dynamic + static surfaces for contact
    const surfaces = [...this.lines];

    this.seeSaws.forEach(ss => {
      const { a, b } = ss.getSurface();
      const d = b.sub(a).norm();
      surfaces.push({ a, b, normal: new Vec2(-d.y, d.x), seeSaw: ss });
    });

    this.movingPlatforms.forEach(mp => {
      const s = mp.getSurface();
      surfaces.push({ a: s.a, b: s.b, normal: s.normal, movingPlatform: mp });
    });

    this.boxes.forEach(bx => {
      const topY = bx.y + bx.h;
      surfaces.push(TrackGeometry.seg(bx.x, topY, bx.x + bx.w, topY));
      surfaces.push(TrackGeometry.seg(bx.x, bx.y, bx.x, topY));
      surfaces.push(TrackGeometry.seg(bx.x + bx.w, bx.y, bx.x + bx.w, topY));
    });

    // Wheel collision & propulsion
    car.wheels.forEach(wheel => {
      wheel.contact = false;
      const wPos = wheel.worldPos(car);

      surfaces.forEach(line => {
        const hit = this._raycastWheel(wPos, cfg.wheelRadius, line);
        if (hit) {
          wheel.contact = true;
          wheel.contactNormal = hit.normal;
          wheel.contactPoint = hit.point;
          wheel.suspensionComp = Math.min(1, Math.max(0, hit.penetration / (cfg.wheelRadius * 0.6)));

          // Turbo Boost Pad trigger
          if (line.isBoost) {
            car.vel.x += (line.boostPower || 32) * dt * 4;
            car.boostTime = 0.6;
          }

          // Bounce Pad trigger
          if (line.isBounce) {
            car.vel.y = Math.max(car.vel.y, (line.bouncePower || 16));
            car.bounceTime = 0.4;
          }

          // Push car out of ground
          car.pos.x += hit.normal.x * hit.penetration;
          car.pos.y += hit.normal.y * hit.penetration;

          // Relative velocity calculation
          const r = wPos.sub(car.pos);
          let vSurface = new Vec2();
          if (line.movingPlatform) {
            vSurface.x = line.movingPlatform.vx;
          }

          const vRel = new Vec2(
            car.vel.x - car.angVel * r.y - vSurface.x,
            car.vel.y + car.angVel * r.x - vSurface.y
          );

          const vN = vRel.dot(hit.normal);
          if (vN < 0) {
            const j = -(1 + car.restitution) * vN * car.mass * 0.55;
            const imp = hit.normal.scale(j);
            car.vel.x += imp.x * car.invM;
            car.vel.y += imp.y * car.invM;
            car.angVel += (r.x * imp.y - r.y * imp.x) * car.invI;
          }

          // Tangent & Ground Friction
          const tang = new Vec2(hit.normal.y, -hit.normal.x);
          const vT = vRel.dot(tang);
          const fricMultiplier = (this.driveForce === 0) ? 1.6 : cfg.friction; // stronger drag when released
          const fric = -vT * fricMultiplier * car.mass * 0.5;
          const fImp = tang.scale(fric * dt);
          car.vel.x += fImp.x * car.invM;
          car.vel.y += fImp.y * car.invM;
          car.angVel += (r.x * fImp.y - r.y * fImp.x) * car.invI;

          // Forward / Reverse drive force along surface ONLY when pressed
          if (this.driveForce !== 0) {
            const fwdTang = tang.x < 0 ? tang.scale(-1) : tang;
            const driveDir = this.driveForce > 0 ? fwdTang : fwdTang.scale(-1);
            const forceMag = Math.abs(this.driveForce);
            const driveImp = driveDir.scale(forceMag * dt * car.invM);
            car.vel.x += driveImp.x;
            car.vel.y += driveImp.y;
          }

          // Brake force — heavy deceleration when brake is active
          if (this.brakeForce > 0) {
            const brakeFric = -vT * 4.5 * car.mass * 0.5;
            const brakeImp = tang.scale(brakeFric * dt);
            car.vel.x += brakeImp.x * car.invM;
            car.vel.y += brakeImp.y * car.invM;
            car.angVel += (r.x * brakeImp.y - r.y * brakeImp.x) * car.invI;
            // Also dampen linear velocity directly
            car.vel.x *= Math.pow(0.92, dt * 60);
            car.vel.y *= Math.pow(0.96, dt * 60);
          }

          // Transfer weight onto see-saws
          if (line.seeSaw) {
            const offset = wPos.x - line.seeSaw.pivot.x;
            line.seeSaw.applyTorque(car.mass * Math.abs(this.gravity) * offset * 0.15, dt);
          }

          // Visual spin
          wheel.spin += (vT / cfg.wheelRadius) * dt;
        }
      });

      if (!wheel.contact) {
        wheel.suspensionComp = Math.max(0, wheel.suspensionComp - dt * 6);
      }
    });

    // Crash detection (Driver head touches ground or spinner obstacle)
    const headLocal = new Vec2(cfg.headOffset.x, cfg.headOffset.y);
    const headWorld = car.pos.add(headLocal.rot(car.angle));
    let crashed = false;

    surfaces.forEach(line => {
      const hit = this._raycastWheel(headWorld, cfg.headRadius, line);
      if (hit) crashed = true;
    });

    // Check spinner blades hitting car or driver head
    this.spinners.forEach(sp => {
      const arms = sp.getSegments();
      arms.forEach(arm => {
        const dHead = this._distPointToSeg(headWorld, arm.a, arm.b);
        if (dHead < cfg.headRadius + 0.2) crashed = true;

        const dBody = this._distPointToSeg(car.pos, arm.a, arm.b);
        if (dBody < cfg.bodyHeight * 0.8) {
          // Push car back or crash if too violent
          car.vel.x -= 8;
          car.vel.y += 4;
          car.angVel -= 5;
        }
      });
    });

    // Fall out of world
    if (car.pos.y < -7) crashed = true;

    return { crashed };
  }

  _raycastWheel(center, radius, line) {
    const ab = line.b.sub(line.a);
    const ac = center.sub(line.a);
    const lenSq = ab.dot(ab);
    if (lenSq === 0) return null;
    const t = Math.max(0, Math.min(1, ac.dot(ab) / lenSq));
    const closest = line.a.add(ab.scale(t));
    const dist = center.sub(closest).len();

    if (dist < radius) {
      let normal = line.normal ? line.normal.clone() : center.sub(closest).norm();
      if (normal.dot(center.sub(closest)) < 0) {
        normal.x *= -1; normal.y *= -1;
      }
      return {
        normal,
        point: closest,
        penetration: radius - dist
      };
    }
    return null;
  }

  _distPointToSeg(p, a, b) {
    const ab = b.sub(a);
    const ap = p.sub(a);
    const lenSq = ab.dot(ab);
    if (lenSq === 0) return ap.len();
    const t = Math.max(0, Math.min(1, ap.dot(ab) / lenSq));
    const closest = a.add(ab.scale(t));
    return p.sub(closest).len();
  }
}

window.PhysicsWorld = PhysicsWorld;
window.Vec2 = Vec2;
