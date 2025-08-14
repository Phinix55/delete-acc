# Supabase User Delete Tool

A secure web application for deleting user accounts from Supabase.

## Features
- Secure server-side handling of Supabase service role key
- User authentication verification before deletion
- Clean, responsive interface
- Environment variable configuration

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Other Platforms

This app can be deployed to any Node.js hosting platform like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## Security Notes

- The service role key is handled server-side only
- User credentials are verified before deletion
- Environment variables keep sensitive data secure
- All API endpoints include error handling

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep this secret!)
- `PORT`: Server port (optional, defaults to 3000)
