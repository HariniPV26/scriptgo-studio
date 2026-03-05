# How to Fix "Failed to fetch" Error

## Problem
The Supabase client cannot connect because environment variables are not loaded in the browser.

## Solution Steps

### 1. Stop All Node Processes
```powershell
taskkill /F /IM node.exe
```

### 2. Clear Browser Cache
- Open your browser DevTools (F12)
- Go to Application tab → Storage → Clear site data
- OR use Ctrl+Shift+R for hard refresh

### 3. Restart Dev Server
```bash
cd e:\ScriptGo
npm run dev
```

### 4. Check Environment Variables
- Once the server starts, open http://localhost:3000/login
- Look at the bottom-right corner for a black debug box
- It should show:
  - ✅ Supabase URL: https://jnoxfswftcbaihqlkzzc.supabase.co
  - ✅ Anon Key: SET

### 5. If Still Showing ❌ NOT SET
This means the environment variables are not being loaded. Try:

a) **Verify .env.local exists and has correct content:**
```bash
cat .env.local
```

b) **Make sure you're in the correct directory:**
```bash
pwd  # Should show e:\ScriptGo
```

c) **Try creating a .env file instead:**
```bash
copy .env.local .env
```

d) **Restart the dev server again:**
```bash
npm run dev
```

### 6. Test Signup
- Go to http://localhost:3000/login?tab=signup
- Fill in the form
- Click "Create Account"
- You should be redirected to /dashboard

## Common Issues

### Issue: Environment variables still not loading
**Solution:** Check if you have multiple .env files conflicting. Next.js loads them in this order:
1. `.env.local` (highest priority for local development)
2. `.env.development`
3. `.env`

### Issue: "Failed to fetch" persists
**Solution:** Check browser console (F12 → Console) for detailed error messages

### Issue: Supabase connection error
**Solution:** Verify your Supabase project is active at https://supabase.com/dashboard

## After Fixing
Once everything works, you can remove the debug component:
1. Delete `components/EnvDebug.tsx`
2. Remove the import and `<EnvDebug />` from `app/login/page.tsx`
