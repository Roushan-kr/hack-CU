export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Find My Bus</h1>
      <br />

      <a href="/driver">
        <button>Driver Portal</button>
      </a>

      <a href="/passenger">
        <button style={{ marginLeft: "10px" }}>Passenger Portal</button>
      </a>
    </div>
  );
}
