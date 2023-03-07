import { EditorToolbarStyle } from "./EditorToolbarStyle"

const HEADINGS = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
]

interface EditorToolbarProps {
  id: string
}

export function EditorToolbar({ id }: EditorToolbarProps) {
  return (
    <EditorToolbarStyle>
      <div id={id}>
        <div className="ql-formats">
          <select className="ql-header" defaultValue="">
            {HEADINGS.map((heading, index) => (
              <option key={heading} value={index + 1}>
                {heading}
              </option>
            ))}
            <option value="">Normal</option>
          </select>
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-underline" />
          <button type="button" className="ql-strike" />
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-list" value="bullet" />
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-direction" value="rtl" />
          <select className="ql-align" />
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-link" />
          <button type="button" className="ql-image" />
          <button type="button" className="ql-video" />
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-clean" />
        </div>
      </div>
    </EditorToolbarStyle>
  )
}
