import * as React from "react"
import { SVGProps, useId } from "react"

export const LolIcon = (props: SVGProps<SVGSVGElement>) => {
  const id = useId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="9 7 256 284.444"
      {...props}
    >
      <linearGradient
        id={`${id}-a`}
        x1={137}
        x2={137}
        y1={7}
        y2={291.444}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#FDB50E",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#FDB50E",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M259.311 240.244H239.4a127.828 127.828 0 0 0 25.6-76.8c0-70.599-57.401-128-128-128-2.844 0-5.689.114-8.533.285v-23.04c0-3.129-2.56-5.689-5.689-5.689H48.822a5.645 5.645 0 0 0-4.95 2.901c-1.023 1.764-.966 3.983.058 5.69L60.2 42.725v18.375C28.115 85.222 9 123.224 9 163.444c0 39.254 18.204 76.459 48.981 100.637l-13.71 18.261c-1.308 1.707-1.479 4.039-.512 5.974a5.62 5.62 0 0 0 5.063 3.128h176.356c1.65 0 3.242-.739 4.323-1.991l34.134-39.822a5.785 5.785 0 0 0 .853-6.087c-.91-1.991-2.958-3.3-5.177-3.3zM128.467 47.164c2.844-.171 5.689-.342 8.533-.342 64.284 0 116.622 52.338 116.622 116.622 0 28.388-10.297 55.524-28.956 76.8h-24.349c22.699-18.716 36.239-46.762 36.239-76.8 0-54.897-44.658-99.555-99.556-99.555-2.844 0-5.689.17-8.533.398V47.164zm0 28.558c2.844-.285 5.689-.455 8.533-.455 48.64 0 88.178 39.537 88.178 88.177 0 31.858-17.181 61.156-44.886 76.8h-51.825V75.722zm-108.09 87.722c0-33.678 14.735-65.65 39.823-87.665v24.462c-14.62 17.806-22.756 40.05-22.756 63.203 0 23.154 8.136 45.398 22.756 63.204v24.519c-25.088-22.073-39.822-54.044-39.822-87.723zM60.2 120.266v86.357a87.729 87.729 0 0 1-11.378-43.179A87.728 87.728 0 0 1 60.2 120.266zm162.361 159.801H60.2l10.24-13.654A5.597 5.597 0 0 0 71.578 263V41.133a5.7 5.7 0 0 0-.797-2.901l-11.89-19.854h58.198v227.555c0 3.129 2.56 5.689 5.689 5.689h124.188l-24.405 28.445z"
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
        x1={54.511}
        x2={54.511}
        y1={120.266}
        y2={206.623}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#FDB50E",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#FDB50E",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M60.2 120.266v86.357a87.729 87.729 0 0 1-11.378-43.179A87.728 87.728 0 0 1 60.2 120.266z"
        style={{
          fill: `url(#${id}-b)`,
          fillOpacity: 1,
          fillRule: "nonzero",
          opacity: 1,
          stroke: "none",
        }}
      />
      <linearGradient
        id={`${id}-c`}
        x1={176.822}
        x2={176.822}
        y1={75.267}
        y2={240.244}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          style={{
            stopColor: "#0E7CE4",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#0E7CE4",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <path
        d="M225.178 163.444c0 31.858-17.181 61.156-44.886 76.8h-51.825V75.722c2.844-.285 5.689-.455 8.533-.455 48.64 0 88.178 39.537 88.178 88.177z"
        style={{
          fill: `url(#${id}-c)`,
          fillOpacity: 1,
          fillRule: "nonzero",
          opacity: 1,
          stroke: "none",
        }}
      />
    </svg>
  )
}
