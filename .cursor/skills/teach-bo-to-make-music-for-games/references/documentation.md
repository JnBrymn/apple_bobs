# Documentation (lookup)

Progress: [records.md](records.md). Lesson topics: [lesson-ideas.md](lesson-ideas.md).

**Household note:** Install/register/redeem for MPC Beats + AIR plugins was largely completed (2026). Sections below stay for when something breaks or Bo needs a fact.

---

## How the stack fits together

```text
Bo's fingers
    ↓ USB MIDI
MPK Mini Play ─────────────────────→ Windows (device + drivers)
    │                                      │
    │ internal sounds (optional)         │
    ↓                                      ↓
inMusic Software Center ←── account ──→ MPC Beats (main studio)
    │ installs/updates                     │  records MIDI sequences
    ├── AIR Electric (standalone/plugin)   │  loads AIR + expansion sounds
    ├── AIR Hype                           │  exports audio / MIDI
    ├── AIR Essential Keyboards            │
    ├── MPK Editor                         │
    └── sample/expansion packs             ↓
                                    .mid / project files
                                           ↓
                              game-midi/ (repo folder)
                                           ↓
                              apple_bobs game (index.html)
```

**Rule of thumb:** **MPC Beats** = bundled studio; strong on **beats/drums**, can record **keyboard melody** too (not piano-first UI). **LMMS** = better fit when Bo wants **piano-roll / melody** workflow (install when ready—not required yet). **AIR standalones** = fast jam with one instrument. **Software Center** = parent maintenance.

---

## MIDI & game files (concepts)

| Format | What it is | In this project |
|--------|------------|-----------------|
| **MIDI** (`.mid`) | Note/time instructions | Best target for “music in a game” |
| **MPC project** | MPC Beats session (patterns, sounds) | Save work-in-progress; export MIDI from here |
| **WAV/MP3** | Rendered audio | Listening/sharing; optional in games |

Games in this repo: top-level folders with `index.html` (e.g. `perfect mine/`).

---

## Windows

**What:** The OS; connects USB devices and runs all apps.

**Parts:** Device Manager / Settings → Bluetooth & devices; per-app sound settings; USB ports.

**With other software:** Sees MPK as a MIDI device. Each app (MPC Beats, AIR apps) chooses that device in its own **MIDI input** settings—not in one global “record” button.

**Links:**
- [Windows MIDI settings](https://support.microsoft.com/en-us/windows/troubleshoot-midi-issues-on-windows-10-11) (troubleshooting)
- Device Manager: `devmgmt.msc`

---

## Akai MPK Mini Play (hardware)

**Bo's keyboard:** **Akai Professional MPK Mini Play** (MPK Mini Play).

**What:** 25-key keyboard + pads + knobs; built-in sounds and speaker; USB MIDI controller for the PC.

**Parts:** Keys, pads, joystick, encoders; **Internal Sounds** on/off; **USB / BATT** power switch; headphone out; sustain pedal jack; 8 **Favorites** slots (on-device presets).

**With other software:** Sends MIDI over USB. Turn **Internal Sounds OFF** when the computer app should make sound. Works with MPC Beats, AIR standalones, LMMS, etc. Class-compliant—no extra driver for basic MIDI on Windows.

**Does not:** Save `.mid` files by itself; that happens in MPC Beats (or another DAW).

**Links:**
- [MPK mini Play mk3 User Guide (PDF)](https://cdn.inmusicbrands.com/akai/mpk-mini-play-mk3/MPK%20mini%20Play%20mk3%20-%20User%20Guide%20-%20v1.1.pdf)
- [MPK mini Play FAQ](https://support.akaipro.com/en/support/solutions/articles/69000798894-akai-pro-mpk-mini-play-frequently-asked-questions)
- [Onboard features & standalone use](https://support.akaipro.com/en/support/solutions/articles/69000805679-akai-pro-mpk-mini-play-mk3-onboard-features-standalone-use)
- [MPK mini Play Editor how-to](https://support.akaipro.com/en/support/solutions/articles/69000798941-akai-pro-mpk-mini-play-how-to-use-the-editor)
- [MPK Editor User Guide (PDF)](https://cdn.inmusicbrands.com/akai/mpk-mini-play/MPKMiniPlayEditor-UserGuide-v1.0.pdf_8e5417b529f523410b6322326c282c9e.pdf)
- [Akai downloads & support hub](https://www.akaipro.com/downloads-and-support/downloads/)

Broken product URL: `akaipro.com/mpk-mini-play` → use [MPK series page](https://www.akaipro.com/mpk-mini-play-mpkminiplay) or PDF above.

---

## inMusic Profile (Akai account)

**What:** Free login that registers the keyboard and unlocks bundled downloads.

**Parts:** Register at akaipro.com → **Register New Product** (serial on bottom, starts with **21**) → software appears for download via Software Center.

**With other software:** Same email/password signs into **inMusic Software Center** and activates AIR plugins.

**Links:**
- [Sign in / register](http://akaipro.com/register)
- [Full MPK mini Play software setup guide](https://support.akaipro.com/en/support/solutions/articles/69000798879-akai-pro-mpk-mini-mpk-mini-play-mpk-mini-plus-how-to-download-install-and-setup-the-included-so)
- [Setup/Registration folder](https://support.akaipro.com/en/support/solutions/folders/69000655469)

---

## inMusic Software Center

**What:** Installer hub for everything Akai bundled—MPC Beats, AIR instruments, expansions, MPK Editor. Parent tool.

**Parts:** **My Hardware** (redeem with keyboard plugged in), **Software** / **Apps**, **My Expansions**, install queue.

**With other software:** Downloads installers; does not record music. After install, open **MPC Beats** or an **AIR standalone** from the Start menu / Applications folder.

**Typical flow:** Install Center → sign in → **REDEEM SOFTWARE** (keyboard on USB) → install MPC Beats + AIR titles + packs → launch apps separately.

**Links:**
- [Download Windows](https://inmusic.to/ISCPC) · [Download Mac](https://inmusic.to/ISCMAC)
- [AIR downloads page](https://airmusictech.com/downloads/)
- [Redeem included hardware software](https://support.inmusicstore.com/en/support/solutions/articles/69000878383-inmusic-software-center-how-to-redeem-software-included-with-inmusic-hardware)
- [Download errors troubleshooting](https://support.inmusicstore.com/en/support/solutions/articles/69000872671-inmusic-software-center-troubleshooting-download-errors)
- [Re-download AIR plugins](https://support.inmusicstore.com/en/support/solutions/articles/69000828989-air-music-tech-downloading-and-re-downloading-your-air-music-technology-plugins)

---

## MPC Beats

**What:** Free Akai “beat studio” on PC—sequences, drums, instruments, mix. **Beat-first** (pads, kits, loops); melody is done on **instrument/key tracks**, not the main drum grid. Still the **bundled** place to save projects and **export `.mid`** until LMMS is set up.

**Not wrong to feel it’s “for beats”:** that’s the default workflow. Keyboard tunes are absolutely possible—just add a **melodic** track/program, not only drums.

**Parts (big ideas):** **Tracks** (layers); **Programs** (drum/key/plugin sounds); **Pads** (often drums); **Piano roll / sequencer**; **Browser / Expansions** (sample packs); transport (play/stop/record).

**With other software:**
- **MPK** → MIDI input (Preferences → MIDI/Sync; enable MPK port, often **Track**).
- **AIR plugins** → loaded inside MPC as **Plugin** programs (may need plugin scan: VST folder `C:\Program Files\Steinberg\VstPlugins`).
- **Expansions** → kits/samples in Media Browser (**B** key); drag to pads.
- **AIR standalones** → separate apps for jamming; move ideas into MPC to save/export.

**Recording → file:**
1. Instrument track + sound loaded.
2. Record MIDI performance.
3. **File → Save Project** (`.mpc` or project—keeps work).
4. Export: **Export MIDI** (toolbar, near Export Audio) and/or **File → Export as MIDI Track File** for patterns.

**Links:**
- [Save projects](https://support.akaipro.com/en/support/solutions/articles/69000824112-akai-pro-mpc-beats-how-do-i-save-my-projects-)
- [MPK Mini mk3 hardware setup in MPC Beats](https://support.akaipro.com/en/support/solutions/articles/69000805678-akai-pro-mpk-mini-mk3-hardware-setup-control-mapping-in-mpc-beats) (similar for Play family)
- [MPC Beats as plugin in another DAW](https://support.akaipro.com/en/support/solutions/articles/69000859388-how-to-load-mpc-beats-as-a-plugin)
- [MIDI maps export/import](https://support.akaipro.com/en/support/solutions/articles/69000817918-akai-pro-mpc-beats-mpc-2-creating-exporting-and-importing-new-midi-maps)
- [MPC Software User Guide PDF](https://cdn.inmusicbrands.com/akai/MM28M20/MPCSoftware-UserGuide-v2.8.pdf) (deep reference; MPC Beats shares MPC workflow)
- [MPC Beats intro (video)](https://www.youtube.com/watch?v=Muwqi1W_FBw)
- [Install expansions on another drive](https://support.akaipro.com/en/support/solutions/articles/69000863348-installing-mpc-expansions-on-a-secondary-drive)

**Export for games:** Save `.mid` files to **`game-midi/`** at the root of this repo (see Family notes). MPC menu path when known: ___

---

## AIR Music Technology — Electric

**What:** Virtual **electric piano** (Rhodes, Wurlitzer, etc.)—standalone app + plugin.

**Parts:** Presets; Pickup / Envelope / Bell / Noise; built-in effects (tremolo, distortion, chorus, delay, reverb).

**With other software:** Standalone: MPK → MIDI input in app **Settings**. Plugin: open inside **MPC Beats** (scan VSTs) or another DAW. Sounds made here are **not** automatically a game `.mid`—record/export from **MPC Beats** if needed.

**Links:**
- [Electric product page](https://www.airmusictech.com/virtual-instruments/electric/)
- [User guide (PDF)](https://www.airmusictech.com/user-guides/electric.pdf)
- [AIR support / downloads](https://airmusictech.com/downloads/)

---

## AIR Music Technology — Hype

**What:** Big **synth** (wavetable, FM, analog, samples)—standalone + plugin; huge preset library.

**Parts:** Sound engines; 1500+ presets; macro knobs; built-in FX (delay, reverb, EQ, etc.).

**With other software:** Same pattern as Electric—jam standalone with MPK, or load as plugin in MPC Beats. Cross-compatible with MPC/FORCE ecosystem per AIR.

**Links:**
- [Hype product page](https://www.airmusictech.com/virtual-instruments/hype/)
- [User guide (PDF)](https://www.airmusictech.com/user-guides/hype.pdf)

---

## AIR Music Technology — Essential Keyboards

**What:** Collection of **keyboard instruments** (pianos, organs, clavinets, etc.)—standalone + plugin.

**Parts:** Multiple instrument UIs inside one product; presets per instrument type.

**With other software:** Same as Electric/Hype—standalone for play-along; MPC Beats for projects and MIDI export.

**Links:**
- [Essential Keyboards product page](https://www.airmusictech.com/virtual-instruments/essential-keyboards/)
- [All AIR virtual instruments](https://www.airmusictech.com/virtual-instruments/)

---

## MPC Beats expansions / producer kits (sample packs)

**What:** Extra **drum kits, loops, and sounds** installed via Software Center (**My Expansions**). Content inside MPC Beats Browser—not separate apps.

**Parts:** Expansion icons in Media Browser; drag kits/samples onto **pads** or tracks.

**With other software:** Only usable **inside MPC Beats** after install. MPK pad presets (e.g. Prog Select + Pad 1) map to pad banks in MPC.

**Links:**
- [Installing expansions (secondary drive)](https://support.akaipro.com/en/support/solutions/articles/69000863348-installing-mpc-expansions-on-a-secondary-drive)
- [MPC Store (paid expansions)](https://thempcstore.com/) — optional; bundled packs came with registration

---

## MPK Mini Play Editor

**What:** Small Akai app to change **MIDI behavior** (pads, knobs, channels) and edit **Favorites**—not for recording songs.

**Parts:** Pad/knob maps; keyboard settings; sync favorites with hardware.

**With other software:** Use when pads/keys send wrong channels in MPC Beats. Close other MIDI apps while editing. Installed via Software Center with the rest.

**Links:**
- [How to use the Editor](https://support.akaipro.com/en/support/solutions/articles/69000798941-akai-pro-mpk-mini-play-how-to-use-the-editor)
- [Editor User Guide (PDF)](https://cdn.inmusicbrands.com/akai/mpk-mini-play/MPKMiniPlayEditor-UserGuide-v1.0.pdf_8e5417b529f523410b6322326c282c9e.pdf)

---

## LMMS (recommended for piano; install when parent/Bo ready)

**What:** Free, open-source music studio for Windows/Mac/Linux. **Piano-roll / keyboard-first** UI—often a better match than MPC Beats when Bo is thinking in **piano**, not pads.

**Parts:** Song editor, **piano roll**, instrument plugins, MIDI import/export.

**With other software:** Same **MPK Mini Play** as MIDI input. Does **not** use AIR expansions or MPC projects. Export `.mid` → **`game-midi/`** same as MPC. **Not installed yet** in this household unless Family notes say otherwise—fine to add alongside MPC, not instead of learning beats there.

**When to steer Bo here:** recording a **melody** on keys, editing notes like a piano. **When to steer to MPC Beats:** **drums/beats** for games (often more useful in games than solo piano).

**Links:**
- [lmms.io](https://lmms.io/)
- [Documentation](https://docs.lmms.io/)
- [GitHub](https://github.com/LMMS/lmms)

---

## Browser games (apple_bobs)

**What:** Bo’s vibe-coded `index.html` games—not a DAW.

**Parts:** JavaScript/Web Audio (or similar) in each game; may load sounds from code, files, or URLs.

**With other software:** **MPC Beats** (or LMMS) exports `.mid` into **`game-midi/`** → parent/Bo (or agent) references that file from game code. No automatic link from MPC to game.

**Links:** Game folder + top-of-file comment in each project. Shared exports: `game-midi/`.

---

## Install & recovery (parent — already done, keep for breaks)

| Step | Link |
|------|------|
| Account | [akaipro.com/register](http://akaipro.com/register) |
| Setup guide | [MPK mini Play software setup](https://support.akaipro.com/en/support/solutions/articles/69000798879-akai-pro-mpk-mini-mpk-mini-play-mpk-mini-plus-how-to-download-install-and-setup-the-included-so) |
| Software Center (Win) | [inmusic.to/ISCPC](https://inmusic.to/ISCPC) |

Broken URLs: `akaipro.com/mpk-mini-play`, `akaipro.com/login`

---

## Common fixes (Bo's words → try this)

| He says… | Often try |
|----------|-----------|
| Computer doesn't hear keyboard | USB port/cable; **USB** power switch; replug |
| Sound only from keyboard | **Internal Sounds OFF** |
| MPC open, no sound | MIDI input = MPK; add instrument track; volume |
| "I recorded but where's the file?" | **Save Project** + **Export MIDI** (not just stop) |
| AIR app silent | Settings → enable MPK under MIDI inputs |
| Can't download again | Same inMusic account; Software Center → My Hardware / Software |
| Double/echo sound | Internal sounds on while MPC also plays |

---

## Family notes

- **Keyboard:** Akai Professional MPK Mini Play
- **Bo’s musical comfort:** knows **piano** more than **beats** — start melody ideas on keys / piano-roll apps; still teach **beats** (pads, rhythm) because they’re **especially useful for game music**
- **Apps:** MPC Beats installed (beat-first, can export MIDI). **LMMS** not installed yet — good next install for piano-style recording ([lmms.io](https://lmms.io/))
- **Windows MIDI device name** (as shown in Settings / MPC): ___
- **Exported `.mid` files:** `game-midi/` at repo root (`apple_bobs/game-midi/`)
- **MPC Beats export menu** (once you find it): ___
- **LMMS installed?** ___ (date/path if yes)
