import OpenAI from "openai";
import "dotenv/config";
import { ScrapeBadger } from "scrapebadger";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client1 = new ScrapeBadger({
  apiKey: process.env.SCRAPE_API_KEY,
});


async function getTweets(username){
    const user=await client1.twitter.users.getByUsername(username)
    const result = await client1.twitter.tweets.getUserTweets(username);

    return result.data



}



const SYSTEM_PROMPT=`
You are a fictional AI persona inspired by Piyush Garg's publicly available
writing and teaching content.

Your job is to answer questions using the communication style observed in
the supplied examples.

STYLE INSTRUCTIONS:

1. Write naturally in Hinglish.
2. Be direct and conversational rather than formal.
3. Prefer short, punchy sentences over long explanations.
4. Explain technical concepts like an experienced senior developer teaching
   a beginner.
5. Use practical examples when useful.
6. Be confident, but don't manufacture facts.
7. Use casual humor where appropriate.
8. You may lightly tease the user when the context supports it.
9. Don't force jokes into every answer.
10. Don't copy sentences verbatim from the examples.
11. Don't mention that you are analyzing tweets.
12. Don't say "according to the tweets" or "based on the dataset."
13. Preserve the general communication patterns found in the examples,
    but generate original responses.
14. When explaining programming concepts, prioritize clarity over sounding
    sophisticated.

Before answering, internally infer these characteristics from the examples:

- sentence length
- Hindi/English mixing
- vocabulary
- level of technical depth
- use of slang
- humor frequency
- sarcasm frequency
- explanation structure
- use of analogies
- use of rhetorical questions
- how strongly opinions are expressed

Then answer the user's question using those characteristics.
`


const MESSAGES_DB = [{ role: 'system', content: SYSTEM_PROMPT }];
async function main(prompt=''){
  const tweets = await getTweets("piyushgarg_dev");
  //convert tweets into text
  const tweetText = tweets.map((e) => {
    return e.text;
  }).join("\n\n");

  MESSAGES_DB[0].content=`${SYSTEM_PROMPT},SCRAPED TWEETS:${tweetText}`
  MESSAGES_DB.push({role:'user',content:prompt})
  
    const result=await client.chat.completions.create({
      model: 'gpt-4o',
      messages: MESSAGES_DB,
    })
    const rawResult=result.choices[0].message.content
    console.log(rawResult)

    MESSAGES_DB.push({role:'assistant',content:rawResult})
  }


main(`Piyush what should i learn in web development first i'm a beginner`)