import React, { FunctionComponent } from "react"
import { Review } from "@ranklab/api"
import ReactPlayer from "react-player"

interface Props {
  review: Review
}

const AnalyzeReviewForm: FunctionComponent<Props> = ({ review }) => {
  return (
    <div>
      <ReactPlayer width="100%" controls={true} url={review.videoUrl} />
    </div>
  )
}

export default AnalyzeReviewForm
