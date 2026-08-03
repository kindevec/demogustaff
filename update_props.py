import re

app_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\App.tsx"
with open(app_path, "r", encoding="utf-8") as f:
    app_content = f.read()

app_content = app_content.replace(
    "const [siteContent] = useState<SiteContent>(() => getStoredSiteContent());",
    "const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());\n  const refreshSiteContent = () => setSiteContent(getStoredSiteContent());"
)

app_content = app_content.replace(
    "<AdminView setCurrentTab={setCurrentTab} lang={lang} refreshProducts={loadProducts} products={products} />",
    "<AdminView setCurrentTab={setCurrentTab} lang={lang} refreshProducts={loadProducts} products={products} refreshSiteContent={refreshSiteContent} />"
)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_content)


admin_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\AdminView.tsx"
with open(admin_path, "r", encoding="utf-8") as f:
    admin_content = f.read()

admin_content = admin_content.replace(
    "  refreshProducts: () => void;\n  lang: Language;\n}",
    "  refreshProducts: () => void;\n  refreshSiteContent?: () => void;\n  lang: Language;\n}"
)

admin_content = admin_content.replace(
    "export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab, products, refreshProducts }) => {",
    "export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab, products, refreshProducts, refreshSiteContent }) => {"
)

admin_content = admin_content.replace(
    """  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    showNotice();
  };""",
    """  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    if (refreshSiteContent) refreshSiteContent();
    showNotice();
  };"""
)

with open(admin_path, "w", encoding="utf-8") as f:
    f.write(admin_content)

print("Props updated successfully!")
