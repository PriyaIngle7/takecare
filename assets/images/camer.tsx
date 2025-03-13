import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CameraSVG(props:any) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M46 38a4 4 0 01-4 4H6a4 4 0 01-4-4V16a4 4 0 014-4h8l4-6h12l4 6h8a4 4 0 014 4v22z"
        stroke="#EBFFEE"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24 34a8 8 0 100-16 8 8 0 000 16z"
        stroke="#EBFFEE"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default CameraSVG
