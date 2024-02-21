import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
  console.log("PROPS: ", props);

  return (
    <div>
      <h1>This is the New post page</h1>
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
