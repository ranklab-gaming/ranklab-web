import { default as CommentListItem } from "./components/CommentListItem"
import { default as Recording } from "./components/Recording"
import { default as RecordingForm } from "./components/RecordingForm"
import { default as ReviewDetails } from "./components/ReviewDetails"
import { default as ReviewForm } from "./components/ReviewForm"
import { Iconify } from "@/components/Iconify"

export default {
  "component:comment-list-item": CommentListItem,
  "component:recording": Recording,
  "component:recording-form": RecordingForm,
  "component:review-details": ReviewDetails,
  "component:review-form": ReviewForm,
  "component:recording-icon": <Iconify icon="mdi:checkerboard" />,
  "text:recording-step": "Paste a PGN",
  "text:request-review-button": "Submit your PGN",
  "text:coach-review-demo-key": "coach-chess-review-demo.mp4",
  "text:player-review-demo-key": "player-chess-review-demo.mp4",
  "text:recordings-title": "Matches",
  "text:recordings-empty-text":
    "Once you have submitted a PGN for one of your matches, it will appear here.",
  "text:recordings-date-column": "Date Submitted",
  "text:recording-title": "Match",
  "text:empty-comments-text":
    "Use the controls above the chessboard to add comments to this review. You can also draw arrows on the board.",
  "text:recording-page-title": "Request a Review | Paste a PGN",
  "text:recording-created-success": "PGN submitted successfully",
  "text:recording-submit-button": "Submit",
}
