# Portfolio-as-Code

Config file:
- Name (M)
- Born year
- Pronouns
- Image (M)
- Short bio (M)
- Long bio
- Title / Student (M)
- Location. Uni location / company name (M)
- Resume viewable link
- Socials (X, LinkedIn, Ig, Fb, Others (generic image))

Job&Project 
- Ordering (M)
- isJob / isProject (M)
- Title (M) (B)
- Start - End/Current (B)
- Description
- Links
- Skills involved

Education
- Ordering (M)
- Institution name (M) (B)
- Course name  (B)
- Awarded
- Start - End/Current (B)
- Description
- Links

Achievements
- Ordering (M)
- Name (M) (B)
- Description
- Date awarded (B)
- Links
- Skills

(M) must include in config file
(B) birds eye view, ie, don't need to click inside to view.

All sections except header information show only birds eye view (B). 

Individual cards on a horizontal slider. When user clicks anywhere in the card it opens a modal with all the info

Skills are comma seperated

Under Job&Project and Achievements, skills are listed as count. Can hover to view more

Filter
- Skill filter
- "Contains" filter using an edit box. Lowercase the query and the search terms
- As user types, the skill that gets filtered shows up in a navigation menu. A button to the right opens a dialog with the skill
- Year filter
- Pulls up all the things the person was doing in that year / year range

/my-portfolio
- Create a portfolio json file
- After user creates, prompt them to clone this repo, replace the json config file, and push to gh with vercel
- Update the json file by uploading a file 


Pattern:
Top level component reads the config file and does SSR. Try to push CSR as low as possible
