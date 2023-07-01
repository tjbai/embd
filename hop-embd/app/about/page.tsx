import QuestionAnswer from "@/lib/components/About/QuestionAnswer";
import PageWrapper from "@/lib/components/Common/PageWrapper";
import ResultsWrapper from "@/lib/components/Common/ResultsWrapper";

export default function Page() {
  return (
    <PageWrapper>
      <ResultsWrapper>
        <QuestionAnswer
          question="What is Embedded SIS?"
          answer={
            <>
              <br />
              <text>{"First, you need to undertand embeddings."}</text>
              <br />
              <br />
              <text>
                {"\n Think of them as a way to capture the essence" +
                  " and unique characteristics of course descriptions. Similar to how " +
                  "fingerprints identify individuals, embeddings are like digital fingerprints for courses." +
                  " They distill the key features and nuances of each course, allowing us to understand their content at a deeper level." +
                  " Embeddings are basically how language models like ChatGPT 'think' about text."}
              </text>
              <br />
              <br />
              <text>
                {"Mathematically, embeddings are nothing more than very high-dimensional" +
                  " vectors that use a large number of 'features' to quantitatively describe complex information." +
                  " As a result, we can perform simple math to obtain a notion of how 'related' 2 objects are" +
                  " from the relation between their embeddings."}
              </text>
              <br />
              <br />
              <text>
                {"When you type something in the search bar, we use SoTA deep learning models and techniques" +
                  " to compare the search text against all the classes" +
                  " that Hopkins has provided in the last 7 years, then return the ones " +
                  "that are a close match!"}
              </text>
              <br />
            </>
          }
        />

        <QuestionAnswer
          question="Why is it so slow?"
          answer={
            <>
              <br />
              <text>
                {"Embedded SIS is developed by a student at Hopkins running on a student budget. " +
                  "Running inference tasks at scale is computationally expensive, and we unfortunately " +
                  "can't afford stronger cloud infrastructure."}
              </text>
              <br />
              <br />
              <text>
                {"You can increase the speed of your searches by AVOIDING the use of filters." +
                  " Everytime you use some combination of filters, our backend APIs needs to generate" +
                  " a brand new index that can't be persisted to disk for lack of space. This can be really" +
                  " slow because there are so many courses to index!"}
              </text>
            </>
          }
        />
        <QuestionAnswer
          question="Why do I see duplicate courses?"
          answer={
            <>
              <br />
              <text>
                {"The data scraped from SIS is not perfect. Courses sometimes change " +
                  "their description by just a small amount every couple of years, and this can create" +
                  " duplicate entries in our database."}
              </text>
              <br />
              <br />
              <text>
                {"Data cleaning methods that avoid this issue only end up introducing " +
                  " news problems, so for now think of it as a feature, not a bug."}
              </text>
            </>
          }
        />
      </ResultsWrapper>
    </PageWrapper>
  );
}
