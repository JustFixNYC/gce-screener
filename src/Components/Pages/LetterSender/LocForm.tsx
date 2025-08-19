import { useQuery, gql } from "@apollo/client";

const EXAMPLE_QUERY = gql`
  query ExampleQuery($input: String!) {
    exampleQuery {
      hello(argument: $input)
    }
  }
`;

export const GraphqlExample: React.FC = () => {
  const { loading, error, data } = useQuery(EXAMPLE_QUERY, {
    variables: { input: "world" },
  });

  return (
    <>
      <pre>{loading}</pre>
      <pre>{error?.message}</pre>
      <pre>{JSON.stringify(data)}</pre>
    </>
  );
};
