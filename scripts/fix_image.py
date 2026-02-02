#!/usr/bin/env python3
"""
Image fixer: crop, resize, make white pixels transparent.
Requires: pip install Pillow
"""
import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Need Pillow! Run: pip install Pillow")
    sys.exit(1)


def autocrop(img, threshold=240, padding=2, bg="white"):
    """Crop to bounding box of content. bg='white' finds non-white; bg='black' finds non-black."""
    rgb = img.convert("RGB")
    w, h = img.size
    content = []
    for y in range(h):
        for x in range(w):
            r, g, b = rgb.getpixel((x, y))
            if bg == "white":
                if r < threshold or g < threshold or b < threshold:
                    content.append((x, y))
            else:  # black bg
                if r > threshold or g > threshold or b > threshold:
                    content.append((x, y))
    if not content:
        return img
    xs, ys = [p[0] for p in content], [p[1] for p in content]
    left = max(0, min(xs) - padding)
    top = max(0, min(ys) - padding)
    right = min(w, max(xs) + 1 + padding)
    bottom = min(h, max(ys) + 1 + padding)
    return img.crop((left, top, right, bottom))


def white_to_transparent(img, threshold=240):
    """Make white/near-white pixels transparent. threshold 0-255, higher = more pixels become transparent."""
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if r >= threshold and g >= threshold and b >= threshold:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    return img


def black_to_transparent(img, threshold=30):
    """Make black/near-black pixels transparent. threshold 0-255, lower = stricter."""
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if r <= threshold and g <= threshold and b <= threshold:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    return img


def resize_keep_aspect(img, max_w, max_h):
    """Resize to fit within max_w x max_h, preserving aspect ratio."""
    w, h = img.size
    scale = min(max_w / w, max_h / h)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def main():
    p = argparse.ArgumentParser(
        description="Crop, resize, and make white transparent. Order: load -> crop -> resize -> white-to-transparent -> save"
    )
    p.add_argument("input", help="Input image path (e.g. player.png)")
    p.add_argument("output", nargs="?", help="Output path (optional with --player/--enemy)")
    p.add_argument(
        "--crop",
        type=int,
        nargs=4,
        metavar=("LEFT", "TOP", "WIDTH", "HEIGHT"),
        help="Crop rectangle: left, top, width, height (in pixels)",
    )
    p.add_argument(
        "--resize",
        type=int,
        nargs=2,
        metavar=("WIDTH", "HEIGHT"),
        help="Resize to width x height",
    )
    p.add_argument(
        "--white",
        type=int,
        default=240,
        metavar="N",
        help="Make pixels with R,G,B >= N transparent (default 240)",
    )
    p.add_argument(
        "--autocrop",
        action="store_true",
        help="Auto-crop white borders (finds content bounds)",
    )
    p.add_argument(
        "--player",
        action="store_true",
        help="Shortcut: autocrop, resize 48x57, save to same dir as input",
    )
    p.add_argument(
        "--enemy",
        action="store_true",
        help="Shortcut: autocrop, resize to fit 40px (keep aspect), save to same dir as input",
    )
    p.add_argument(
        "--black",
        action="store_true",
        help="Black background: make black transparent, autocrop to non-black content",
    )
    p.add_argument("--info", action="store_true", help="Print image size and exit (no output file)")
    args = p.parse_args()

    img = Image.open(args.input).convert("RGBA")
    if args.info:
        w, h = img.size
        print(f"{args.input}: {w} x {h} pixels")
        return

    if not args.output and not args.player and not args.enemy:
        p.error("output required (or use --player / --enemy)")

    # Shortcuts set output and options
    if args.player:
        args.autocrop = True
        args.resize = (48, 57)
        args.output = os.path.join(os.path.dirname(args.input), "player.png")
    elif args.enemy:
        args.autocrop = True
        args.resize = (80, 80)  # Larger for sharper display
        args.output = os.path.join(os.path.dirname(args.input), "enemy.png")

    if args.autocrop:
        crop_thresh = 25 if args.black else args.white
        crop_bg = "black" if args.black else "white"
        img = autocrop(img, crop_thresh, padding=2, bg=crop_bg)

    if args.crop:
        left, top, w, h = args.crop
        img = img.crop((left, top, left + w, top + h))

    if args.resize:
        if args.enemy and args.resize == (80, 80):
            img = resize_keep_aspect(img, 80, 80)  # Preserve aspect ratio
        else:
            img = img.resize(args.resize, Image.Resampling.LANCZOS)

    if args.black:
        img = black_to_transparent(img, threshold=30)
    else:
        img = white_to_transparent(img, args.white)
    img.save(args.output)
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
