import ReactLoading from "react-loading";




export default function LoadingSpinner() {
  // Responsive size: smaller on mobile, larger on desktop
  const size = window.innerWidth < 600 ? 80 : 150;

  return (
    <div
      className="spinner-center"
      style={{
        minHeight: "60vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <ReactLoading
        type="spinningBubbles"
        color="#7393B3"
        height={size}
        width={size}
        id="LoadingSymbol"
      />
    </div>
  );
}