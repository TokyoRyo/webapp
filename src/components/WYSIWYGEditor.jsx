import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';
import './WYSIWYGEditor.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';


class WYSIWYGEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        editorState: this.props.content,
        }
    }
    
    onChange(editorState) {
        this.props.handleContent(editorState)
    }
    
    render() {
        this.state = {editorState: this.props.content,}
        return (
            <div className="wysiwyg">
                <div className="wysiwyg_tools btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                <button className="btn btn-outline-primary" onMouseDown={(e) => {
                    this.onChange(
                    RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
                    )
                    e.preventDefault()
                }}><FontAwesomeIcon icon={faBold} /> 太字</button>
                <button className="btn btn-outline-primary" onMouseDown={(e) => {
                    this.onChange(
                    RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
                    )
                    e.preventDefault()
                }}><FontAwesomeIcon icon={faItalic} /> 斜体</button>
                </div>
                <div className="wysiwyg_content form-control">
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange.bind(this)}
                />
                </div>
            </div>
        );
    }
  }
  
export default WYSIWYGEditor;
