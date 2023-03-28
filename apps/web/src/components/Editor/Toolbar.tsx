import { ToolbarStyle } from "./ToolbarStyle"

const headings = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
]

interface ToolbarProps {
  id: string
}

export const Toolbar = ({ id }: ToolbarProps) => {
  return (
    <ToolbarStyle>
      <div id={id}>
        <div className="ql-formats">
          <select className="ql-header" defaultValue="">
            {headings.map((heading, index) => (
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
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-clean" />
        </div>
      </div>
    </ToolbarStyle>
  )
}
