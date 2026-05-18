import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

const DEFAULT_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop', alt: 'Abstract art' },
  { src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop', alt: 'Modern sculpture' },
  { src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop', alt: 'Digital artwork' },
  { src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop', alt: 'Contemporary art' },
  { src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop', alt: 'Geometric pattern' },
  { src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop', alt: 'Textured surface' },
  { src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large', alt: 'Social media image' }
];

const DEFAULTS = { maxVerticalRotationDeg: 5, dragSensitivity: 20, enlargeTransitionMs: 300, segments: 35 };
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => { const a = (((deg + 180) % 360) + 360) % 360; return a - 180; };
const getDataNumber = (el, name, fallback) => { const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`); const n = attr == null ? NaN : parseFloat(attr); return Number.isFinite(n) ? n : fallback; };

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];
  const coords = xCols.flatMap((x, c) => { const ys = c % 2 === 0 ? evenYs : oddYs; return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 })); });
  const totalSlots = coords.length;
  if (pool.length === 0) return coords.map(c => ({ ...c, src: '', alt: '' }));
  const normalizedImages = pool.map(image => typeof image === 'string' ? { src: image, alt: '' } : { src: image.src || '', alt: image.alt || '' });
  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);
  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) { const tmp = usedImages[i]; usedImages[i] = usedImages[j]; usedImages[j] = tmp; break; }
      }
    }
  }
  return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  return { rotateX: unit * (offsetY - (sizeY - 1) / 2), rotateY: unit * (offsetX + (sizeX - 1) / 2) };
}

export default function DomeGallery({ images = DEFAULT_IMAGES, fit = 0.5, fitBasis = 'auto', minRadius = 600, maxRadius = Infinity, padFactor = 0.25, overlayBlurColor = '#120F17', maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg, dragSensitivity = DEFAULTS.dragSensitivity, enlargeTransitionMs = DEFAULTS.enlargeTransitionMs, segments = DEFAULTS.segments, dragDampening = 2, openedImageWidth = '400px', openedImageHeight = '400px', imageBorderRadius = '30px', openedImageBorderRadius = '30px', grayscale = true }) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const cancelTapRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const pointerTypeRef = useRef('mouse');
  const tapTargetRef = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const scrollLockedRef = useRef(false);
  const lockedRadiusRef = useRef(null);

  const lockScroll = useCallback(() => { if (scrollLockedRef.current) return; scrollLockedRef.current = true; document.body.classList.add('dg-scroll-lock'); }, []);
  const unlockScroll = useCallback(() => { if (!scrollLockedRef.current) return; if (rootRef.current?.getAttribute('data-enlarging') === 'true') return; scrollLockedRef.current = false; document.body.classList.remove('dg-scroll-lock'); }, []);
  const items = useMemo(() => buildItems(images, segments), [images, segments]);
  const applyTransform = (xDeg, yDeg) => { const el = sphereRef.current; if (el) el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`; };

  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect; const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), maxDim = Math.max(w, h), aspect = w / h;
      let basis; switch (fitBasis) { case 'min': basis = minDim; break; case 'max': basis = maxDim; break; case 'width': basis = w; break; case 'height': basis = h; break; default: basis = aspect >= 1.3 ? w : minDim; }
      let radius = basis * fit; radius = Math.min(radius, h * 1.35); radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${Math.max(8, Math.round(minDim * padFactor))}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root); return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius, openedImageWidth, openedImageHeight]);

  useEffect(() => { applyTransform(rotationRef.current.x, rotationRef.current.y); }, []);
  const stopInertia = useCallback(() => { if (inertiaRAF.current) { cancelAnimationFrame(inertiaRAF.current); inertiaRAF.current = null; } }, []);

  const startInertia = useCallback((vx, vy) => {
    const MAX_V = 1.4; let vX = clamp(vx, -MAX_V, MAX_V) * 80; let vY = clamp(vy, -MAX_V, MAX_V) * 80; let frames = 0;
    const d = clamp(dragDampening ?? 0.6, 0, 1); const frictionMul = 0.94 + 0.055 * d; const stopThreshold = 0.015 - 0.01 * d; const maxFrames = Math.round(90 + 270 * d);
    const step = () => { vX *= frictionMul; vY *= frictionMul; if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF.current = null; return; } if (++frames > maxFrames) { inertiaRAF.current = null; return; } const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg); const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200); rotationRef.current = { x: nextX, y: nextY }; applyTransform(nextX, nextY); inertiaRAF.current = requestAnimationFrame(step); };
    stopInertia(); inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  useGesture({
    onDragStart: ({ event }) => { if (focusedElRef.current) return; stopInertia(); pointerTypeRef.current = event.pointerType || 'mouse'; if (pointerTypeRef.current === 'touch') event.preventDefault(); if (pointerTypeRef.current === 'touch') lockScroll(); draggingRef.current = true; cancelTapRef.current = false; movedRef.current = false; startRotRef.current = { ...rotationRef.current }; startPosRef.current = { x: event.clientX, y: event.clientY }; tapTargetRef.current = event.target.closest?.('.item__image') || null; },
    onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
      if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
      if (pointerTypeRef.current === 'touch') event.preventDefault();
      const dxTotal = event.clientX - startPosRef.current.x; const dyTotal = event.clientY - startPosRef.current.y;
      if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) movedRef.current = true;
      const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = startRotRef.current.y + dxTotal / dragSensitivity;
      rotationRef.current = { x: nextX, y: nextY }; applyTransform(nextX, nextY);
      if (last) {
        draggingRef.current = false; let isTap = false;
        if (startPosRef.current) { const dx = event.clientX - startPosRef.current.x; const dy = event.clientY - startPosRef.current.y; const TAP = pointerTypeRef.current === 'touch' ? 10 : 6; if (dx*dx+dy*dy <= TAP*TAP) isTap = true; }
        let [vMagX, vMagY] = velArr; const [dirX, dirY] = dirArr; let vx2 = vMagX*dirX, vy2 = vMagY*dirY;
        if (!isTap && Math.abs(vx2)<0.001 && Math.abs(vy2)<0.001 && Array.isArray(movement)) { vx2=(movement[0]/dragSensitivity)*0.02; vy2=(movement[1]/dragSensitivity)*0.02; }
        if (!isTap && (Math.abs(vx2)>0.005||Math.abs(vy2)>0.005)) startInertia(vx2, vy2);
        startPosRef.current = null; cancelTapRef.current = !isTap;
        if (isTap && tapTargetRef.current && !focusedElRef.current) openItemFromElement(tapTargetRef.current);
        tapTargetRef.current = null; if (cancelTapRef.current) setTimeout(()=>(cancelTapRef.current=false),120);
        if (movedRef.current) lastDragEndAt.current = performance.now(); movedRef.current = false;
        if (pointerTypeRef.current === 'touch') unlockScroll();
      }
    }
  }, { target: mainRef, eventOptions: { passive: false } });

  useEffect(() => {
    const scrim = scrimRef.current; if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current; if (!el) return;
      const parent = el.parentElement; const overlay = viewerRef.current?.querySelector('.enlarge'); if (!overlay) return;
      const refDiv = parent.querySelector('.item__image--reference'); const originalPos = originalTilePositionRef.current;
      if (!originalPos) { overlay.remove(); if (refDiv) refDiv.remove(); parent.style.setProperty('--rot-y-delta','0deg'); parent.style.setProperty('--rot-x-delta','0deg'); el.style.visibility=''; el.style.zIndex=0; focusedElRef.current=null; rootRef.current?.removeAttribute('data-enlarging'); openingRef.current=false; return; }
      const currentRect = overlay.getBoundingClientRect(); const rootRect = rootRef.current.getBoundingClientRect();
      const origRel = { left: originalPos.left-rootRect.left, top: originalPos.top-rootRect.top, width: originalPos.width, height: originalPos.height };
      const overlayRel = { left: currentRect.left-rootRect.left, top: currentRect.top-rootRect.top, width: currentRect.width, height: currentRect.height };
      const anim = document.createElement('div'); anim.className='enlarge-closing';
      anim.style.cssText = `position:absolute;left:${overlayRel.left}px;top:${overlayRel.top}px;width:${overlayRel.width}px;height:${overlayRel.height}px;z-index:9999;border-radius:${openedImageBorderRadius};overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;filter:${grayscale?'grayscale(1)':'none'};`;
      const origImg = overlay.querySelector('img'); if (origImg) { const img2 = origImg.cloneNode(); img2.style.cssText='width:100%;height:100%;object-fit:contain;'; anim.appendChild(img2); }
      overlay.remove(); rootRef.current.appendChild(anim); void anim.getBoundingClientRect();
      requestAnimationFrame(()=>{ anim.style.left=origRel.left+'px'; anim.style.top=origRel.top+'px'; anim.style.width=origRel.width+'px'; anim.style.height=origRel.height+'px'; anim.style.opacity='0'; });
      const cleanup = () => { anim.remove(); originalTilePositionRef.current=null; if(refDiv)refDiv.remove(); parent.style.setProperty('--rot-y-delta','0deg'); parent.style.setProperty('--rot-x-delta','0deg'); el.style.visibility=''; el.style.zIndex=0; focusedElRef.current=null; rootRef.current?.removeAttribute('data-enlarging'); openingRef.current=false; if(!draggingRef.current) document.body.classList.remove('dg-scroll-lock'); };
      anim.addEventListener('transitionend', cleanup, {once:true});
    };
    scrim.addEventListener('click', close);
    const onKey = e => { if(e.key==='Escape') close(); };
    window.addEventListener('keydown', onKey);
    const onScroll = () => { if (focusedElRef.current) close(); };
    window.addEventListener('scroll', onScroll, true);
    const onTouchOutside = (e) => { if (focusedElRef.current && !e.target.closest('.enlarge')) close(); };
    window.addEventListener('pointerdown', onTouchOutside);
    return () => { scrim.removeEventListener('click', close); window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('pointerdown', onTouchOutside); };
  }, [enlargeTransitionMs, openedImageBorderRadius, grayscale]);

  const openItemFromElement = el => {
    if (openingRef.current) return; openingRef.current = true; openStartedAtRef.current = performance.now(); lockScroll();
    const parent = el.parentElement; focusedElRef.current = el;
    const offsetX = getDataNumber(parent,'offsetX',0); const offsetY = getDataNumber(parent,'offsetY',0);
    const sizeX = getDataNumber(parent,'sizeX',2); const sizeY = getDataNumber(parent,'sizeY',2);
    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY = normalizeAngle(parentRot.rotateY); const globalY = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360; if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;
    parent.style.setProperty('--rot-y-delta', `${rotY}deg`); parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
    const refDiv = document.createElement('div'); refDiv.className = 'item__image item__image--reference opacity-0';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv); void refDiv.offsetHeight;
    const tileR = refDiv.getBoundingClientRect(); const mainR = mainRef.current?.getBoundingClientRect(); const frameR = frameRef.current?.getBoundingClientRect();
    if (!mainR || !frameR || tileR.width <= 0) { openingRef.current=false; focusedElRef.current=null; parent.removeChild(refDiv); unlockScroll(); return; }
    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = 'hidden'; el.style.zIndex = 0;
    const overlay = document.createElement('div'); overlay.className = 'enlarge';
    overlay.style.cssText = `position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(0.3);width:${openedImageWidth||'70vw'};height:${openedImageHeight||'75vh'};opacity:0;z-index:9999;will-change:transform,opacity;transform-origin:center center;transition:transform ${enlargeTransitionMs}ms ease,opacity ${enlargeTransitionMs}ms ease;border-radius:${openedImageBorderRadius};overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);`;
    const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
    const img = document.createElement('img'); img.src = rawSrc; img.alt = parent.dataset.alt||'';
    img.style.cssText = `width:100%;height:100%;object-fit:contain;filter:${grayscale?'grayscale(1)':'none'};`;
    overlay.appendChild(img); viewerRef.current.appendChild(overlay);
    setTimeout(()=>{ if(!overlay.parentElement) return; overlay.style.opacity='1'; overlay.style.transform='translate(-50%,-50%) scale(1)'; rootRef.current?.setAttribute('data-enlarging','true'); }, 16);
    if (openedImageWidth || openedImageHeight) {
      // Size already set via fixed positioning - no resize needed
    }
  };

  useEffect(() => { return () => { document.body.classList.remove('dg-scroll-lock'); }; }, []);

  const cssStyles = `.sphere-root{--radius:520px;--viewer-pad:72px;--circ:calc(var(--radius) * 3.14);--rot-y:calc((360deg / var(--segments-x)) / 2);--rot-x:calc((360deg / var(--segments-y)) / 2);--item-width:calc(var(--circ) / var(--segments-x));--item-height:calc(var(--circ) / var(--segments-y))}.sphere-root *{box-sizing:border-box}.sphere,.sphere-item,.item__image{transform-style:preserve-3d}.stage{width:100%;height:100%;display:grid;place-items:center;position:absolute;inset:0;margin:auto;perspective:calc(var(--radius) * 2);perspective-origin:50% 50%}.sphere{transform:translateZ(calc(var(--radius) * -1));will-change:transform;position:absolute}.sphere-item{width:calc(var(--item-width) * var(--item-size-x));height:calc(var(--item-height) * var(--item-size-y));position:absolute;top:-999px;bottom:-999px;left:-999px;right:-999px;margin:auto;transform-origin:50% 50%;backface-visibility:hidden;transition:transform 300ms;transform:rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) translateZ(var(--radius))}.sphere-root[data-enlarging="true"] .scrim{opacity:1 !important;pointer-events:all !important}@media(max-aspect-ratio:1/1){.viewer-frame{height:auto !important;width:100% !important}}.item__image{position:absolute;inset:10px;border-radius:var(--tile-radius, 12px);overflow:hidden;cursor:pointer;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform 300ms;pointer-events:auto;-webkit-transform:translateZ(0);transform:translateZ(0)}.item__image--reference{position:absolute;inset:10px;pointer-events:none}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div ref={rootRef} className="sphere-root relative w-full h-full" style={{'--segments-x': segments, '--segments-y': segments, '--overlay-blur-color': overlayBlurColor, '--tile-radius': imageBorderRadius, '--enlarge-radius': openedImageBorderRadius, '--image-filter': grayscale ? 'grayscale(1)' : 'none'}}>
        <main ref={mainRef} className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent" style={{touchAction:'none',WebkitUserSelect:'none'}}>
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div key={`${it.x},${it.y},${i}`} className="sphere-item absolute m-auto" data-src={it.src} data-alt={it.alt} data-offset-x={it.x} data-offset-y={it.y} data-size-x={it.sizeX} data-size-y={it.sizeY} style={{'--offset-x': it.x, '--offset-y': it.y, '--item-size-x': it.sizeX, '--item-size-y': it.sizeY, top:'-999px', bottom:'-999px', left:'-999px', right:'-999px'}}>
                  <div className="item__image absolute block overflow-hidden cursor-pointer bg-gray-200 transition-transform duration-300" role="button" tabIndex={0} aria-label={it.alt||'Open image'}
                    onClick={e=>{if(draggingRef.current||movedRef.current||openingRef.current)return;if(performance.now()-lastDragEndAt.current<80)return;openItemFromElement(e.currentTarget);}}
                    onPointerUp={e=>{if(e.pointerType!=='touch')return;if(draggingRef.current||movedRef.current||openingRef.current)return;if(performance.now()-lastDragEndAt.current<80)return;openItemFromElement(e.currentTarget);}}
                    style={{inset:'10px',borderRadius:`var(--tile-radius, ${imageBorderRadius})`,backfaceVisibility:'hidden'}}>
                    <img src={it.src} draggable={false} alt={it.alt} className="w-full h-full object-cover pointer-events-none" style={{backfaceVisibility:'hidden',filter:`var(--image-filter, ${grayscale?'grayscale(1)':'none'})`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 m-auto z-[3] pointer-events-none" style={{backgroundImage:`radial-gradient(rgba(235,235,235,0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`}} />
          <div className="absolute inset-0 m-auto z-[3] pointer-events-none" style={{WebkitMaskImage:`radial-gradient(rgba(235,235,235,0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,maskImage:`radial-gradient(rgba(235,235,235,0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,backdropFilter:'blur(3px)'}} />
          <div className="absolute left-0 right-0 top-0 h-[120px] z-[5] pointer-events-none rotate-180" style={{background:`linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`}} />
          <div className="absolute left-0 right-0 bottom-0 h-[120px] z-[5] pointer-events-none" style={{background:`linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`}} />
          <div ref={viewerRef} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" style={{padding:'var(--viewer-pad)'}}>
            <div ref={scrimRef} className="scrim absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500" style={{background:'rgba(0,0,0,0.4)',backdropFilter:'blur(3px)'}} />
            <div ref={frameRef} className="viewer-frame h-full aspect-square flex" style={{borderRadius:`var(--enlarge-radius, ${openedImageBorderRadius})`}} />
          </div>
        </main>
      </div>
    </>
  );
}
