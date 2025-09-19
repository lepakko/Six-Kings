# Local Image Loading for Team Photos

## How to Add Team Photos

1. Place your team member photos in the `public/images/` folder
2. The photo filenames should match exactly what's stored in the "bild" column of your Google Sheets "Team" tab
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Example

If your Google Sheets has:
- Spieler: "Max Mustermann"
- bild: "max_mustermann"

Then place the photo file as: `public/images/max_mustermann.jpg`

## Fallback Behavior

- If no image filename is provided in the "bild" column, a placeholder avatar with the first letter of the player's name will be shown
- If the image file doesn't exist, the same fallback avatar will be displayed
- The component will automatically try common image extensions if no extension is specified

## File Structure

```
public/
  images/
    player1.jpg
    player2.png
    player3.jpeg
    ...
```

The application will automatically load these images when viewing the Team section.
