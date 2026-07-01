# Make Assets Command

When the user runs /make-assets, generate promotional copy and asset suggestions for the current app's store listings.

1. Read app.json for the app name, slug, tagline hints, and brand colours (splash backgroundColor, icon, adaptiveIcon background).
2. Explore the app's actual screens (app/*.tsx) to understand its real features, tone, and the language it already uses for itself (e.g. existing in-app copy, emoji, terminology) — don't invent features that aren't there.
3. Draft the following, respecting each platform's character limits exactly (count characters, don't estimate):

## Apple App Store
- App Name (≤30 chars)
- Subtitle (≤30 chars)
- Promotional Text (≤170 chars — can be updated anytime without a new review)
- Description (≤4000 chars)
- Keywords (≤100 chars total, comma-separated, no spaces, no repeats of words already in the name/subtitle)

## Google Play Store
- Short description (≤80 chars)
- Full description (≤4000 chars)

## Screenshot headlines
Pick the app's 4–6 most marketable screens/states (not empty states — e.g. "2 chores already done today" rather than a blank list). For each one, suggest:
- Which screen and state to capture
- A short punchy headline (≤6 words) to overlay on that screenshot
Order them so the strongest hook is first — both stores crop to the first 2–3 images in search results.

## Feature Graphic (Google Play, 1024×500)
Suggest:
- Background treatment using the app's actual brand colours
- Hero visual (icon, mascot, or a key screen mockup)
- Headline text overlay (≤6 words)

## Website copy (only if the user asks for it)
- Hero tagline
- Meta description
- 4–6 feature blocks (icon + short headline + 1–2 sentence description)
The existing pages under rain-or-shine-apps.github.io/<app>/index.html are a useful reference for house voice/tone, but they are not the template for this command's primary deliverables — the store listing copy above is.

4. Save the full draft to marketing/store-listing.md in the current project.
5. Present it to the user and ask if they want adjustments (tone, emphasis, specific phrases) before treating it as final.

Rules:
- Write all copy in UK English spelling (colour, favourite, optimise, personalise, organise, etc.), never US spelling
- Match the app's existing brand voice — infer tone from its actual UI copy, don't impose a generic one
- Never exceed a platform's character limit; if a draft runs long, cut features rather than abbreviate awkwardly
- Screenshot headlines are a banner overlay, not body text — keep them skimmable at a glance
- Don't fabricate features, pricing, or claims the app's code doesn't support
