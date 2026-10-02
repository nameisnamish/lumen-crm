# 🚀 Deployment Guide

## 1. Environment Variables Configuration
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

## 2. Production Build Execution
```bash
npm run build
```
This outputs optimized production bundle static files into the `dist/` directory.

## 3. Hosting Options
- **Vercel / Netlify**: Connect GitHub repository and deploy `dist/` build output.
- **Docker / NGINX**: Serve static `dist/` bundle behind an NGINX container.
