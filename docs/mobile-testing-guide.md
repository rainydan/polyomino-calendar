# Mobile Testing Guide

Internal procedures for testing mobile experience across devices, browsers, and orientations.

## Minimum Device Targets

### iOS
- **iPhone SE (2nd gen)** — 375px width, older hardware, limited RAM
- **iPhone 12/13/14/15** — 390px width (standard modern iPhone)
- **iPad (9-inch)** — Tablet landscape/portrait testing

### Android
- **Pixel 5/6** — 393px width (reference device)
- **Samsung Galaxy A Series** — ~360px width (budget device)
- **Android tablet** — Landscape/portrait testing
- **Minimum spec**: Android 11+, 2GB RAM or higher

## Browser Matrix

| Browser | iOS | Android | Testing Priority |
|---------|-----|---------|------------------|
| Safari | ✓ (default) | - | High (iOS only) |
| Chrome | ✓ | ✓ | High (most used) |
| Firefox | - | ✓ | Medium |
| Samsung Internet | - | ✓ | Medium (Samsung devices) |

## Viewport Sizes to Test

### Phone Breakpoints
- **320px** — Very small phones (edge case)
- **360px** — Budget Android phones (Galaxy A series)
- **375px** — iPhone SE, iPhone 11
- **390px** — iPhone 12+ standard width
- **412px** — Pixel 6/7/8 standard width

### Tablet Breakpoints
- **480px** — Small tablet in portrait
- **768px** — Standard tablet in portrait
- **1024px** — iPad in landscape

## Testing Checklist

### Layout & Rendering
- [ ] Canvas scales appropriately without excessive scrolling
- [ ] Piece tray fits on screen without horizontal scroll
- [ ] Control buttons are clearly visible and accessible
- [ ] Text is readable without zooming
- [ ] No content hidden behind notches or status bar (safe areas applied)
- [ ] Layout adapts smoothly on orientation change

### Touch Interactions
- [ ] Piece selection by tap works
- [ ] Piece placement by drag works
- [ ] Rotation via swipe left/rotation button works
- [ ] Flip via swipe up/flip button works
- [ ] Long-press actions work (if implemented)
- [ ] Touch targets meet 44×44px minimum

### Gesture Prevention
- [ ] Double-tap zoom does not interrupt gameplay
- [ ] Pinch zoom does not interrupt gameplay
- [ ] Browser back gesture does not occur during gameplay
- [ ] Accidental gestures don't cause unwanted actions

### Visual Feedback
- [ ] Piece selection shows visual feedback (border/background change)
- [ ] Piece placement feedback is visible (no hover flicker)
- [ ] Button active/focus states are visible on touch
- [ ] Invalid placements trigger visual feedback (shake animation)
- [ ] Win message displays clearly

### Performance
- [ ] Page loads in under 3 seconds on 4G
- [ ] Canvas rendering is smooth during gameplay (target 60fps)
- [ ] No lag when selecting/dragging pieces
- [ ] No stuttering during animations
- [ ] No console errors in DevTools

### Accessibility
- [ ] Touch targets are minimum 44×44px
- [ ] Focus indicators are visible when using keyboard navigation
- [ ] Canvas has aria-label for screen readers
- [ ] Noscript fallback message appears without JavaScript
- [ ] High contrast mode compatible (if tested)
- [ ] Screen reader can navigate controls (iOS VoiceOver, Android TalkBack)

### Orientation
- [ ] Portrait mode: full gameplay functionality
- [ ] Landscape mode: full gameplay functionality
- [ ] Orientation change mid-game: state preserved, layout re-flows
- [ ] No layout "flashing" on rotation

### Browser-Specific
- **iOS Safari**:
  - [ ] Viewport doesn't zoom unexpectedly
  - [ ] Safe area insets respected (notch, status bar)
  - [ ] VoiceOver can access game controls
  
- **Android Chrome**:
  - [ ] DPI scaling works on high-DPI devices
  - [ ] TalkBack can access game controls
  - [ ] No Chrome DevTools warnings

## Testing Procedure

### Quick Test (5 minutes)
1. Open game on phone
2. Select a piece and place it 2-3 times
3. Test rotation (swipe or button)
4. Test flip (swipe or button)
5. Rotate device and verify layout adjusts

### Comprehensive Test (15-20 minutes)
1. Run through entire Quick Test above
2. Test each device/browser combo from matrix
3. Verify all breakpoints (320px, 360px, 375px, 390px, 412px, 768px, 1024px)
4. Test both portrait and landscape
5. Complete at least one full puzzle
6. Check DevTools console for any errors
7. Test high-contrast mode (if supported)

### Performance Profiling
1. Open DevTools → Performance tab
2. Record touch interactions (piece selection, drag, placement)
3. Target 60fps on touch events
4. Look for long tasks or frame drops
5. Note any rendering bottlenecks (especially on low-end devices)

## Known Issues & Workarounds

None currently documented. Update as issues are discovered.

## Device Rental / Emulation

### Browser DevTools
- Chrome DevTools → Device Emulation (built-in)
- Firefox Developer Tools → Responsive Design Mode
- Safari → Develop → Enter Responsive Design Mode

### Cloud Services
- [BrowserStack](https://www.browserstack.com/) — Real device testing
- [Sauce Labs](https://saucelabs.com/) — Mobile device cloud
- [LambdaTest](https://www.lambdatest.com/) — Mobile device testing

### Local Emulation
- iOS: Xcode Simulator (macOS only)
- Android: Android Emulator or [Genymotion](https://www.genymotion.com/)

## Reporting Issues

When documenting issues found during testing:
- Device/browser/OS version
- Viewport size (from DevTools)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/video if applicable
- Console errors (if any)

Create a new issue with tag `mobile` and link to this guide.

## Future Enhancements

- Automated visual regression testing
- Continuous testing on real devices (cloud service integration)
- Touch performance benchmarking
- Accessibility automated audit integration
