import React, { useState, useEffect } from 'react'
import Posts from "./Posts/Posts";


function Home() {
  return (
    <div style={{    "display": "flex",
      "flex-direction": "column",
      "alignItems": "center"}}>
      <Posts />
    </div>
  )
}

export default Home
