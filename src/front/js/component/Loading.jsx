import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import { useState } from "react";
import "../../styles/loading.css";

export const Loading = () => {

return (<div className="spinner d-flex m-0 justify-content-center">
  <span>L</span>
  <span>O</span>
  <span>A</span>
  <span>D</span>
  <span>I</span>
  <span>N</span>
  <span>G</span>
</div>
)}