import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\AdminView.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace("Product, Prospect, ContactSubmission, SiteContent, Language", "Product, SiteContent, Language")
content = re.sub(r'\s*getLocalProspects,\s*getLocalContactSubmissions,', '', content)
content = re.sub(r',\s*fetchProspects,\s*fetchMessages\s*', '\n', content)

# 2. useEffect loadData
content = re.sub(r'setProspects\(await fetchProspects\(\)\);\s*setMessages\(await fetchMessages\(\)\);', '', content)

# 3. getActiveTab / state
content = content.replace("return parts[1] as 'prospects' | 'products' | 'content' | 'messages';", "return parts[1] as 'products' | 'content';")
content = content.replace("return 'prospects';", "return 'products';")
content = content.replace("<'prospects' | 'products' | 'content' | 'messages'>", "<'products' | 'content'>")
content = content.replace("tab: 'prospects' | 'products' | 'content' | 'messages'", "tab: 'products' | 'content'")

# 4. State vars
content = re.sub(r"const \[prospects, setProspects\] = useState<Prospect\[\]>\(\(\) => getLocalProspects\(\)\);\s*const \[messages, setMessages\] = useState<ContactSubmission\[\]>\(\(\) => getLocalContactSubmissions\(\)\);\s*", "", content)
content = re.sub(r"const \[prospectSearch, setProspectSearch\] = useState\(''\);\s*", "", content)

# 5. handleExportCSV
content = re.sub(r"const handleExportCSV = \(\) => \{[\s\S]*?document\.body\.removeChild\(link\);\s*\};\s*", "", content)

# 6. handleRefreshData
# It has: setProspects(await fetchProspects()); setMessages(await fetchMessages());
# This will be replaced by #2 as well, but just in case:
content = re.sub(r'setProspects\(await fetchProspects\(\)\);\s*setMessages\(await fetchMessages\(\)\);', '', content)

# 7. filteredProspects
content = re.sub(r"const filteredProspects = prospects\.filter\(p =>[\s\S]*?\}\);\s*", "", content)
content = re.sub(r"const filteredProspects = prospects\.filter\(p =>[\s\S]*?p\.company_phone\.toLowerCase\(\)\.includes\(prospectSearch\.toLowerCase\(\)\)\s*\);\s*", "", content)

# 8. tabs
content = re.sub(r"\{ id: 'prospects', label: 'Prospectos / Leads', icon: Users, badge: prospects\.length \},\s*", "", content)
content = re.sub(r",\s*\{ id: 'messages', label: 'Mensajes Recibidos', icon: MessageSquare, badge: messages\.length \}", "", content)

# 9. JSX
content = re.sub(r"\{\/\* TAB: PROSPECTS \*\/\}[\s\S]*?\{\/\* TAB: PRODUCTS \*\/\}", "{/* TAB: PRODUCTS */}", content)
content = re.sub(r"\{\/\* TAB: MESSAGES \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Mobile Bottom", "</div>\n        </div>\n\n        {/* Mobile Bottom", content)

# 10. Bottom Navigation Bar
content = content.replace("t.id === 'prospects' ? 'Leads' : t.id === 'products' ? 'Catálogo' : t.id === 'content' ? 'Textos' : 'Buzón'", "t.id === 'products' ? 'Catálogo' : 'Textos'")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
