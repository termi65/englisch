import { useEffect, useState } from 'react';

function JsonLoader({dateiname}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch({dateiname}) // oder externe URL
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div>Lade Daten…</div>;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}

export default JsonLoader;
