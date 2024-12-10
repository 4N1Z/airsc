import { searchSemanticScholar } from "@/app/action/semantic-scholar/search";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

export async function POST(req:Request) {

        const {messages} = await req.json();

        const result = streamText({
            model:openai('gpt-4o-mini'),
            system:`You are Neura AI, a researchers assistant.
             When ever you get a query, 
             always answer that query by provinding 
              A short answer to the query
              The corresponding research paper to the user based on the context/query.`,
            messages,
            maxSteps:4,
            tools:{
                getResearchPaper:{
                    description:'Search for the corresponding research paper to the user based on the context',
                    parameters:z.object({
                        keyword:z.string().describe('The keyword of the research paper to search'),
                    }),
                    execute:async({keyword}:{keyword:string})=>{
                        const papers = await searchSemanticScholar(keyword,5,'relevance');
                        console.log("AI Agent research paper search :: ",papers)
                        return papers;
                    }
                }
            }
            
        })

        return result.toDataStreamResponse();

        

}