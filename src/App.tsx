import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/tayclean" element={<Layout/>}>
        <Route index/>

      </Route>
    )
  )
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
