import { basename } from "path";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Tv from "./screens/Tv";

const router = createBrowserRouter(
  [
    {
      path: `/`,
      element: <Root />,

      children: [
        {
          path: "",
          element: <Home />,
          index: true,
        },
        {
          path: "movies/:movieId",
          element: <Home />,
        },
        {
          path: "tv",
          element: <Tv />,
        },
        {
          path: "tvs/:tvId",
          element: <Tv />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "/search/:menuName/:searchId",
          element: <Search />,
        },
      ],
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
  }
);

export default router;
