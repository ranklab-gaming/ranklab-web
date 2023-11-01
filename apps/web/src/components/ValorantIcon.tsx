import * as React from "react"
import { SVGProps, useId } from "react"

export const ValorantIcon = (props: SVGProps<SVGSVGElement>) => {
  const id = useId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="6 9.869 256 200.976"
      {...props}
    >
      <linearGradient
        id={`${id}-a`}
        x1={-52.027}
        x2={165.844}
        y1={-26.517}
        y2={253.312}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#f52537",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.293}
          style={{
            stopColor: "#f32535",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.465}
          style={{
            stopColor: "#ea2434",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.605}
          style={{
            stopColor: "#dc2131",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.729}
          style={{
            stopColor: "#c7202b",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.841}
          style={{
            stopColor: "#ae1d25",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.944}
          style={{
            stopColor: "#8f1a1d",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#7a1818",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M6 17.785v81.408c0 3.228 1.102 6.364 3.115 8.882l77.952 97.429a14.237 14.237 0 0 0 11.107 5.34h63.702c5.966 0 9.28-6.897 5.553-11.555L18.665 13.341C14.462 8.091 6 11.064 6 17.784z"
        style={{
          fill: `url(#${id}-a)`,
          fillOpacity: 1,
          fillRule: "nonzero",
          opacity: 1,
          stroke: "none",
        }}
      />
      <linearGradient
        id={`${id}-b`}
        x1={181.794}
        x2={254.86}
        y1={36.039}
        y2={129.884}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#f52537",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.293}
          style={{
            stopColor: "#f32535",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.465}
          style={{
            stopColor: "#ea2434",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.605}
          style={{
            stopColor: "#dc2131",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.729}
          style={{
            stopColor: "#c7202b",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.841}
          style={{
            stopColor: "#ae1d25",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.944}
          style={{
            stopColor: "#8f1a1d",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#7a1818",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M163.504 132.622h64.156c3.769 0 7.389-1.5 10.056-4.167l20.11-20.11A14.203 14.203 0 0 0 262 98.29V16.996c0-6.635-8.277-9.657-12.551-4.58l-91.385 108.516c-3.89 4.622-.604 11.69 5.44 11.69z"
        style={{
          fill: `url(#${id}-b)`,
          fillOpacity: 1,
          fillRule: "nonzero",
          opacity: 1,
          stroke: "none",
        }}
      />
    </svg>
  )
}
