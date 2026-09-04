export default function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <p className="field-error" role="alert">
      {error.message || error}
    </p>
  );
}
