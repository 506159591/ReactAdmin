import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeletImage } from "../../api";
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from "../../utils/constants";

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array   //图片数据数组
  }
  state = {
    previewVisible: false,  //大图预览显示标识
    previewImage: '',       //大图的url
    previewTitle: '',       //大图的标题
    fileList: [             //图片数据的数组

    ],
  }
  constructor(props) {
    super(props)
    let fileList = []
    const { imgs } = this.props
    //接收的imgs有数据
    if (imgs && imgs.length > 0) {
      //遍历生成图片数据对象的数组
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList
    }
  }
  /* 提供给父组件获取图片数据数组的函数 */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  //隐藏大图
  handleCancel = () => this.setState({ previewVisible: false })
  //显示大图
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  /* 图片文件上传 */
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      //图片上传
      const result = file.response
      if (result.status === 0) {
        message.success('上传图片成功')
        file = fileList[fileList.length - 1]
        file.name = result.data.name
        file.url = result.data.url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      //图片删除
      const result = await reqDeletImage(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    //图片上传按钮
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <>
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}