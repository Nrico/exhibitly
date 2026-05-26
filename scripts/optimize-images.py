import os
from PIL import Image

def optimize_images():
    src_dir = '/Volumes/Blue/code/exhibitly/art'
    dest_dir = '/Volumes/Blue/code/exhibitly/public/images'
    
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"Created destination directory: {dest_dir}")
        
    images = [
        'hero_example.png',
        'home_detail.png',
        'home_detail1.png',
        'home_detail2.png'
    ]
    
    for filename in images:
        src_path = os.path.join(src_dir, filename)
        if not os.path.exists(src_path):
            print(f"Source file not found: {src_path}")
            continue
            
        print(f"\nProcessing {filename}...")
        img = Image.open(src_path)
        width, height = img.size
        print(f"Original dimensions: {width}x{height}")
        
        # Determine optimal scaling width
        # The hero visual is displayed at ~500px to ~600px width on screen.
        # To support high-DPI/Retina screens, a width of 1000px-1100px is perfect.
        target_width = 1100
        if width > target_width:
            ratio = target_width / float(width)
            target_height = int(float(height) * ratio)
            # Resize with Lanczos filtering for high quality
            img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            print(f"Resized to: {target_width}x{target_height}")
        else:
            img_resized = img
            print("No resizing needed (already under target width)")
            
        # Save as WebP (highly optimized format)
        base_name = os.path.splitext(filename)[0]
        webp_dest_path = os.path.join(dest_dir, f"{base_name}.webp")
        img_resized.save(webp_dest_path, 'WEBP', quality=85)
        webp_size = os.path.getsize(webp_dest_path)
        print(f"Saved optimized WebP: {webp_dest_path} ({webp_size / 1024:.1f} KB)")
        
        # Save as compressed PNG as well, just in case they are referenced exactly as .png
        png_dest_path = os.path.join(dest_dir, f"{base_name}.png")
        img_resized.save(png_dest_path, 'PNG', optimize=True)
        png_size = os.path.getsize(png_dest_path)
        print(f"Saved optimized PNG: {png_dest_path} ({png_size / 1024:.1f} KB)")

if __name__ == '__main__':
    optimize_images()
