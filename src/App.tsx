import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ItemDetails from "./components/ItemDetails";

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />}>
      <Route path="details" element={<ItemDetails />} />
    </Route>
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
