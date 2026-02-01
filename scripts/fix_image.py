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


def autocrop(img, threshold=240, padding=2):
    """Crop to bounding box of non-white pixels."""
    rgb = img.convert("RGB")
    w, h = img.size
    non_white = []
    for y in range(h):
        for x in range(w):
            r, g, b = rgb.getpixel((x, y))
            if r < threshold or g < threshold or b < threshold:
                non_white.append((x, y))
    if not non_white:
        return img
    xs, ys = [p[0] for p in non_white], [p[1] for p in non_white]
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
        help="Shortcut: autocrop, resize 40x40, save to same dir as input",
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
        args.resize = (40, 40)
        args.output = os.path.join(os.path.dirname(args.input), "enemy.png")

    if args.autocrop:
        img = autocrop(img, args.white, padding=2)

    if args.crop:
        left, top, w, h = args.crop
        img = img.crop((left, top, left + w, top + h))

    if args.resize:
        img = img.resize(args.resize, Image.Resampling.LANCZOS)

    img = white_to_transparent(img, args.white)
    img.save(args.output)
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
