import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import { useState } from "react";

export const NotFound = () => {

return (<>
  <h1 className="text-center text-light">404 not found!</h1>
<div className="d-flex m-0 justify-content-center">
<img src="https://www.pngall.com/wp-content/uploads/13/Space-Invaders-PNG-Photos.png" alt="404 Not Found" />
</div>
</>
)}
