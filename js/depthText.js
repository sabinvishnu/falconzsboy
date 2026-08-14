function initDepthText(options = {}) {
  const {
    selector = '#depth-text',
    text = 'FALCONZ BOY',
    layers = 34,
    depth = 2.4,
    faceColor = '#ffffff',
    depthColor = '#d4af37',
    tilt = 7.5,
    pointerTracking = true,
    smoothing = 0.14,
    perspective = 900,
    autoOrbit = true,
    orbitSpeed = 0.35,
    fontSize = 'clamp(1.8rem, 9.5vw, 13.5rem)',
    fontWeight = 900,
    shadow = true
  } = options;

  const root = document.querySelector(selector);
  if (!root) return null;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, 64);
  const safeDepth = clamp(Number(depth) || 0, 0, 12);
  const safeTilt = clamp(Number(tilt) || 0, 0, 12);
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);

  const baseRotation = { x: -safeTilt * 0.32, y: safeTilt * 0.42 };

  function getLayerColor(fColor, dColor, index, total) {
    const progress = total <= 1 ? 1 : index / total;
    const eased = progress * progress;
    const faceMix = Math.round((1 - eased) * 72 + 4);
    return `color-mix(in srgb, ${fColor} ${faceMix}%, ${dColor})`;
  }

  // Set CSS Custom Properties on root
  root.style.setProperty('--depth-text-perspective', `${safePerspective}px`);
  root.style.setProperty('--depth-text-font-size', fontSize);
  root.style.setProperty('--depth-text-font-weight', fontWeight);
  root.style.setProperty('--depth-text-face-color', faceColor);
  root.style.setProperty('--depth-text-depth-color', depthColor);
  if (shadow) {
    root.style.setProperty(
      '--depth-text-shadow',
      `0 22px 34px color-mix(in srgb, ${depthColor} 36%, transparent), 0 4px 8px rgba(0, 0, 0, 0.28)`
    );
  } else {
    root.style.setProperty('--depth-text-shadow', 'none');
  }

  // Build HTML DOM structure
  const stage = document.createElement('span');
  stage.className = 'depth-text__stage';

  for (let layerIndex = 0; layerIndex < safeLayers; layerIndex++) {
    const index = safeLayers - layerIndex;
    const layer = document.createElement('span');
    layer.className = 'depth-text__layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.color = getLayerColor(faceColor, depthColor, index, safeLayers);
    layer.style.transform = `translateZ(${-index * safeDepth}px)`;
    layer.textContent = text;
    stage.appendChild(layer);
  }

  const face = document.createElement('span');
  face.className = 'depth-text__face';
  face.textContent = text;
  stage.appendChild(face);

  root.innerHTML = '';
  root.appendChild(stage);

  // Motion and Tracking logic
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const canTrackPointer = pointerTracking && finePointer && !reducedMotion;

  let frameId = 0;
  let activePointer = false;
  let startTime = performance.now();
  const current = { ...baseRotation };
  const target = { ...baseRotation };

  function applyTransform() {
    stage.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
  }

  if (reducedMotion) {
    applyTransform();
    return null;
  }

  function handlePointerMove(event) {
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    activePointer = true;
    const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
    const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);

    target.x = baseRotation.x - y * safeTilt;
    target.y = baseRotation.y + x * safeTilt;
  }

  function handlePointerLeave() {
    activePointer = false;
    target.x = baseRotation.x;
    target.y = baseRotation.y;
  }

  if (canTrackPointer) {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
  }

  function tick(now) {
    if ((!canTrackPointer || !activePointer) && autoOrbit) {
      const elapsed = (now - startTime) / 1000;
      const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;
      const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
      target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;
      target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;
    }

    current.x += (target.x - current.x) * safeSmoothing;
    current.y += (target.y - current.y) * safeSmoothing;
    applyTransform();
    frameId = requestAnimationFrame(tick);
  }

  applyTransform();
  frameId = requestAnimationFrame(tick);

  return function destroy() {
    if (canTrackPointer) {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    }
    cancelAnimationFrame(frameId);
  };
}
