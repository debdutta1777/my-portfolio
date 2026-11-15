const nearPlane = .6;
const farPlane = 280;
const focalDistance = 12;

const bend = (distance: number) => Math.sin(distance / 27) + .38 * Math.sin(distance / 57 + .8);

export function createPerspectiveRoad(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return null;

  let width = 1;
  let height = 1;
  let distance = 0;
  let cameraBend = 0;
  let roadPaint: CanvasGradient;

  function measure() {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context!.setTransform(ratio, 0, 0, ratio, 0, 0);
    roadPaint = context!.createLinearGradient(0, height * .45, 0, height);
    roadPaint.addColorStop(0, '#e0ca9c04');
    roadPaint.addColorStop(1, '#a88b5930');
  }

  function project(depth: number, offset = 0) {
    const perspective = focalDistance / (focalDistance + depth);
    const curve = (bend(distance + depth) - cameraBend) * .32;
    return {
      x: width * (.46 + (curve + offset) * perspective),
      y: height * (.49 + .57 * perspective),
      perspective,
    };
  }

  const samples = Array.from({ length: 68 }, (_, index) =>
    nearPlane * (farPlane / nearPlane) ** (index / 67));

  function draw(position: number) {
    distance = position;
    cameraBend = bend(distance);
    const ctx = context!;
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const left = samples.map((depth) => project(depth, -.36));
    const right = samples.map((depth) => project(depth, .36));
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    left.slice(1).forEach(({ x, y }) => ctx.lineTo(x, y));
    right.slice().reverse().forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fillStyle = roadPaint;
    ctx.fill();

    ctx.strokeStyle = '#7d69529c';
    ctx.lineWidth = 1.05;
    for (const edge of [left, right]) {
      ctx.beginPath();
      ctx.moveTo(edge[0].x, edge[0].y);
      edge.slice(1).forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.stroke();
    }

    const stripeSpacing = 9;
    const firstStripe = Math.ceil((position + nearPlane) / stripeSpacing) * stripeSpacing;
    for (let world = firstStripe; world < position + farPlane; world += stripeSpacing) {
      const depth = world - position;
      const start = project(depth);
      const end = project(depth + 3.75);
      ctx.strokeStyle = '#80694ea6';
      ctx.lineWidth = .55 + start.perspective * 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    const postSpacing = 22;
    const firstPost = Math.ceil((position + nearPlane) / postSpacing) * postSpacing;
    for (let world = firstPost; world < position + 185; world += postSpacing) {
      for (const offset of [-.395, .395]) {
        const { x, y, perspective } = project(world - position, offset);
        ctx.strokeStyle = '#8d755967';
        ctx.lineWidth = .5 + perspective;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height * .038 * perspective);
        ctx.stroke();
      }
    }
  }

  return { measure, draw, project };
}
