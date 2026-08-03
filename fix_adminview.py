import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\AdminView.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tabs = ["""

content = content.replace("  const tabs = [", replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
