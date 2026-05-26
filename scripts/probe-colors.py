import os
from PIL import Image

def probe_image(path):
    img = Image.open(path)
    w, h = img.size
    
    # Coordinates to sample
    points = {
        'Top-Left Corner': (10, 10),
        'Top-Right Corner': (w - 10, 10),
        'Bottom-Left Corner': (10, h - 10),
        'Bottom-Right Corner': (w - 10, h - 10),
        'Center': (w // 2, h // 2),
        'Top-Center': (w // 2, h // 10),
        'Bottom-Center': (w // 2, h - h // 10),
        'Left-Center': (w // 10, h // 2),
        'Right-Center': (w - w // 10, h // 2)
    }
    
    img_rgb = img.convert('RGB')
    res = {}
    for name, pos in points.items():
        res[name] = img_rgb.getpixel(pos)
    return res

def run():
    src_dir = '/Volumes/Blue/code/exhibitly/art'
    files = ['hero_example.png', 'home_detail.png', 'home_detail1.png', 'home_detail2.png']
    
    for f in files:
        path = os.path.join(src_dir, f)
        if not os.path.exists(path):
            print(f"{f} not found")
            continue
        samples = probe_image(path)
        print(f"\nImage: {f}")
        for name, color in samples.items():
            print(f"  {name:20}: RGB{color}")

if __name__ == '__main__':
    run()
