# SEO Investigation & Improvement Plan

## Overview
This document captures findings from SEO investigations conducted on the polyomino-calendar GitHub Pages site to improve search rankings for the target keyword "polyomino calendar".

## Current State
- **GitHub repo ranks well**: https://github.com/rainydan/polyomino-calendar
- **GitHub Pages needs improvement**: https://rainydan.github.io/polyomino-calendar/
- **Goal**: Make the interactive game page rank well in search results

---

## Investigation 1: Core Web Vitals & Mobile Usability
**Task**: polyomino-calendar-9af | **Status**: ✓ Closed

### Findings

#### Largest Contentful Paint (LCP) - **GOOD**
- Minimal content footprint (canvas-based rendering)
- No large images or heavy assets
- Expected status: Excellent

#### Cumulative Layout Shift (CLS) - **GOOD**
- Fixed layout structure with flexbox
- No dynamic content injection causing layout shift
- Expected status: Excellent

#### Interaction to Next Paint (INP) - **GOOD**
- Canvas interactions are immediate
- Rotation/flip operations synchronous
- No apparent debouncing or delays
- Expected status: Excellent

### Positive Code Factors
- Vanilla HTML/CSS/JS (no framework overhead)
- Minimal external dependencies
- Efficient canvas rendering for 2D graphics
- LocalStorage for persistence (no network calls)
- Mobile viewport meta tag present
- Responsive flexbox layout

### Minor Improvement Opportunities
- JavaScript/CSS not minified (low impact given small file size)
- Could enhance touch interactions on mobile
- No explicit performance monitoring in place

### Baseline Assessment
- **Expected Lighthouse Score**: 85-95/100
- **Mobile Friendly**: Yes
- **Core Web Vitals**: Likely all passing
- **No critical performance blockers detected**

---

## Investigation 2: Keyword Rankings & Search Visibility
**Task**: polyomino-calendar-jmw | **Status**: ✓ Closed

### Current Ranking Status

#### The GitHub Pages Page Likely:
- ✓ IS indexed by Google
- ✗ Does NOT rank as high as the repo
- ✗ May not appear in top 10 for "polyomino calendar"
- ⚠️ Unknown exact placement (need Search Console to verify)

### Ranking Barriers

**1. Subdomain Disadvantage**
- GitHub Pages hosted on shared `*.github.io` subdomain
- Shared infrastructure dilutes link juice
- Lower domain authority (~40-50) vs custom domains (~60+)

**2. Missing Metadata**
- No meta description = lower CTR from search results
- No Open Graph tags = no social signals
- No structured data/schema = no rich snippets

**3. No Backlinks**
- All existing links point to GitHub repo, not the page
- Page has zero external authority

**4. Limited Internal Signals**
- No header hierarchy optimization
- Limited keyword placement in visible content

### Competitive Landscape
- "Polyomino calendar" is a niche keyword (low competition)
- User already owns repo ranking
- GitHub Pages version has room to rank

### Keyword Opportunities

**Primary Target** (already targeted):
- "polyomino calendar"

**Secondary Keywords** (untapped):
- "polyomino puzzle"
- "calendar puzzle game"
- "date puzzle"
- "calendar game"
- "polypuzzle"

### Recommended Actions by Impact

**High Impact (Implemented)**
- ✓ Add meta description → improves CTR
- ✓ Add Open Graph tags → social signals
- [ ] Add schema markup → enables rich results
- [ ] Custom domain → major long-term boost

**Medium Impact**
- [ ] Optimize header hierarchy
- [ ] Improve keyword placement in content
- [ ] Add internal linking strategy

**Low Impact (Nice to Have)**
- [ ] Backlink outreach to puzzle/game blogs
- [ ] Content expansion (tips, strategies)

### Baseline Metrics to Track (Post-GSC Setup)
- Impressions for "polyomino calendar"
- Click-through rate (CTR) from SERPs
- Average position tracking
- Mobile vs Desktop ranking differences
- New keywords capturing traffic

---

## SEO Improvements Completed

### P0 - Critical (Completed)
- [x] polyomino-calendar-94i: Meta description added (157 chars)
- [x] polyomino-calendar-dl7: Open Graph tags added (og:title, og:description, og:url, og:type, twitter:card)

### P1 - Important (Ready)
- [ ] polyomino-calendar-7w7: Schema.org structured data for Game content type
- [ ] polyomino-calendar-5qo: Canvas alt text and accessible description

### P0 - Setup (Ready)
- [ ] polyomino-calendar-3oz: Set up Google Search Console for tracking

### P1 - Infrastructure (Blocked by other tasks)
- [ ] polyomino-calendar-6z0: Research custom domain setup (rainydan.com)

### P2 - Content & Outreach (Blocked by P1)
- [ ] polyomino-calendar-3nf: Expand content with game tips and strategies
- [ ] polyomino-calendar-2ch: Create backlink outreach list

### P3 - Audits (Lower priority)
- [ ] polyomino-calendar-61a: Audit and optimize header hierarchy
- [ ] polyomino-calendar-02u: Investigate header tag optimization
- [ ] polyomino-calendar-cpz: Investigate backlink profile

---

## Key Insights

1. **The page is likely indexed** but underperforming due to metadata gaps and no backlinks
2. **Meta tags are quick wins** that will improve CTR without changing the page itself
3. **Custom domain is strategic** but complex (requires DNS setup, domain purchase)
4. **Content expansion helps** but is secondary to technical SEO fixes
5. **Backlinks matter most** for competitive keywords, but this is niche so less critical

## Next Steps

1. **Immediately**: Implement Google Search Console tracking (task 3oz)
2. **This week**: Add Schema markup and accessibility improvements (P1 tasks)
3. **This month**: Set up custom domain research if budget/time allows
4. **Ongoing**: Monitor GSC metrics, track ranking changes monthly
