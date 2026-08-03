import re
import os

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\AdminView.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add View Imports
imports = """import { HomeView } from './HomeView';
import { AboutView } from './AboutView';
import { ContactView } from './ContactView';
"""
content = re.sub(r'(import React.*?\n)', r'\1' + imports, content, count=1)

# 2. Add 'Eye' to lucide-react imports if not there
if 'Eye' not in content:
    content = re.sub(r'X,(\s*)LogOut,', r'Eye,\n    X,\1LogOut,', content)

# 3. Add state
state_code = "\n    const [previewView, setPreviewView] = useState<'home' | 'about' | 'contact' | null>(null);\n"
content = re.sub(r'(const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\);)', r'\1' + state_code, content)

# 4. Add Preview Buttons to Sections
# Section 1
btn1 = """
                        <button type="button" onClick={() => setPreviewView('home')} className="ml-auto flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Previsualizar
                        </button>"""
content = re.sub(r'(<span className="w-2 h-2 rounded-full bg-amber-500"></span>\s*P.*?gina de Inicio\s*)</h3>', r'\1' + btn1 + '\n                      </h3>', content)

# Section 2
btn2 = """
                        <button type="button" onClick={() => setPreviewView('about')} className="ml-auto flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Previsualizar
                        </button>"""
content = re.sub(r'(<span className="w-2 h-2 rounded-full bg-amber-500"></span>\s*Identidad Corporativa\s*)</h3>', r'\1' + btn2 + '\n                      </h3>', content)

# Section 3
btn3 = """
                        <button type="button" onClick={() => setPreviewView('contact')} className="ml-auto flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Previsualizar
                        </button>"""
content = re.sub(r'(<span className="w-2 h-2 rounded-full bg-amber-500"></span>\s*P.*?gina de Contacto\s*)</h3>', r'\1' + btn3 + '\n                      </h3>', content)

# 5. Add Modal before the last </div>
modal_code = """
      {/* Live Preview Modal */}
      {previewView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-[1400px] h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                Previsualización en Vivo: {previewView === 'home' ? 'Inicio' : previewView === 'about' ? 'Nosotros' : 'Contacto'}
              </h3>
              <button 
                type="button"
                onClick={() => setPreviewView(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm font-semibold"
              >
                Cerrar <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
              <div className="w-full">
                {previewView === 'home' && (
                  <HomeView 
                    products={products} 
                    lang="es" 
                    siteContent={siteContent}
                    onSelectProduct={() => {}}
                    onNavigate={() => {}}
                  />
                )}
                {previewView === 'about' && (
                  <AboutView 
                    lang="es" 
                    siteContent={siteContent}
                  />
                )}
                {previewView === 'contact' && (
                  <ContactView 
                    lang="es" 
                    siteContent={siteContent}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
"""
content = re.sub(r'(    </div>\n  \);\n};\n)$', modal_code + r'\1', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modifications applied.")
