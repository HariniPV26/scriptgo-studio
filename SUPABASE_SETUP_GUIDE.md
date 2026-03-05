# Supabase Setup Guide - Getting Your URL and API Keys

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in with your account (or create one if you haven't)
3. You'll see your dashboard with all your projects

## Step 2: Select or Create a Project

### If You Already Have a Project:
- Click on your existing project from the dashboard
- The project name in your `.env.local` suggests it might be: `jnoxfswftcbaihqlkzzc`

### If You Need to Create a New Project:
1. Click **"New Project"** button
2. Fill in the details:
   - **Name**: ScriptGo (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`, `ap-south-1`)
   - **Pricing Plan**: Free tier is fine for development
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to initialize

## Step 3: Get Your API Keys and URL

Once your project is ready:

### Method 1: From Project Settings (Recommended)
1. Click on the **⚙️ Settings** icon in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see:

   ```
   Project URL
   https://xxxxxxxxxxxxx.supabase.co
   
   Project API keys
   ├── anon public (This is safe to use in a browser)
   │   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   │
   └── service_role (Keep this secret! Server-side only)
       eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Method 2: From Home Dashboard
1. Go to **Home** in the left sidebar
2. Scroll down to **"Connecting to your new project"**
3. You'll see the same URL and keys

## Step 4: Copy the Credentials

You need TWO things:

### 1. Project URL
- Look for: **"Project URL"** or **"API URL"**
- Format: `https://xxxxxxxxxxxxx.supabase.co`
- Example: `https://jnoxfswftcbaihqlkzzc.supabase.co`

### 2. Anon/Public Key
- Look for: **"anon public"** or **"anon key"**
- This is a long JWT token starting with `eyJ...`
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3hmc3dmdGNiYWlocWxrenpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDkyNTIsImV4cCI6MjA4MzQyNTI1Mn0.AE0e4HgN1FPbWnLeKkdBRveBW0NwKJC9UtzrMsm0un0`

## Step 5: Update Your .env.local File

1. Open `e:\ScriptGo\.env.local` in your editor
2. Update these two lines:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
```

3. **Important**: Replace:
   - `YOUR_PROJECT_ID` with your actual project ID
   - `YOUR_ACTUAL_KEY_HERE` with your actual anon key

## Step 6: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## Step 7: Verify It Works

1. Open `http://localhost:3000/login`
2. Check the debug box in the bottom-right corner
3. It should show:
   - ✅ Supabase URL: https://your-project.supabase.co
   - ✅ Anon Key: SET

## Visual Guide - Where to Find Keys

```
Supabase Dashboard
├── Left Sidebar
│   └── ⚙️ Settings
│       └── API
│           ├── 📋 Project URL: https://xxxxx.supabase.co
│           └── 🔑 API Keys
│               ├── anon public (Use this for NEXT_PUBLIC_SUPABASE_ANON_KEY)
│               └── service_role (Don't use in browser!)
```

## Important Notes

### ✅ DO:
- Use the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Keep your `.env.local` file in `.gitignore` (it already is)
- Restart your dev server after changing environment variables

### ❌ DON'T:
- Don't use the **service_role** key in your frontend code
- Don't commit `.env.local` to Git
- Don't share your keys publicly

## Troubleshooting

### "Project not found" error
- Your project might be paused (free tier pauses after inactivity)
- Go to your project dashboard and click "Restore" if needed

### "Invalid API key" error
- Make sure you copied the entire key (they're very long!)
- Check for extra spaces or line breaks
- Verify you're using the **anon** key, not the service_role key

### Environment variables not loading
- Make sure the variables start with `NEXT_PUBLIC_`
- Restart your dev server after changes
- Clear your browser cache (Ctrl+Shift+R)

## Example .env.local File

Here's what your complete `.env.local` should look like:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jnoxfswftcbaihqlkzzc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3hmc3dmdGNiYWlocWxrenpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDkyNTIsImV4cCI6MjA4MzQyNTI1Mn0.AE0e4HgN1FPbWnLeKkdBRveBW0NwKJC9UtzrMsm0un0

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyAw17QvysD_e49EZkc3yW9zPoGEGTbWGHc

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=harinivenkataramanan2219@gmail.com
SMTP_PASS="lksq dfmq zhro yhjz"
SMTP_FROM="ScriptGo Studio <harinivenkataramanan2219@gmail.com>"
```

## Need Help?

If you're still having issues:
1. Check if your Supabase project is active (not paused)
2. Verify the URL and key are copied correctly (no extra spaces)
3. Make sure you restarted the dev server
4. Check the browser console (F12) for detailed error messages

---

**Quick Checklist:**
- [ ] Logged into Supabase dashboard
- [ ] Found/created project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Updated .env.local
- [ ] Restarted dev server
- [ ] Verified in debug box
- [ ] Tested signup/login
