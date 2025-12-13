# Hosting Research for polyomino-calendar

## Objective
Research static hosting options for rainydan.com to host the polyomino calendar puzzle game.

## Summary
For a static website project like polyomino-calendar, the three primary options are:

1. **GitHub Pages** - Free, basic
2. **Netlify** - Free tier available, more features
3. **Vercel** - Free tier available, optimized for modern JavaScript frameworks

## Detailed Comparison

### GitHub Pages
- **Cost**: Free
- **Best for**: Basic static sites directly from GitHub repos
- **Limitations**: 
  - Limited build features (10 builds per hour)
  - No deploy previews or custom rollbacks
  - No form handling or asset optimization
  - Limited static site generator support
- **HTTPS**: Yes, automatic with custom domains
- **CI/CD**: Basic - watches branch and deploys automatically

### Netlify
- **Free Tier**: 
  - Build limits: 3 builds per minute
  - Bandwidth: Included
  - Functions: Limited
  - Custom domains with HTTPS: Yes
- **Paid Plans**: 
  - Personal: $9/month
  - Pro: $20/month per team member
- **Features**:
  - Deploy previews for every branch
  - 1-click rollbacks
  - Asset optimization
  - Form handling built-in
  - Serverless functions support
  - Edge functions
  - Analytics (7-30 days depending on plan)
  - Drag-and-drop deployment
- **Build System**: Flexible - accepts custom build commands and output directories

### Vercel
- **Free Tier (Hobby)**:
  - Build and deployment included
  - Global CDN
  - HTTPS automatic
  - Web Application Firewall
  - Custom domains
- **Paid Plans**:
  - Pro: $20/month + usage costs
  - Enterprise: Custom pricing
- **Features**:
  - Optimized for Next.js/modern frameworks
  - Edge functions
  - ISR (Incremental Static Regeneration)
  - Advanced observability and analytics
  - Team collaboration features
  - Performance monitoring
- **Best for**: React, Next.js, and modern JavaScript frameworks

### Cloudflare Pages
- **Cost**: Free
- **Features**: Built-in authentication, analytics, Workers for serverless functions
- **Note**: Mentioned as competitive alternative with solid free tier

## Recommendation for polyomino-calendar

Given that polyomino-calendar is:
- A static HTML/JavaScript application
- Using vanilla JavaScript (not a framework like React)
- Requiring simple hosting with custom domain support
- Potentially needing future analytics

**Recommended Choice: Netlify Free Tier**

### Why Netlify:
1. Excellent free tier with good build limits
2. Deploy previews for testing before production
3. Drag-and-drop deployment option available
4. Better asset optimization than GitHub Pages
5. Potential to add serverless functions later if daily puzzle rotation needs backend
6. More straightforward DNS setup compared to GitHub Pages
7. 1-click rollbacks if needed
8. Easy upgrade path if traffic grows (Pro plan at $20/month)

### Alternative: Vercel
- If we later decide to use Next.js for enhanced functionality
- Better if we need advanced performance monitoring
- Slightly better for modern framework optimization

### Deployment Flow
1. Connect GitHub repo to Netlify
2. Configure custom domain (rainydan.com) with DNS
3. Set up HTTPS/SSL (automatic)
4. Configure build command and output directory
5. Each push to main triggers automatic deployment

## Cost Analysis
For a hobby/portfolio project with low traffic:
- **Netlify Free**: $0/month (300 credits limit - sufficient for hobby traffic)
- **GitHub Pages**: $0/month (very limited features)
- **Vercel Hobby**: $0/month (good option, but Netlify's free tier is more feature-rich)

## Decision: GitHub Pages (Chosen)

**Rationale**: Since the project is already hosted on GitHub, GitHub Pages was the pragmatic choice for quick deployment with minimal setup. The simplicity of having deployment integrated directly with the repository outweighed the feature advantages of Netlify or Vercel.

**Implementation**: Project is now live on GitHub Pages.

## Next Steps
1. Research DNS setup for rainydan.com domain
2. Evaluate deployment automation / CI-CD needs
3. Assess HTTPS/SSL certificate requirements
4. Plan daily puzzle rotation mechanism (may affect backend needs)
