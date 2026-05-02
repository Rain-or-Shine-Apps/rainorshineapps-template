# Update Template Command

When the user runs /update-template, do the following:

1. Ask which file or component they want to sync back to the template
2. Read the specified file from the current project
3. Compare it with the equivalent file in C:\Projects\rainorshineapps-template
4. Identify improvements that are not app-specific
5. Strip out any app-specific content (app names, specific routes, specific data models)
6. Update the template file with the improvements
7. Show the user what changed
8. Ask if they want to commit the changes to the template repo

Rules:
- Never copy app-specific logic (e.g. Decidr's choice editor, specific database tables)
- Only copy structural/UI improvements (e.g. better safe area handling, improved styles)
- Always show a diff before making changes
- Always ask for confirmation before writing to template files