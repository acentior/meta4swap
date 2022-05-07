import PropTypes from "prop-types";

function Headlines({ text, content }) {
  return (
    <>
      <div className="divider"></div>
      <div
        className="container items-center mx-auto justify-center"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 className="homeHeader text-5xl "> {text}</h1>
      </div>
      <div
        className="container items-center mx-auto justify-center"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 className="homeHeader2 text-3xl "> {content}</h2>
      </div>
    </>
  );
}

Headlines.propTypes = {
  text: PropTypes.string,
  content: PropTypes.string,
};
export default Headlines;