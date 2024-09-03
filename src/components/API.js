import { useEffect, useState } from "react";

async function getData(endPoint) {
  let response = await fetch(endPoint); // json array
  try {
    return await response.json();
  } catch {
    return response;
  }
}

export default function useAPI(endPoint, ...props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setData(await getData(endPoint, ...props));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);

  return {
    loading,
    data,
    error,
  };
}
