import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\views\IndustrialView.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r'<div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">[\s\S]*?</div>\s*</div>',
    re.MULTILINE
)

replacement = """<div className="w-full sm:w-auto relative min-w-[200px]">
          <Filter className="w-4 h-4 text-[#8d6e63] absolute left-3 top-2.5" />
          <select
            value={selectedPackaging}
            onChange={(e) => setSelectedPackaging(e.target.value)}
            className="w-full appearance-none bg-[#f3ece0] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-10 text-xs font-semibold text-[#4a3224] focus:outline-none focus:border-[#b05d2e] focus:bg-[#fdfaf5] cursor-pointer"
          >
            {packagingFilters.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8d6e63]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>"""

new_content = pattern.sub(replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done")
