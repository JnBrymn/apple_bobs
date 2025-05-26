#!/usr/bin/env python3

"""
format_index.py - Generate Apple Bobs game menu and QR codes
Apple Bobs - A collection of games created by Bo Berryman using vibe coding
"""

import os
import glob
import qrcode

def find_game_pages():
    """Find all index.html files except the root one."""
    pages = glob.glob("**/index.html", recursive=True)
    # Filter out the root index.html
    pages = [page for page in pages if page != "index.html"]
    return sorted(pages)

def create_menu_html(pages):
    """Create the menu HTML from the list of pages."""
    menu_lines = ["            <ul class=\"game-list\">"]
    
    for page in pages:
        # Remove /index.html suffix to get clean path
        clean_path = page.replace("/index.html", "")
        
        # Capitalize first letter for display name
        display_name = clean_path.capitalize()
        
        # Check if QR code exists
        qr_filename = f"qr_codes/{clean_path}.png"
        qr_link = ""
        if os.path.exists(qr_filename):
            qr_link = f" (<a href=\"{qr_filename}\">QR code</a>)"
        
        menu_lines.append(f"                <li><a href=\"{clean_path}/\">{display_name}</a>{qr_link}</li>")
    
    menu_lines.append("            </ul>")
    return "\n".join(menu_lines)

def generate_qr_code(game_path):
    """Generate QR code for a game if it doesn't exist."""
    # Ensure qr_codes directory exists
    os.makedirs("qr_codes", exist_ok=True)
    
    # QR code filename
    qr_filename = f"qr_codes/{game_path}.png"
    
    # Check if QR code already exists
    if os.path.exists(qr_filename):
        return False  # Already exists
    
    # Generate the URL
    url = f"https://jnbrymn.github.io/apple_bobs/{game_path}/"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_filename)
    
    return True  # Created new QR code

def generate_index_html(menu_html):
    """Generate the complete index.html content."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apple Bobs - Games by Bo Berryman</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Apple Bobs</h1>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Games</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="about">
            <h2>About Apple Bobs</h2>
            <p>Apple Bobs is a collection of browser-based games created by Bo Berryman using vibe coding techniques. Each game is crafted with vanilla HTML, CSS, and JavaScript for maximum compatibility and instant playability.</p>
        </section>

        <section id="projects">
            <h2>Apple Bobs Games</h2>
{menu_html}
        </section>

    </main>

    <footer>
        <p>&copy; 2025 Apple Bobs - Games by Bo Berryman</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>"""

def main():
    """Main function to generate the Apple Bobs game menu and QR codes."""
    print("🍎 Generating Apple Bobs game menu...")
    
    # Find all game pages
    pages = find_game_pages()
    
    # Generate QR codes for games
    qr_created = []
    qr_existing = []
    
    for page in pages:
        clean_path = page.replace("/index.html", "")
        if generate_qr_code(clean_path):
            qr_created.append(clean_path)
        else:
            qr_existing.append(clean_path)
    
    # Create the menu HTML
    menu_html = create_menu_html(pages)
    
    # Generate the complete index.html content
    index_content = generate_index_html(menu_html)
    
    # Write to index.html
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(index_content)
    
    print(f"✅ Apple Bobs menu generated with {len(pages)} game(s)")
    print("📝 Updated index.html with game links")
    
    # QR code status
    if qr_created:
        print(f"🆕 Created {len(qr_created)} new QR code(s):")
        for game in qr_created:
            print(f"   - qr_codes/{game}.png")
    
    if qr_existing:
        print(f"✅ {len(qr_existing)} QR code(s) already exist")
    
    # List the found games
    print("🎮 Found games:")
    for page in pages:
        clean_path = page.replace("/index.html", "")
        qr_status = "🆕" if clean_path in qr_created else "✅"
        print(f"   {qr_status} {clean_path}")

if __name__ == "__main__":
    main()