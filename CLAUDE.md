# CLAUDE.md

 This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple static GitHub Pages site with vanilla HTML, CSS, and JavaScript. The site features a single-page layout with smooth scrolling navigation and responsive design.

## Architecture

- **index.html**: Main HTML structure with header navigation, content sections (about, projects, contact), and footer
- **script.js**: Client-side JavaScript handling smooth scroll navigation and contact button interaction
- **style.css**: Responsive CSS with mobile-first design, grid layout for projects, and consistent dark theme

## Development Workflow

Since this is a static site hosted on GitHub Pages, changes are deployed automatically when pushed to the main branch. No build process or package management is required.

## Key Implementation Details

- Navigation uses smooth scrolling with `scrollIntoView()` behavior
- Responsive design with CSS Grid for project cards and mobile breakpoints at 768px
- Dark theme with #333 primary color and white text on dark backgrounds
- All JavaScript is vanilla (no frameworks or dependencies)
