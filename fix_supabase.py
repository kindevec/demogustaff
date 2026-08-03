import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\lib\supabase.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken curly braces
content = re.sub(r"// Local storage helpers\n\};\n\n\};\n", "// Local storage helpers\n", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("supabase.ts fixed")
