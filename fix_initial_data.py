import re

file_path = r"c:\Users\mkmcm\AA Miyako\DevEC\Trabajos Kindev\Gustaff\demogustaff\src\data\initialData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# The products appended to INITIAL_RECIPES start with:
# ,\n  {\n    id: 'prod-13',
# Let's find this pattern and slice the file

split_pattern = re.search(r'\n,\n  {\n    id: \'prod-13\',', content)
if not split_pattern:
    split_pattern = re.search(r',\n  {\n    id: \'prod-13\',', content)

if split_pattern:
    start_index = split_pattern.start()
    
    # We also need to remove the trailing '];' from the end of the file that closes INITIAL_RECIPES.
    end_of_file = content.rfind('];')
    
    misplaced_products_str = content[start_index:end_of_file]
    
    # Clean up the recipes block by closing it properly before the split
    recipes_fixed = content[:start_index] + '\n];\n'
    
    # Now, find the end of INITIAL_PRODUCTS
    end_of_products = recipes_fixed.find('\n];\n\nexport const INITIAL_TECHNICAL_SHEETS')
    
    if end_of_products != -1:
        # Insert the misplaced products BEFORE the `\n];` of INITIAL_PRODUCTS
        final_content = (
            recipes_fixed[:end_of_products] 
            + misplaced_products_str 
            + recipes_fixed[end_of_products:]
        )
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(final_content)
            print("Successfully fixed initialData.ts")
    else:
        print("Could not find end of INITIAL_PRODUCTS")
else:
    print("Could not find prod-13 inside INITIAL_RECIPES")
