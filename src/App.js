import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import Rank from "./components/Rank/Rank.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import ParticlesBg from "particles-bg";

const App = () => {
  const PAT = "cbfb663c53c4434299ff94dbfbcd83dc";
  const USER_ID = "clarifai";
  const APP_ID = "main";
  const MODEL_ID = "face-detection";
  const [imageURL, setImageURL] = useState(null);
  const [faceBox, setFaceBox] = useState({});

  const calculateFaceBox = (topRow, leftCol, bottomRow, rightCol) => {
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      topRow: topRow * height,
      leftCol: leftCol * width,
      bottomRow: height - bottomRow * height,
      rightCol: width - rightCol * width,
    };
  };

  const formatRequest = () => {
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageURL,
            },
          },
        },
      ],
    });

    return {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
  };

  const fetchData = (request) => {
    fetch("/v2/models/" + MODEL_ID + "/outputs", request)
      .then((response) => response.json())
      .then((result) => {
        const data = [];
        const regions = result.outputs[0].data.regions;

        regions.forEach((region) => {
          const boundingBox = region.region_info.bounding_box;
          data.push(boundingBox);
        });

        const calcFace = calculateFaceBox(
          data[0].top_row,
          data[0].left_col,
          data[0].bottom_row,
          data[0].right_col
        );
        setFaceBox(calcFace)
      })
      .catch((error) => console.log("error", error));
  };

  const handleChange = (event) => {
    setImageURL(event.target.value);
  };

  const handleClick = () => {
    const request = formatRequest();
    fetchData(request);
  };

  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm handleChange={handleChange} handleClick={handleClick} />
      <FaceRecognition imageURL={imageURL} faceBox={faceBox} />
      <ParticlesBg type="cobweb" num={125} bg={true} />
    </div>
  );
};

export default App;
