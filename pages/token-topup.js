import { withPageAuthRequired } from "@auth0/nextjs-auth0";


export default function TokenTopup() {
  return (
    <div>
      <h1>This is the Token Popup page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  //withPageAuthRequired is a higher-order function that requires authentication to access the page. If the user is not authenticated, they are redirected to the login page.
  return {
    props: {},
  };
});
