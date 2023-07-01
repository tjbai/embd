import PageWrapper from "../Common/PageWrapper";
import ResultsWrapper from "../Common/ResultsWrapper";
import Loader from "./Loader";
import SearchBar from "./SearchBar";

export default function LoadingScreen() {
  return (
    <PageWrapper>
      <SearchBar />
      <ResultsWrapper>
        <Loader />
        <Loader />
        <Loader />
        <Loader />
      </ResultsWrapper>
    </PageWrapper>
  );
}
