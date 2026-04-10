import os
import re

files_to_update = [
  'app/portal/trainer/stable/page.tsx',
  'app/portal/shop/page.tsx',
  'app/portal/shop/actions.ts',
  'app/portal/owner/trend/page.tsx',
  'app/login/actions.ts',
  'app/onboarding/be-kit/actions.ts',
  'app/api/export/history/route.ts'
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add next/headers if needed
    if 'next/headers' not in content and 'import { cookies }' not in content:
        content = re.sub(
            r"import \{ createClient \} from '@/utils/supabase/server'",
            "import { createClient } from '@/utils/supabase/server'\nimport { cookies } from 'next/headers'",
            content
        )

    # Replace createClient() logic
    # With await
    content = re.sub(
        r"^(\s*)const supabase = await createClient\(\)",
        r"\g<1>const cookieStore = await cookies()\n\g<1>const supabase = createClient(cookieStore)",
        content,
        flags=re.MULTILINE
    )
    # Without await
    content = re.sub(
        r"^(\s*)const supabase = createClient\(\)",
        r"\g<1>const cookieStore = await cookies()\n\g<1>const supabase = createClient(cookieStore)",
        content,
        flags=re.MULTILINE
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")
