import * as React from "react"
import { SVGProps, useId } from "react"

export const Dota2Icon = (props: SVGProps<SVGSVGElement>) => {
  const id = useId()

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <linearGradient
        id={`a-${id}`}
        x1={103.554}
        x2={163.39}
        y1={-7.78}
        y2={273.731}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#f45560",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#cf1828",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M59.206 161.139 97.72 204.47c3.571 4.015 1.233 10.388-4.082 11.142l-31.98 4.568a6.715 6.715 0 0 1-4.992-1.28l-20.48-15.36a6.735 6.735 0 0 1-2.149-8.044l13.945-32.538c1.94-4.534 7.943-5.511 11.224-1.819zM190.203 47.071l19.186 9.593a6.734 6.734 0 0 1 3.631 7.135l-4.257 25.56c-.789 4.735-6.144 7.147-10.213 4.607L162.541 71.46c-4.264-2.668-4.21-8.9.108-11.487l21.08-12.645a6.741 6.741 0 0 1 6.474-.256zm-140.57-1.65c2.526 0 4.554.108 7.579 2.526 3.806 3.045 145.36 103.201 172.401 122.334a6.652 6.652 0 0 1 2.277 8.111c-4.062 9.438-12.645 29.527-16.323 38.13-1.051 2.479-3.476 4.055-6.171 4.055h-19.544a6.725 6.725 0 0 1-4.958-2.176L38.268 59.029c-3.166-3.436-1.96-8.987 2.358-10.779 3.577-1.489 7.289-2.83 9.007-2.83zm24.373-31.818a6.593 6.593 0 0 0-4.634-1.866H11.738c-3.557 1.778-6.736 3.84-6.736 10.947V84.252a6.69 6.69 0 0 0 .714 3.011l4.52 9.04c.95 1.9.95 4.13 0 6.023l-5.234 10.463v6.737l6.736 6.736v6.737l-4.763 4.763a6.732 6.732 0 0 0-1.973 4.763v21.369a6.72 6.72 0 0 0 1.973 4.763l2.79 2.789a6.732 6.732 0 0 1 1.973 4.763v20.83a6.73 6.73 0 0 1-2.452 5.181c-4.507 3.685-4.284 5.706-4.284 11.621v28.53c0 3.005 2.034 5.639 4.917 6.481 11.062 3.22 12.854 5.409 28.766 5.409h26.948c4.136 0 8.273-3.395 10.846-5.355 1.778-1.354 4.204-1.866 6.211-.883 3.187 1.57 7.303 6.238 12.679 6.238 4.325 0 11.21-6.736 14.902-6.736 2.344 0 8.279 4.796 8.279 4.796a6.75 6.75 0 0 1 1.752 1.26l3.988 5.443a6.728 6.728 0 0 0 4.763 1.974h8.037c1.563 0 3.085-.512 4.271-1.529 2.277-1.96 6.73-5.113 11.85-5.208h31.912a6.54 6.54 0 0 0 3.079-.747c1.853-.97 5.309-3.989 8.064-5.329a6.723 6.723 0 0 1 7.821 1.415c.378.397.748.801 1.092 1.172 1.273 1.394 3.065 3.489 4.944 3.489h14.404a6.721 6.721 0 0 0 4.763-1.973l1.879-2.776c1.779-1.779 4.372-2.432 6.777-1.664 2.19.694 9.115 4.931 14.808 6.245 4.217.97 8.246-2.237 8.246-6.568v-87.579a6.74 6.74 0 0 0-6.737-6.737h-6.737l4.763-4.762a6.73 6.73 0 0 0 1.974-4.763v-22.569a6.696 6.696 0 0 0-.714-3.011l-3.854-7.707a6.742 6.742 0 0 1 1.26-7.774l3.308-3.308v-6.737l4.763-4.763A6.733 6.733 0 0 0 261 83.052V59.723c0-.552-.068-1.098-.202-1.637l-5.612-22.44a6.738 6.738 0 0 1 1.772-6.393L261 25.21v-6.736l-5.161-5.16a6.723 6.723 0 0 0-3.786-1.9l-21.275-3.12-5.335 3.82-2.856-4.177A6.738 6.738 0 0 0 217.022 5h-36.864c-4.156 0-6.73 2.675-6.73 6.69 0 .976-.007 6.784-6.743 6.784-6.737 0-6.737-6.737-6.737-6.737s0-6.737-7.741-6.737h-42.442a6.684 6.684 0 0 0-5.611 3.011c-2.601 3.968-7.236 10.463-9.701 10.463h-8.61c-5.807 0-9.782-2.877-11.837-4.871z"
        style={{
          fill: `url(#a-${id})`,
          fillOpacity: 1,
          fillRule: "evenodd",
          opacity: 1,
          stroke: "none",
        }}
      />
    </svg>
  )
}
