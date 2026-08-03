import os
import re

def process_file(file_path, replacements):
    if not os.path.exists(file_path):
        return
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    for pat, rep in replacements:
        content = re.sub(pat, rep, content)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

base_dir = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src"

# 1. ProductDetailModal.tsx
process_file(os.path.join(base_dir, "components", "ProductDetailModal.tsx"), [
    (r"\s*onOpenAuth: \(\) => void;", ""),
    (r"\s*onOpenAuth,", ""),
    (r"<button\s*onClick=\{\(\) => \{\s*onClose\(\);\s*onOpenAuth\(\);\s*\}\}[\s\S]*?</button>", "")
])

# 2. HomeView.tsx
process_file(os.path.join(base_dir, "views", "HomeView.tsx"), [
    (r"\s*onOpenAuth: \(\) => void;", ""),
    (r"\s*onOpenAuth,", ""),
    (r"onOpenAuth=\{onOpenAuth\}", ""),
    (r"onOpenAuth=\{\(\) => onOpenAuth\(\)\}", ""),
])

# 3. ProductsView.tsx
process_file(os.path.join(base_dir, "views", "ProductsView.tsx"), [
    (r"\s*onOpenAuth: \(\) => void;", ""),
    (r"\s*onOpenAuth,", ""),
    (r"onOpenAuth=\{onOpenAuth\}", ""),
    (r"onOpenAuth=\{\(\) => onOpenAuth\(\)\}", ""),
])

# 4. IndustrialView.tsx
process_file(os.path.join(base_dir, "views", "IndustrialView.tsx"), [
    (r"\s*onOpenAuth: \(\) => void;", ""),
    (r"\s*onOpenAuth,", ""),
    (r"onOpenAuth=\{onOpenAuth\}", ""),
    (r"onOpenAuth=\{\(\) => onOpenAuth\(\)\}", ""),
])

# 5. App.tsx (Ensure it's fully cleaned up from onOpenAuth passed to ProductDetailModal)
process_file(os.path.join(base_dir, "App.tsx"), [
    (r"onOpenAuth=\{.*?\}\n\s*", ""),
])

print("onOpenAuth references removed.")
