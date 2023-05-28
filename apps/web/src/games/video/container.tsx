import { default as CommentListItem } from "./components/CommentListItem"
import { default as Recording } from "./components/Recording"
import { default as RecordingForm } from "./components/RecordingForm"
import { default as ReviewDetails } from "./components/ReviewDetails"
import { default as CommentForm } from "./components/CommentForm"
import { Iconify } from "@/components/Iconify"

export default {
  "component:comment-list-item": CommentListItem,
  "component:recording": Recording,
  "component:recording-form": RecordingForm,
  "component:review-details": ReviewDetails,
  "component:comment-form": CommentForm,
  "component:recording-icon": <Iconify icon="eva:video-outline" />,
  "text:recording-step": "Choose a Recording",
  "text:request-review-button": "Submit your VOD",
  "text:coach-review-demo-key": "coach-video-review-demo.mp4",
  "text:player-review-demo-key": "player-video-review-demo.mp4",
  "text:recordings-title": "Recordings",
  "text:recordings-empty-text":
    "Once you have uploaded a recording for one of your games, it will appear here.",
  "text:recordings-date-column": "Date Uploaded",
  "text:recording-title": "Recording",
  "text:empty-comments-text":
    "Use the controls above the video to add comments and drawings to this review.",
  "text:recording-page-title": "Request a Review | Upload a VOD",
  "text:recording-created-success": "VOD uploaded successfully",
  "text:recording-submit-button": "Upload",
}
