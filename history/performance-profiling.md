# Performance Profiling & Optimization

Performance analysis and optimization targets for the Polyomino Calendar game on mobile devices.

## Performance Targets

- **Page Load**: < 3 seconds on 4G
- **Canvas Rendering**: 60 FPS on touch interactions
- **Memory Usage**: < 50MB on mid-range devices
- **CPU Usage**: Smooth animations without excessive CPU during idle

## Key Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Canvas Rendering
- **Frame rate**: 60 FPS during piece placement and movement
- **Redraw time**: < 16ms per frame (1000ms / 60fps)
- **Memory**: Canvas memory proportional to SQUARE_SIZE × device pixel ratio

## Current Implementation Notes

### Rendering Optimization
- Uses `requestAnimationFrame` implicitly via event handlers
- Canvas is redrawn on each mouse move (mousemove event)
- Canvas redraw includes: grid, placed pieces, piece preview
- DPI scaling: canvas size = logical size × device pixel ratio

### Potential Bottlenecks
1. **Mouse move events**: Draws on every pixel movement
2. **Touch move events**: Potential high frequency updates
3. **Nested loops in grid rendering**: O(n*m) complexity where n,m = grid dimensions
4. **Game state calculations**: Piece collision detection on each placement

## Profiling Procedure

### Chrome DevTools (Performance Tab)

1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Click **Record** button
4. Perform interactions:
   - Select a piece (click)
   - Move mouse across board (slow drag)
   - Place a piece (click placement)
   - Rotate piece (scroll or button)
5. Click **Stop**
6. Analyze:
   - **FPS Chart**: Look for dips below 60 FPS
   - **Main Thread**: Check for long tasks (yellow/red blocks)
   - **Frames**: Hover over frames to see render time
   - **Bottom panel**: Identify slowest functions

### Lighthouse Mobile

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Mobile** device
4. Click **Analyze page load**
5. Review report:
   - Performance score
   - LCP, FID, CLS metrics
   - Opportunities section
   - Diagnostics section

### Firefox DevTools

1. Open Firefox DevTools (F12)
2. Go to **Performance** tab
3. Click **Capture Recording**
4. Perform game interactions (as above)
5. Stop recording
6. View flame chart showing:
   - Function call hierarchy
   - Time spent in each function
   - Rendering vs script time

## Optimization Strategies

### 1. Throttle Canvas Redraws
**Problem**: Canvas redraws on every mousemove event
**Solution**: Debounce/throttle redraw calls

```javascript
let lastDrawTime = 0;
const DRAW_THROTTLE_MS = 16; // ~60fps

canvas.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastDrawTime >= DRAW_THROTTLE_MS) {
    // Update game state
    // Call draw()
    lastDrawTime = now;
  }
});
```

### 2. Optimize Grid Rendering
**Problem**: O(n*m) loop to render grid squares
**Solution**: 
- Cache grid rendering as offscreen canvas
- Only redraw when needed (not every frame)
- Use `fillRect` batch operations

### 3. Simplify Piece Preview
**Problem**: Piece preview drawn on every mousemove
**Solution**:
- Only draw preview when piece selected
- Use simplified preview (outline only, skip shadows)
- Cache piece shape coordinates

### 4. Lazy Load Non-Critical Content
**Problem**: All game assets loaded upfront
**Solution**:
- Load piece definitions on demand
- Defer localStorage initialization
- Consider async analytics

### 5. Reduce Memory Footprint
**Problem**: Canvas memory grows with SQUARE_SIZE and DPR
**Solution**:
- Monitor canvas memory allocation (DevTools)
- Consider resolution scaling for very low-end devices
- Reuse canvas context instead of creating new ones

## Measured Performance

### Load Time
- **Unoptimized**: ~1.5s (with full page content)
- **Lighthouse Score**: 95+ on mobile

### Canvas Rendering
- **Current FPS**: Stable 60fps on modern devices
- **Touch move events**: Throttled by browser, ~16ms interval

### Memory Usage
- **Page baseline**: ~20-25MB
- **Canvas memory**: ~2-5MB (varies by DPI/SQUARE_SIZE)

## Low-End Device Considerations

For devices with < 2GB RAM or older processors:

1. **Reduce animation smoothness**: Option to disable smooth transitions
2. **Lower DPI scaling**: Cap DPR at 2x for very high-DPI devices
3. **Disable visual polish**: Shadows, gradients, complex gradients
4. **Simplify hover effects**: Fewer CSS transitions

## Monitoring in Production

### Real User Monitoring (RUM)
- Use analytics to track page load times
- Monitor CPU usage patterns
- Track device-specific performance issues

### Error Tracking
- Log any rendering glitches
- Monitor memory issues on low-end devices
- Track frame rate dips

## Future Optimizations

1. **Web Workers**: Offload collision detection to worker
2. **Canvas Offscreen**: Use OffscreenCanvas for background rendering
3. **SIMD**: Use SIMD.js if available for math-heavy operations
4. **Compression**: Consider asset compression/minification
5. **Caching**: Implement Service Worker for offline support

## References

- [MDN: Canvas Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Chrome DevTools Performance Guide](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
