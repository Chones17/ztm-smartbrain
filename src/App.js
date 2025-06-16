import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import SignIn from "./components/SignIn/SignIn.js";
import Register from "./components/Register/Register.js";
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
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});

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
        setFaceBox(calcFace);
        if (result) {
          try {
            fetch("http://localhost:8080/image", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                loadUser({
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  entries: data.entries,
                  joined: data.joined,
                });
              });
          } catch (error) {
            console.log(error);
          }
        }
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

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setImageURL(null);
      setFaceBox({});
      setUser({});
    } else if (route === "home") {
      setIsSignedIn(true);
    }

    setRoute(route);
  };

  const loadUser = (user) => {
    setUser(user);
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" num={125} bg={true} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            handleChange={handleChange}
            handleClick={handleClick}
          />
          <FaceRecognition imageURL={imageURL} faceBox={faceBox} />
        </>
      ) : route === "signin" ? (
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
};

export default App;
