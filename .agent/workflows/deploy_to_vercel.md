---
description: Deploy the NakTech Next.js application to Vercel
---

# Deploy to Vercel

Vercel is the creators of Next.js and provides the best hosting experience for it with zero configuration.

## Prerequisites
- A GitHub account (recommended) or Vercel account.
- The project pushed to a GitHub repository.

## Steps

1. **Push to GitHub**
   If you haven't already, initialize a git repo and push your code to GitHub.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on GitHub, then:
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Sign up/Login to Vercel**
   Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.

3. **Import Project**
   - Click "Add New..." -> "Project".
   - Select "Continue with GitHub".
   - Find your `naktech` (or `antigravity-ide-testing`) repository and click "Import".

4. **Configure Project**
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
   - **Environment Variables**: Add any if needed (none for this basic version).

5. **Deploy**
   - Click "Deploy".
   - Vercel will build your project and assign a live URL (e.g., `naktech.vercel.app`).

## Alternative: Vercel CLI
You can also deploy directly from the terminal:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run deploy command:
   ```bash
   vercel
   ```
   Follow the prompts to link your project and deploy.
