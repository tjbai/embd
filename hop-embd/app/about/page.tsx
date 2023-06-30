import QuestionAnswer from "@/lib/components/About/QuestionAnswer";
import PageWrapper from "@/lib/components/Common/PageWrapper";
import ResultsWrapper from "@/lib/components/Common/ResultsWrapper";

export default function Page() {
  return (
    <PageWrapper>
      <ResultsWrapper>
        <QuestionAnswer
          question="What is Embedded SIS?"
          answer="blah blah blah"
        />
        <QuestionAnswer
          question="What is an embedding?"
          answer="blah blah blah"
        />
        <QuestionAnswer question="Why is it so slow?" answer="blah blah blah" />
        <QuestionAnswer
          question="Why do I see duplicate courses?"
          answer="blah blah blah"
        />
      </ResultsWrapper>
    </PageWrapper>
  );
}
