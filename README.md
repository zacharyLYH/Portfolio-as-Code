# Portfolio-as-Code

Portfolio generator configured using json. Geared for portfolios that have a lot of text and want interactive filtering abilities such as partial word search. 

# Features
- UI for config generation 
- Full responsiveness from mobile to desktop
- Maximum SSR for a good UX
- Advanced filter support for users to query your portfolio
- Modern, text dominant friendly, sleek looking UI

# To use
1. Navigate to [configure page]("https://zacharyLYH.bio/configure")
2. Fill in relevant details. Correct errors as prompted.
3. Click `Download Json` button.
4. Name of file **MUST** be called `portfolio_data.json`. The default name should already be correct. If there are multiple of these config files, your OS might prepend numbers to deduplicate. You must remove the numbers and call the file exactly as `portfolio_data.json`.
5. Move `portfolio_data.json` into the **root** directory of this project. 
6. Host it! For the most foolproof experience, we suggest [Vercel](https://medium.com/@hikmohadetunji/hosting-your-first-website-on-vercel-a-step-by-step-guide-95061f1ca687).
7. (Optional) In an environment variable, provide a page title to populate the browser tab's title. The variable must be called `NEXT_PUBLIC_WEBPAGE_TITLE`
```
Example:
NEXT_PUBLIC_WEBPAGE_TITLE=Zachary Lee's Portfolio
```


# Json config (For contributers)
> It is **highly** adviced to use the [configure page]("https://zacharyLYH.bio/configure") page to configure your json config. Manual editing is error prone and there are no extra benefits of manual editing.

> We'll mark required fields as (R). These fields must be included in order to pass the sanitization check.

Job/Project
- title (R)
- startDate (R)
- endDate (R) if isCurrent=false
- isCurrent (R) if endDate=null
- description (R)
- links
- skills

Education
- institutionName (R)
- courseName (R)
- startDate (R)
- endDate (R) if isCurrent=false
- isCurrent (R) if endDate=null
- description 
- links

Achievement 
- name (R)
- description 
- dateAwarded (R)
- links
- skills


PortfolioData 
- name (R)
- bornYear 
- pronouns 
- image (R)
- shortBio (R)
- longBio 
- title (R)
- location (R)
- resumeLink 




