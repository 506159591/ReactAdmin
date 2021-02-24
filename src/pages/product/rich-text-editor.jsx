import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class EditorConvertToHTML extends Component {
  static propTypes = {
    detail: PropTypes.string
  }
  state = {
    editorState: EditorState.createEmpty(),
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }
  }
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const name = response.data.name // 得到图片的url
          const url = BASE_IMG_URL + name
          resolve({ data: { link: url } })
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, previewImage: true }
          }
        }}
      />
    );
  }
}