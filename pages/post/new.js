import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  console.log("PROPS: ", props);
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    });
    const data = await response.json();
    console.log("DATA: ", data);
    setPostContent(data.post.postContent);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={80}
          />
          <small className="block mb-2">Separate keywords with a comma</small>{" "}
        </div>
        <button type="submit" className="btn">
          Generate
        </button>{" "}
      </form>

      <Markdown>{postContent}</Markdown>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

//getServerSideProps: fetch data server-side and pass it as props to the page. It runs on every request to the page in '/post/new' and it's called before the page component is rendered.
export const getServerSideProps = withPageAuthRequired(() => {
  //withPageAuthRequired is a higher-order function that requires authentication to access the page. If the user is not authenticated, they are redirected to the login page.
  return {
    props: {},
  };
});
