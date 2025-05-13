import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import Rank from "./components/Rank/Rank.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import ParticlesBg from 'particles-bg'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      <FaceRecognition />
      <ParticlesBg type="cobweb" num={125} bg={true} />
    </div>
  );
}

export default App;
