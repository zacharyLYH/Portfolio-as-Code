# Portfolio-as-Code

Portfolio generator configured using json. Geared for portfolios that have a lot of text and want interactive filtering abilities such as partial word search. 

# Features
- UI for config generation 
- Full responsiveness from mobile to desktop. 90% Performance on mobile, 100% Performance on desktop according to Google Lighthouse
- 100% SEO score on Google Lighthouse
- Maximum SSR for a good UX
- Advanced filter support for users to query your portfolio
- Modern, text dominant friendly, sleek looking UI

![Filter page](https://github.com/user-attachments/assets/519d0c14-3d17-41b5-beaf-175715f25a86)
![Header](https://github.com/user-attachments/assets/340d42c2-e62b-4d7a-a909-1b0b59b30e99)
![Experience](https://github.com/user-attachments/assets/9d5ba234-54a4-45f2-a58e-1d1bc327bd37)
![Project](https://github.com/user-attachments/assets/8e9233eb-53dd-483f-a766-8e8fe0681f0a)
![Project detail](https://github.com/user-attachments/assets/639ecae7-fd5f-4135-a1ce-7635061c01f0)
![Education](https://github.com/user-attachments/assets/fe17ea6d-2e68-4a80-aa05-a1272e05d11f)
![Footer and Achievement](https://github.com/user-attachments/assets/6cb99105-e0bb-487b-bce2-8d6ae4f473e7)


# To use
1. Navigate to [configure page](https://zacharyLYH.bio/configure).
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

Under the hood, every data record has an `id` field generated using the `new Date.now()` javascript function. This is used in filtering functionality.




