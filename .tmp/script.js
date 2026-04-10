const fs = require('fs');

const files = [
  'app/portal/trainer/stable/page.tsx',
  'app/portal/shop/page.tsx',
  'app/portal/shop/actions.ts',
  'app/portal/owner/trend/page.tsx',
  'app/login/actions.ts',
  'app/onboarding/be-kit/actions.ts',
  'app/api/export/history/route.ts'
];

for(const file of files) {
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf-8');
  
  if(!content.includes('@/utils/supabase/server')) {
     continue;
  }
  
  // Ensure we add next/headers if not present
  if (!content.includes('next/headers') && !content.includes('import { cookies }')) {
     content = content.replace(
       /import \{ createClient \} from '@\/utils\/supabase\/server'/g, 
       "import { createClient } from '@/utils/supabase/server'\nimport { cookies } from 'next/headers'"
     );
  }
  
  // Need to be careful. Match both combinations
  content = content.replace(/^(\s*)const supabase = await createClient\(\)/gm, '$1const cookieStore = await cookies()\n$1const supabase = createClient(cookieStore)');
  // And the ones without await:
  content = content.replace(/^(\s*)const supabase = createClient\(\)/gm, '$1const cookieStore = await cookies()\n$1const supabase = createClient(cookieStore)');

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}
