# Hosting Design for rainydan.com

## Overview
Design and architecture for serving the polyomino-calendar web app publicly at rainydan.com, allowing anyone to play the daily puzzle.

## Investigation Status
This document captures hosting decisions as we investigate the following areas:

- [ ] **polyomino-calendar-bkf**: Research hosting options (static hosting providers)
- [ ] **polyomino-calendar-tdo**: Domain configuration and DNS setup
- [ ] **polyomino-calendar-yat**: Deployment automation and CI/CD
- [ ] **polyomino-calendar-csp**: Daily puzzle rotation mechanism
- [ ] **polyomino-calendar-hp8**: HTTPS/SSL requirements

## Architecture Decisions

### 1. Hosting Provider
*(To be determined)*

Options to evaluate:
- Netlify (free tier, auto-deploy from git)
- Vercel (similar to Netlify)
- GitHub Pages (free, simpler setup)
- Traditional VPS/cloud server (full control, higher cost)

**Decision**: 

**Rationale**: 

### 2. Domain Setup
*(To be determined)*

The app will be served at: `https://rainydan.com`

Considerations:
- DNS configuration (A record, CNAME, or nameserver delegation)
- Domain registrar (where rainydan.com is currently registered)
- SSL/TLS certificate provisioning

**Decision**: 

**Rationale**: 

### 3. Daily Puzzle Rotation
*(To be determined)*

Current implementation uses client-side `Date.now()` for daily reset. Hosting considerations:

- Can the static HTML/JS serve the same puzzle to all users on a given calendar day?
- Do we need a backend API for puzzle generation or distribution?
- Should puzzles be pre-generated and served statically, or generated on-demand?

**Decision**: 

**Rationale**: 

### 4. Deployment Process
*(To be determined)*

How changes get from this repository to rainydan.com:

- Git push → automated deployment?
- Build step required (minification, bundling)?
- Where are assets served from?

**Decision**: 

**Rationale**: 

### 5. HTTPS/SSL
*(To be determined)*

Considerations:
- Let's Encrypt (free, auto-renewal)
- Provider-managed certificates
- Browser compatibility

**Decision**: 

**Rationale**: 

## Implementation Checklist
- [ ] Set up hosting provider account
- [ ] Configure domain DNS to point to hosting provider
- [ ] Set up automated deployment from GitHub
- [ ] Test daily puzzle rotation across different timezones
- [ ] Verify HTTPS is working
- [ ] Test from public internet
- [ ] Set up monitoring/error tracking (optional)

## Related Tasks
- polyomino-calendar-499: Timezone handling for daily reset
