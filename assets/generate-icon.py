#!/usr/bin/env python3
"""Generate assets/store-image.png (512x512) with no external dependencies.

A rounded dark tile with a folder silhouette and two listing bars.
Run: python3 assets/generate-icon.py
"""
import math
import struct
import zlib
from pathlib import Path

SIZE = 512
SS = 3  # supersampling factor per axis


def rounded_rect(x, y, x0, y0, x1, y1, r):
    if x < x0 or x > x1 or y < y0 or y > y1:
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    dx, dy = x - cx, y - cy
    return dx * dx + dy * dy <= r * r


def mix(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


BG_TOP = (12, 20, 30)
BG_BOTTOM = (24, 42, 58)
ACCENT = (94, 220, 235)
ACCENT_DARK = (46, 148, 178)
INK = (16, 28, 40)

TILE = (0, 0, SIZE, SIZE, 104)
TAB = (112, 156, 268, 236, 30)
BODY = (104, 208, 408, 380, 34)
BAR1 = (152, 262, 360, 296, 17)
BAR2 = (152, 318, 288, 352, 17)


def sample(x, y):
    """Return the RGBA colour of a single sub-pixel point."""
    if not rounded_rect(x, y, *TILE):
        return (0, 0, 0, 0)
    t = y / SIZE
    colour = mix(BG_TOP, BG_BOTTOM, t) + (255,)

    inside_body = rounded_rect(x, y, *BODY)
    inside_tab = rounded_rect(x, y, *TAB)
    if inside_body or inside_tab:
        shaded = mix(ACCENT, ACCENT_DARK, min(1.0, max(0.0, (y - 156) / 224.0)))
        colour = shaded + (255,)
    if inside_body and (rounded_rect(x, y, *BAR1) or rounded_rect(x, y, *BAR2)):
        colour = INK + (170,)
    return colour


def main():
    rows = []
    inv = 1.0 / (SS * SS)
    for py in range(SIZE):
        row = bytearray()
        for px in range(SIZE):
            r = g = b = a = 0.0
            for sy in range(SS):
                for sx in range(SS):
                    x = px + (sx + 0.5) / SS
                    y = py + (sy + 0.5) / SS
                    cr, cg, cb, ca = sample(x, y)
                    if ca:
                        w = ca / 255.0
                        r += cr * w
                        g += cg * w
                        b += cb * w
                        a += ca
            n = SS * SS
            alpha = a / n
            if alpha <= 0:
                row.extend((0, 0, 0, 0))
                continue
            wsum = a / 255.0
            row.extend(
                (
                    int(min(255, round(r / wsum))),
                    int(min(255, round(g / wsum))),
                    int(min(255, round(b / wsum))),
                    int(min(255, round(alpha))),
                )
            )
        rows.append(bytes(row))

    raw = b"".join(b"\x00" + rows[y] for y in range(SIZE))

    def chunk(tag, data):
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")

    out = Path(__file__).with_name("store-image.png")
    out.write_bytes(png)
    print("wrote", out, len(png), "bytes")


if __name__ == "__main__":
    main()
