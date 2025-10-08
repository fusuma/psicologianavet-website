# Vercel Environment Variables Setup

## Issue: 500 Error on Production Form Submission

The 500 error is caused by **missing environment variables** in your Vercel deployment.

## Required Environment Variables

You need to set these variables in your Vercel project settings:

### 1. Brevo API Configuration

```
BREVO_API_KEY=your-brevo-api-key-from-dashboard
BREVO_TUTORS_LIST_ID=2
BREVO_VETS_LIST_ID=3
```

**Get your API key from:**
1. Log into https://app.brevo.com
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Copy your existing key or create a new one

### 2. Google Analytics (Optional)

```
NEXT_PUBLIC_GA_ID=G-K40B0PGVWH
```

### 3. Bot Detection (Optional - uses defaults if not set)

```
BOT_MIN_FORM_TIME_MS=2000
BOT_MAX_FORM_TIME_MS=3600000
BOT_MIN_INTERACTIONS=2
BOT_REQUIRE_FOCUS=true
BOT_REQUIRE_MOUSE=true
BOT_HONEYPOT_ENABLED=true
BOT_LOGGING_ENABLED=true
BOT_LOG_LEVEL=warn
```

### 4. Admin API Token (Optional)

```
ADMIN_API_TOKEN=GZzHXzlw+3oHw7gmpMOPFc9o3dNfAr0xOn8EgQuRYjk=
```

## How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: **psicologianavet-website**
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `BREVO_API_KEY`)
   - **Value**: Variable value (from above)
   - **Environments**: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. **Redeploy** your project for changes to take effect

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add BREVO_API_KEY production
# Paste your Brevo API key when prompted

vercel env add BREVO_TUTORS_LIST_ID production
# Enter: 2

vercel env add BREVO_VETS_LIST_ID production
# Enter: 3

vercel env add NEXT_PUBLIC_GA_ID production
# Enter: G-K40B0PGVWH

# Repeat for preview and development environments if needed
```

### Method 3: Bulk Import via `.env` File

1. Create a file named `vercel-env.txt` with your variables:

```
BREVO_API_KEY=your-brevo-api-key-here
BREVO_TUTORS_LIST_ID=2
BREVO_VETS_LIST_ID=3
NEXT_PUBLIC_GA_ID=G-K40B0PGVWH
BOT_LOGGING_ENABLED=true
BOT_LOG_LEVEL=warn
ADMIN_API_TOKEN=your-admin-token-here
```

2. Use Vercel CLI to import:

```bash
vercel env pull
# Then manually copy from vercel-env.txt to dashboard
```

## Verify Setup

After setting environment variables and redeploying:

1. Check Vercel deployment logs for errors:
   - Go to **Deployments** → Select latest deployment → **View Function Logs**

2. If you see this error:
   ```
   Missing required environment variables: BREVO_API_KEY, BREVO_TUTORS_LIST_ID, BREVO_VETS_LIST_ID
   ```
   Then environment variables are not set correctly.

3. Test form submission on production:
   - Go to https://www.psicologianavet.com.br/vets
   - Submit form with valid email
   - Check browser console for errors
   - Check Vercel function logs

## Security Notes

⚠️ **Important**: Never commit `.env.local` or production credentials to Git!

- `.env.local` is already in `.gitignore`
- Use Vercel's encrypted environment variable storage
- Rotate API keys if accidentally exposed

## Troubleshooting

### Forms still return 500 error after setting variables

1. **Redeploy required**: Changing env vars requires a new deployment
   - Go to **Deployments** → Select latest → Click **Redeploy**

2. **Check variable names**: They are case-sensitive
   - Must be exactly: `BREVO_API_KEY` (not `brevo_api_key`)

3. **Check Brevo API key validity**:
   - Log into https://app.brevo.com
   - Go to **Settings** → **SMTP & API** → **API Keys**
   - Verify key is active and not expired

4. **Check Brevo list IDs**:
   - Go to **Contacts** → **Lists**
   - Click on "Tutors" list → Check URL: `.../list/2` (ID is 2)
   - Click on "Vets" list → Check URL: `.../list/3` (ID is 3)

### How to view detailed error logs

1. Go to Vercel Dashboard → **Deployments**
2. Select latest deployment
3. Click **View Function Logs**
4. Look for errors containing "subscribe" or "validation"

The new error logging will show:
```
Unexpected subscription error: {
  name: 'Error',
  message: 'Missing required environment variables: BREVO_API_KEY',
  stack: '...'
}
```

## Next Steps

1. ✅ Set environment variables in Vercel dashboard
2. ✅ Redeploy project
3. ✅ Test form submission on production
4. ✅ Monitor Vercel function logs for errors
5. ✅ Check Brevo dashboard for new subscribers

---

**Need Help?**

- Vercel Environment Variables Docs: https://vercel.com/docs/concepts/projects/environment-variables
- Brevo API Documentation: https://developers.brevo.com/
- Project Documentation: `docs/bot-detection-quick-reference.md`
