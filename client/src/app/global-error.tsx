'use client'

type PropType = {
  error: Error & { digest?: string }
  reset: () => void
};

const GlobalError = ({error, reset,}: PropType) => {
  console.log(error);

  return (
    <html>
    <body>
    <h2>Something went wrong!</h2>
    <button onClick={() => reset()}>Try again</button>
    </body>
    </html>
  );
};
