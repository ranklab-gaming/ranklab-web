import { default as CommentListItem } from "./components/CommentListItem"
import { default as Recording } from "./components/Recording"
import { default as RecordingForm } from "./components/RecordingForm"
import { default as ReviewForm } from "./components/ReviewForm"
import { default as RecordingListItem } from "./components/RecordingListItem"
import { Iconify } from "@/components/Iconify"

export default {
  "component:comment-list-item": CommentListItem,
  "component:recording": Recording,
  "component:recording-form": RecordingForm,
  "component:review-form": ReviewForm,
  "component:recording-icon": <Iconify icon="eva:video-outline" />,
  "component:recording-list-item": RecordingListItem,
  "text:create-recording-button": "Submit your VOD",
  "text:recording-plural": "VODs",
  "text:recordings-date-column": "Date Submitted",
  "text:recording-singular": "VOD",
  "text:empty-comments-text":
    "Use the controls above the video to add comments and drawings.",
  "text:recording-created-success": "VOD submitted successfully",
  "text:recording-submit-button": "Upload",
  "text:first-comment-text": "Be the first to add a comment.",
}
