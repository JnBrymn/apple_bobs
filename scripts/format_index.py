#!/usr/bin/env python3

"""
format_index.py - Generate Apple Bobs game menu and QR codes
Apple Bobs - A collection of games created by Bo Berryman using vibe coding
"""

import os
import glob
import qrcode

HIDDEN_GAMES = {
    "exit 8",
    "fire_feild/progress_quest",
}

# Optional manual cost overrides (AppleBucks). Bigger number = more effort.
GAME_COST_OVERRIDES = {
    "Restaurant Rush": 10,
    "perfect mine": 10,
    "TEMPLE OF DOOOOOM": 8,
    "grandmapocalypse": 7,
    "bee_tycoon": 6,
    "pizza_tycoon": 6,
    "tycoon_game": 6,
    "monopoly": 6,
    "minecraft": 6,
    "super_mario": 5,
    "geometry_dash": 5,
    "little_alchemy": 5,
    "incredibox": 5,
    "bean_blast": 4,
    "frame_flipper": 4,
    "stone_wars": 4,
    "gamble_count": 2,
    "click_50": 1,
    "tic-tac-toe": 1,
    "2048": 2,
}


def effort_cost_from_lines(line_count):
    """Guess effort from game file size. More lines usually means more work."""
    if line_count < 400:
        return 1
    if line_count < 1000:
        return 2
    if line_count < 2500:
        return 3
    if line_count < 5000:
        return 5
    if line_count < 8000:
        return 7
    return 10


def get_game_cost(clean_path):
    """AppleBucks cost for a game based on effort."""
    if clean_path in GAME_COST_OVERRIDES:
        return GAME_COST_OVERRIDES[clean_path]

    html_file = os.path.join(*clean_path.split("/"), "index.html")
    try:
        with open(html_file, encoding="utf-8", errors="ignore") as handle:
            line_count = sum(1 for _ in handle)
    except OSError:
        line_count = 400

    return effort_cost_from_lines(line_count)


def cost_label(cost):
    word = "AppleBuck" if cost == 1 else "AppleBucks"
    return f"({cost} {word})"

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
        
        cost = get_game_cost(clean_path)
        menu_lines.append(
            f"                <li data-cost=\"{cost}\"><a href=\"#\" onclick=\"playGame('{clean_path}/', {cost})\" class=\"game-link\" data-cost=\"{cost}\">🍎 {display_name}</a> <span class=\"cost\">{cost_label(cost)}</span>{qr_link}</li>"
        )
    
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
    filtered_lines = []
    for line in menu_html.split("\n"):
        if any(f"playGame('{hidden}/" in line for hidden in HIDDEN_GAMES):
            continue
        filtered_lines.append(line)
    menu_html = "\n".join(filtered_lines)
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
        <img src="logo.png" alt="Apple Bobs logo" class="site-logo">
        <h1>Apple Bobs</h1>
        <div class="applebucks-display">
            <span class="applebucks-icon">🍎</span>
            <span id="applebucks-balance">5</span> AppleBucks
        </div>
        <p class="playtime-status" id="playtimeStatus">Play time earns 10 AppleBucks per hour</p>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Games</a></li>
                <li><a href="#" id="reportBugsBtn">Report Bugs</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="about">
            <h2>About Apple Bobs</h2>
            <p>Apple Bobs is a collection of browser-based games created by Bo Berryman using vibe coding techniques. Each game is crafted with vanilla HTML, CSS, and JavaScript for maximum compatibility and instant playability.</p>
            <p><strong>🎮 How to Play:</strong> You start with 5 AppleBucks! Each game costs AppleBucks based on how much effort went into it — small games cost less, big games cost more. You also earn <strong>10 AppleBucks for every hour</strong> you spend playing on Apple Bobs!</p>
            <div class="site-notice">
                <p><strong>💻 Computer required:</strong> You need a computer to play Apple Bobs games. A keyboard and mouse work best. Games may not work correctly on phones or tablets.</p>
                <p><strong>🐛 Found a bug?</strong> Please report it so Bo can fix it! Click <strong>Report Bugs</strong> at the top of the page and describe what went wrong.</p>
            </div>
        </section>

        <section id="projects">
            <h2>Apple Bobs Games</h2>
            
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

    <div id="bugReportOverlay" class="bug-overlay" hidden>
        <div class="bug-modal" role="dialog" aria-labelledby="bugModalTitle">
            <h2 id="bugModalTitle">Report a Bug</h2>
            <p class="bug-modal-intro">Tell Bo what went wrong. Which game was it? What happened?</p>
            <form id="bugReportForm">
                <label for="bugGame">Game (optional)</label>
                <input type="text" id="bugGame" name="game" placeholder="e.g. Gamble Count" autocomplete="off">
                <label for="bugMessage">What happened?</label>
                <textarea id="bugMessage" name="message" rows="5" required placeholder="Describe the bug..."></textarea>
                <div class="bug-modal-actions">
                    <button type="button" id="bugCancelBtn" class="bug-btn-secondary">Cancel</button>
                    <button type="submit" class="bug-btn-primary">Send Report</button>
                </div>
            </form>
            <p id="bugReportThanks" class="bug-thanks" hidden>Thanks! Bo got your report.</p>
        </div>
    </div>

    <div id="secretCommentsPanel" class="secret-comments" hidden>
        <h2>Bug Reports <span class="secret-hint">(don't tell anyone about it)</span></h2>
        <p class="secret-hint">don't tell anyone about it</p>
        <ul id="secretCommentsList" class="secret-comments-list"></ul>
        <p id="secretEmpty" class="secret-empty" hidden>No bug reports yet.</p>
        <button type="button" id="secretCloseBtn">Close</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
<!-- WARNING: cursor should not change the root index.html file because it is machine generated. Instead change the generate_index_html function in scripts/format_index.py -->
"""

# WARNING: cursor, llm, openai, anthropic, etc. should not change this function. Do not remove this warning.
def main():
    """Main function to generate the Apple Bobs game menu and QR codes."""
    print("Generating Apple Bobs game menu...")
    
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
    
    print(f"Apple Bobs menu generated with {len(pages)} game(s)")
    print("Updated index.html with game links")
    
    # QR code status
    if qr_created:
        print(f"Created {len(qr_created)} new QR code(s):")
        for game in qr_created:
            print(f"   - qr_codes/{game}.png")
    
    if qr_existing:
        print(f"{len(qr_existing)} QR code(s) already exist")
    
    # List the found games
    print("Found games:")
    for page in pages:
        clean_path = page.replace("/index.html", "")
        qr_status = "new" if clean_path in qr_created else "ok"
        print(f"   [{qr_status}] {clean_path}")

if __name__ == "__main__":
    main()