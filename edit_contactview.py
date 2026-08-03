import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\ContactView.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove import
content = re.sub(r"import \{ saveContactSubmission \} from '\.\./lib/supabase';\s*", "", content)

# Replace the saveContactSubmission call with a sleep
content = re.sub(r"await saveContactSubmission\(\{ name, email, subject, message \}\);", "await new Promise(resolve => setTimeout(resolve, 800));", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
