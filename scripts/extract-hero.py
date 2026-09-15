"""Extract edge-connected paper, preserving opaque white inside the illustration."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / "assets/hero-layer-character-v1.png").convert("RGB")
rgb = np.asarray(source)
# Close tiny breaks in the drawn outline before identifying exterior paper.
ink = Image.fromarray(np.uint8(np.min(rgb, axis=2) < 215) * 255)
barrier = ink.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))
ImageDraw.Draw(barrier).line(
    [(int(source.width * .31), source.height - 1),
     (int(source.width * .84), source.height - 1)], fill=255, width=5)
fill = Image.new("L", (source.width + 2, source.height + 2), 0)
fill.paste(barrier, (1, 1))
ImageDraw.floodfill(fill, (0, 0), 128)
outside = np.asarray(fill)[1:-1, 1:-1] == 128
alpha = Image.fromarray(np.uint8(~outside) * 255)
# Recover the original outline after the temporary gap-closing dilation.
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.45))
result = source.convert("RGBA")
result.putalpha(alpha)
result.save(ROOT / "assets/hero-character-transparent-v2.png")
preview = Image.new("RGBA", source.size, "#658c86")
preview.alpha_composite(result)
preview.thumbnail((1000, 563))
preview.convert("RGB").save(ROOT / "assets/hero-alpha-review.jpg", quality=88)
print("Transparent pixels:", int((np.asarray(alpha) == 0).sum()))
print("Opaque pixels:", int((np.asarray(alpha) == 255).sum()))
