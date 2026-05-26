import os
from PIL import Image
from collections import Counter

def analyze_image(path):
    img = Image.open(path)
    img = img.resize((100, 100)) # resize to make analysis fast
    img_rgb = img.convert('RGB')
    pixels = list(img_rgb.getdata())
    
    # Calculate average color
    avg_r = sum(p[0] for p in pixels) // len(pixels)
    avg_g = sum(p[1] for p in pixels) // len(pixels)
    avg_b = sum(p[2] for p in pixels) // len(pixels)
    
    # Calculate top 5 dominant colors (quantized)
    quantized_pixels = [(p[0]//32 * 32, p[1]//32 * 32, p[2]//32 * 32) for p in pixels]
    counter = Counter(quantized_pixels)
    dominant = counter.most_common(5)
    
    # Check top half vs bottom half average color
    top_pixels = pixels[:len(pixels)//2]
    bot_pixels = pixels[len(pixels)//2:]
    
    avg_top = (sum(p[0] for p in top_pixels) // len(top_pixels),
               sum(p[1] for p in top_pixels) // len(top_pixels),
               sum(p[2] for p in top_pixels) // len(top_pixels))
               
    avg_bot = (sum(p[0] for p in bot_pixels) // len(bot_pixels),
               sum(p[1] for p in bot_pixels) // len(bot_pixels),
               sum(p[2] for p in bot_pixels) // len(bot_pixels))
               
    return {
        'avg': (avg_r, avg_g, avg_b),
        'top_avg': avg_top,
        'bot_avg': avg_bot,
        'dominant': dominant
    }

def run():
    src_dir = '/Volumes/Blue/code/exhibitly/art'
    files = ['hero_example.png', 'home_detail.png', 'home_detail1.png', 'home_detail2.png']
    
    for f in files:
        path = os.path.join(src_dir, f)
        if not os.path.exists(path):
            print(f"{f} not found")
            continue
        res = analyze_image(path)
        print(f"\nImage: {f}")
        print(f"  Average Color: RGB{res['avg']}")
        print(f"  Top Half Avg:  RGB{res['top_avg']}")
        print(f"  Bottom Half Avg: RGB{res['bot_avg']}")
        print("  Dominant Colors (quantized):")
        for color, count in res['dominant']:
            print(f"    RGB{color}: {count} pixels")

if __name__ == '__main__':
    run()
