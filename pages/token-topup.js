import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
  return (
    <div>
      <h1>This is the Token Popup page</h1>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  //withPageAuthRequired is a higher-order function that requires authentication to access the page. If the user is not authenticated, they are redirected to the login page.
  return {
    props: {},
  };
});
