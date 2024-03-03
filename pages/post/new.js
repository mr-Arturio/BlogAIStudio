import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/generatePost`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ topic, keywords }),
      });
      const data = await response.json();

      console.log("DATA: ", data);

      //check if postId exist and was generated successfully
      if (data?.postId) {
        //redirect to the post page
        router.push(`/post/${data.postId}`);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {!!loading && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faRobot} className="text-8xl" />
          <h6>Crafting...</h6>
        </div>
      )}
      {!loading && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
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
              <small className="block mb-2">
                Separate keywords with a comma
              </small>{" "}
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!topic.trim() || !keywords.trim()}
            >
              Generate
            </button>{" "}
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

//getServerSideProps: fetch data server-side and pass it as props to the page. It runs on every request to the page in '/post/new' and it's called before the page component is rendered.
export const getServerSideProps = withPageAuthRequired({
  //withPageAuthRequired is a higher-order function that requires authentication to access the page. If the user is not authenticated, they are redirected to the login page.
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
