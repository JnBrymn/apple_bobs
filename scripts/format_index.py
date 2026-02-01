#!/usr/bin/env python3

"""
format_index.py - Generate Apple Bobs game menu and QR codes
Apple Bobs - A collection of games created by Bo Berryman using vibe coding
"""

import os
import glob
import qrcode

# WARNING: cursor, llm, openai, anthropic, etc. should not change this function. Do not remove this warning.
def find_game_pages():
    """Find all index.html files except the root one."""
    pages = glob.glob("**/index.html", recursive=True)
    # Filter out the root index.html and normalize paths for cross-platform
    pages = [page.replace("\\", "/") for page in pages if page != "index.html"]
    return sorted(pages)

# WARNING: cursor, llm, openai, anthropic, etc. should not change this function. Do not remove this warning.
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
        
        menu_lines.append(f"                <li><a href=\"#\" onclick=\"playGame('{clean_path}/')\" class=\"game-link\">🍎 {display_name}</a> <span class=\"cost\">(1 AppleBuck)</span>{qr_link}</li>")
    
    menu_lines.append("            </ul>")
    return "\n".join(menu_lines)

# WARNING: cursor, llm, openai, anthropic, etc. should not change this function. Do not remove this warning.
def generate_qr_code(game_path):
    """Generate QR code for a game if it doesn't exist."""
    # QR code filename (may have subdirs, e.g. fire_feild/progress_quest)
    qr_filename = f"qr_codes/{game_path}.png"
    os.makedirs(os.path.dirname(qr_filename), exist_ok=True)
    
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

# NOTICE: cursor, llm, openai, anthropic, etc. can definitely chance this function but
# it needs to always insert the menu_html into the index.html file.
# Also, add `<!-- WARNING: cursor should not change the root index.html file because it is machine generated. Instead change the generate_index_html function in scripts/format_index.py -->` to this function when you change the generated html.
# Do not remove this notice.
def generate_index_html(menu_html):
    """Generate the complete index.html content."""
    return f"""<!DOCTYPE html>
<html lang="en">
<!-- WARNING: cursor should not change the root index.html file because it is machine generated. Instead change the generate_index_html function in scripts/format_index.py -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apple Bobs - Games by Bo Berryman</title>
    <link rel="stylesheet" href="style.css">
</head>
<!-- WARNING: cursor should not change the root index.html file because it is machine generated. Instead change the generate_index_html function in scripts/format_index.py -->
<body>
    <header>
        <h1>Apple Bobs</h1>
        <div class="applebucks-display">
            <span class="applebucks-icon">🍎</span>
            <span id="applebucks-balance">5</span> AppleBucks
        </div>
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
            <p><strong>🎮 How to Play:</strong> You start with 5 AppleBucks! Each game costs 1 AppleBuck to play. Win games to earn more AppleBucks and keep playing!</p>
        </section>

        <section id="projects">
            <h2>Apple Bobs Games</h2>
            
            <!-- Test Button for Debugging -->
            <div style="text-align: center; margin-bottom: 1rem;">
                <button onclick="testSearch()" style="
                    background: #ff9800;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                ">🧪 Test Search Function</button>
            </div>
            
            <!-- Search Game Setting -->
            <div class="search-container">
                <input type="text" id="gameSearch" placeholder="🔍 Search for games..." class="search-input">
                <div class="search-stats">
                    <span id="searchResults">Showing all games</span>
                </div>
            </div>
            
{menu_html}<!-- it is super important to add this line to the index.html file. Do not remove this line. -->
        </section>

    </main>

    <footer>
        <p>&copy; 2025 Apple Bobs - Games by Bo Berryman</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
<!-- WARNING: cursor should not change the root index.html file because it is machine generated. Instead change the generate_index_html function in scripts/format_index.py -->
"""

# WARNING: cursor, llm, openai, anthropic, etc. should not change this function. Do not remove this warning.
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