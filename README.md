

https://fontawesome.com/ - icons <br>

fonts:
- body - DM Sans
- headings & Logo: DM Serif Display

OpenAI model: gpt-4-1106-preview

MongoDb:
- name - BlogAiStudio
- tables - posts, users
post content:
- _id
- postContent
- title
- metaDescription
- topic
- keywords
- userId
- created


[stripe handle webhook events documentation](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local) <br>
`openssl rand -hex 32` - command to generate a random string <br>
Don't forget to Fix Font Awesome flash of massive icon on load in production with:
```import '@fortawesome/fontawesome-svg-core/styles.css'; ``` <br>
```import { config } from '@fortawesome/fontawesome-svg-core';``` <br>
```config.autoAddCss = false;```
