#!/bin/bash
set -e
# Inject Supabase key into Vivas app.json
cd vivas-app
node -e "var f=require('fs'),j=JSON.parse(f.readFileSync('app.json','utf8'));j.expo.extra.supabaseAnonKey=process.env.VIVAS_SUPABASE_ANON_KEY||j.expo.extra.supabaseAnonKey;f.writeFileSync('app.json',JSON.stringify(j,null,2)+'\n')"
npm install
npx expo export --platform web
mkdir -p ../dist/vivas
cp -r dist/* ../dist/vivas/
cd ..
npm install
npm run build
