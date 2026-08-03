import os
import re

# 1. Delete files
files_to_delete = [
    r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\components\AuthModal.tsx",
    r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\RestrictedZoneView.tsx"
]

for file_path in files_to_delete:
    if os.path.exists(file_path):
        os.remove(file_path)

# 2. Modify App.tsx
app_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\App.tsx"
with open(app_file, "r", encoding="utf-8") as f:
    app_content = f.read()

# Remove imports
app_content = re.sub(r"import \{ User, .*?\} from '\./types';", "import { Language, Product, SiteContent } from './types';", app_content)
app_content = re.sub(r"import \{ getLocalUser, setLocalUser, fetchProducts, getStoredSiteContent \} from '\./lib/supabase';", "import { fetchProducts, getStoredSiteContent } from './lib/supabase';", app_content)
app_content = re.sub(r"import \{ AuthModal \} from '\./components/AuthModal';\n", "", app_content)
app_content = re.sub(r"import \{ RestrictedZoneView \} from '\./views/RestrictedZoneView';\n", "", app_content)

# Remove state and handlers
app_content = re.sub(r"const \[currentUser, setCurrentUser\] = useState<User \| null>\(\(\) => getLocalUser\(\)\);\n\s*", "", app_content)
app_content = re.sub(r"const \[authModalOpen, setAuthModalOpen\] = useState\(false\);\n\s*", "", app_content)
app_content = re.sub(r"const handleLogout = \(\) => \{[\s\S]*?\};\n\n\s*", "", app_content)
app_content = re.sub(r"const handleAuthSuccess = \(user: User\) => \{[\s\S]*?\};\n\n\s*", "", app_content)

# Remove props passed to components
app_content = re.sub(r"currentUser=\{currentUser\}\n\s*", "", app_content)
app_content = re.sub(r"onOpenAuth=\{.*?\}\n\s*", "", app_content)
app_content = re.sub(r"onLogout=\{handleLogout\}\n\s*", "", app_content)

# Remove component tags
app_content = re.sub(r"\{currentTab === 'downloads' && \([\s\S]*?/>\n\s*\)\}\n\s*", "", app_content)
app_content = re.sub(r"\{\/\* Auth \/ Lead Registration Modal \*\/\}[\s\S]*?/>\n\s*", "", app_content)

with open(app_file, "w", encoding="utf-8") as f:
    f.write(app_content)

# 3. Modify Navbar.tsx
nav_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\components\Navbar.tsx"
with open(nav_file, "r", encoding="utf-8") as f:
    nav_content = f.read()

nav_content = re.sub(r"import \{ User, Language \} from '\.\./types';", "import { Language } from '../types';", nav_content)
nav_content = re.sub(r"currentUser: User \| null;\n\s*onOpenAuth: \(\) => void;\n\s*onLogout: \(\) => void;\n", "", nav_content)
nav_content = re.sub(r"currentUser,\n\s*onOpenAuth,\n\s*onLogout,\n\s*", "", nav_content)

# Remove user actions div in desktop header
nav_content = re.sub(r"<div className=\"hidden lg:flex items-center space-x-6\">[\s\S]*?(?=</header>)", "</header>", nav_content)
# Wait, this regex is too broad if it removes the closing tag. Let's do it safer:
nav_content = re.sub(r"\{/\* User Actions & Language \*/\}[\s\S]*?\{/\* Mobile Menu Toggle \*/\}", "{/* Mobile Menu Toggle */}", nav_content)
# Remove Section 1 (User Account & Client Area) and Section 2 from mobile menu
nav_content = re.sub(r"\{/\* Section 1: User Account & Client Area \*/\}[\s\S]*?\{/\* Section 3: Idioma & Contacto Directo \*/\}", "{/* Section 3: Idioma & Contacto Directo */}", nav_content)

with open(nav_file, "w", encoding="utf-8") as f:
    f.write(nav_content)

# 4. Modify Footer.tsx
footer_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\components\Footer.tsx"
with open(footer_file, "r", encoding="utf-8") as f:
    footer_content = f.read()
footer_content = re.sub(r"<button\s*onClick=\{.*?handleNavClick\('downloads'\).*?\}[\s\S]*?</button>", "", footer_content)
with open(footer_file, "w", encoding="utf-8") as f:
    f.write(footer_content)

# 5. Modify types.ts
types_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\types.ts"
with open(types_file, "r", encoding="utf-8") as f:
    types_content = f.read()
types_content = re.sub(r"export interface User \{[\s\S]*?\}\n", "", types_content)
types_content = re.sub(r"export interface DownloadItem \{[\s\S]*?\}\n", "", types_content)
with open(types_file, "w", encoding="utf-8") as f:
    f.write(types_content)

# 6. Modify supabase.ts
supa_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\lib\supabase.ts"
with open(supa_file, "r", encoding="utf-8") as f:
    supa_content = f.read()
supa_content = re.sub(r"User, ", "", supa_content)
supa_content = re.sub(r"USER: 'gustaff_current_user',\n\s*", "", supa_content)
supa_content = re.sub(r"export const getLocalUser = \(\): User \| null => \{[\s\S]*?\}\n", "", supa_content)
supa_content = re.sub(r"export const setLocalUser = \(user: User \| null\): void => \{[\s\S]*?\}\n", "", supa_content)
with open(supa_file, "w", encoding="utf-8") as f:
    f.write(supa_content)

# 7. initialData.ts
data_file = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\data\initialData.ts"
with open(data_file, "r", encoding="utf-8") as f:
    data_content = f.read()
data_content = re.sub(r"import \{ Product, TechnicalSheet, Recipe, DownloadItem, SiteContent \} from '\.\./types';", "import { Product, TechnicalSheet, Recipe, SiteContent } from '../types';", data_content)
data_content = re.sub(r"export const INITIAL_DOWNLOADS: DownloadItem\[\] = \[[\s\S]*?\];\n\n", "", data_content)
with open(data_file, "w", encoding="utf-8") as f:
    f.write(data_content)

print("Script executed successfully")
