import "./FaceRecognition.css";

const FaceRecognition = ({ imageURL, faceBox }) => {
  return (
    <div className={"center mt4"}>
      <div className={"absolute mt2"}>
        <img
          id={"inputImage"}
          src={imageURL}
          alt={imageURL}
          style={{ width: "500px", height: "auto" }}
        />
        <div
          className={"bounding-box"}
          style={{
            top: faceBox.topRow,
            right: faceBox.rightCol,
            bottom: faceBox.bottomRow,
            left: faceBox.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
