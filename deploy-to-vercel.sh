#!/bin/bash

echo "🚀 Deploying to Vercel..."
echo ""
echo "This will deploy your app to: https://app-topaz-seven-83.vercel.app"
echo ""

# Check if logged in
echo "1️⃣ Checking Vercel authentication..."
npx vercel whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "   ⚠️  Not logged in to Vercel"
    echo "   Running: vercel login"
    echo ""
    npx vercel login
fi

echo ""
echo "2️⃣ Deploying to production..."
echo ""

# Deploy to production
npx vercel --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be live at:"
echo "   https://app-topaz-seven-83.vercel.app/rain-drop-cleanse"
echo ""
echo "📋 Test these URLs:"
echo "   - Main: https://app-topaz-seven-83.vercel.app/"
echo "   - Rain Drop Cleanse: https://app-topaz-seven-83.vercel.app/rain-drop-cleanse"
echo "   - Clear My Mind: https://app-topaz-seven-83.vercel.app/clear-my-mind"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
