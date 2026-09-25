#!/usr/bin/env python3
import os
import zipfile
import sys

def make_project_zip():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    output_public = os.path.join(root_dir, 'public')
    os.makedirs(output_public, exist_ok=True)
    zip_filename = os.path.join(output_public, 'farmers-friend-codebase.zip')
    
    # Excluded directories and file patterns
    excluded_dirs = {
        'node_modules',
        '.git',
        'dist',
        '.cache',
        '.next',
        '.output',
        'build',
        '__pycache__'
    }
    
    excluded_extensions = {
        '.zip',
        '.tar',
        '.gz',
        '.pyc'
    }
    
    excluded_files = {
        'farmers-friend-codebase.zip'
    }
    
    print(f"Packaging project from {root_dir} into {zip_filename}...")
    
    file_count = 0
    with zipfile.ZipFile(zip_filename, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for current_dir, dirs, files in os.walk(root_dir):
            # Modify dirs in-place to avoid descending into excluded directories
            dirs[:] = [d for d in dirs if d not in excluded_dirs and not d.startswith('.git')]
            
            for file in files:
                if file in excluded_files:
                    continue
                ext = os.path.splitext(file)[1].lower()
                if ext in excluded_extensions:
                    continue
                if file.startswith('.') and file not in ['.env.example', '.gitignore']:
                    continue
                    
                full_path = os.path.join(current_dir, file)
                rel_path = os.path.relpath(full_path, root_dir)
                
                # Double check not inside excluded dir
                parts = rel_path.split(os.sep)
                if any(p in excluded_dirs for p in parts):
                    continue
                    
                zipf.write(full_path, arcname=os.path.join('farmers-friend-platform', rel_path))
                file_count += 1
                
    file_size_kb = os.path.getsize(zip_filename) / 1024.0
    print(f"Successfully packaged {file_count} files ({file_size_kb:.2f} KB) into {zip_filename}")
    return zip_filename

if __name__ == '__main__':
    make_project_zip()
