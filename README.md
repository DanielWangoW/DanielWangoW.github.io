# Daomiao Wang — Personal Academic Website

Live at: [https://DanielWangoW.github.io](https://DanielWangoW.github.io)

## File Structure

```
DanielWangoW.github.io/
├── index.html                    # Main webpage (all sections)
├── assets/
│   ├── css/
│   │   └── style.css             # All styles
│   ├── js/
│   │   └── main.js               # Publications rendering + interactions
│   ├── images/
│   │   ├── profile.jpg           # ← PUT YOUR PHOTO HERE
│   │   ├── papers/               # ← Paper thumbnail images (PNG/JPG)
│   │   │   ├── ihemomil.png
│   │   │   ├── gazeandgo.png
│   │   │   ├── pm2ecgcn.png
│   │   │   ├── sdpr.png
│   │   │   ├── ppg_biometric.png
│   │   │   ├── pismil.png
│   │   │   └── cardiac_rehab.png
│   │   └── projects/             # ← Project thumbnail images
│   │       ├── af_framework.png
│   │       ├── gaze_robot.png
│   │       └── embodied_agent.png
│   └── files/
│       └── CV_DaomiaoWang.pdf    # ← PUT YOUR CV HERE
└── data/
    └── publications.json         # Publication data (edit to update papers)
```

## How to Update Content

### Add Your Profile Photo
Place your photo at `assets/images/profile.jpg` (square, ≥400×400px recommended).
Then in `index.html`, replace the placeholder block:
```html
<!-- Replace this: -->
<div class="profile-photo-placeholder">...</div>

<!-- With this: -->
<img src="assets/images/profile.jpg" alt="Daomiao Wang" class="profile-photo" />
```

### Add Paper Thumbnails
Place image files (PNG/JPG, ~320×220px recommended) in `assets/images/papers/`.
File names must match the `"image"` field in `data/publications.json`.

### Add Project Images
Place image files in `assets/images/projects/`.
In `index.html`, replace the `<div class="project-thumb-placeholder">` block with:
```html
<img src="assets/images/projects/your_image.png" alt="Project Name" />
```

### Update Paper Links
Edit `data/publications.json` and replace `"#"` with actual URLs:
```json
"links": {
  "paper": "https://doi.org/...",
  "code": "https://github.com/...",
  "project": "https://..."
}
```

### Add Your CV
Place your CV PDF at `assets/files/CV_DaomiaoWang.pdf`.

### Add a New Publication
Add a new entry to `data/publications.json` following the existing format.

## Deploy to GitHub Pages

1. Create a repository named `DanielWangoW.github.io` on GitHub.
2. Push all files to the `main` branch.
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**.
4. Your site will be live at `https://DanielWangoW.github.io` within a few minutes.
