import React, { Component } from 'react'
import { Card, List } from 'antd';
import LinkButton from '../../components/link-button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api/index'

const Item = List.Item

export default class Detail extends Component {
  state = {
    pName: '',    //父分类name
    cName: ''     //子分类name
  }

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state
    if (pCategoryId === '0') {
      //父分类id为0，表示为一级分类下商品
      const result = await reqCategory(categoryId)
      const pName = result.data.name
      this.setState({ pName })
    } else {
      //否则为二级分类下商品
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const pName = results[0].data.name
      const cName = results[1].data.name
      this.setState({
        pName,
        cName
      })
    }
  }

  render() {
    const { name, price, imgs, desc, detail } = this.props.location.state
    const { pName, cName } = this.state
    const title = (
      <span>
        <LinkButton
          style={{ marginRight: 20, fontSize: 20 }}
          onClick={() => this.props.history.goBack()} >
          <ArrowLeftOutlined />
        </LinkButton>
        <span style={{ fontSize: 20 }}>商品详情</span>
      </span>
    )
    return (
      <div>
        <Card title={title} className='product-detail'>
          <List className='product-detail-list'>
            <Item>
              <span className='left'>商品名称：</span>
              <span>{name}</span>
            </Item>
            <Item>
              <span className='left'>商品描述：</span>
              <span>{desc}</span>
            </Item>
            <Item>
              <span className='left'>商品价格：</span>
              <span>{price}元</span>
            </Item>
            <Item>
              <span className='left'>所属分类：</span>
              <span>{pName} {cName ? '-->' + cName : ''}</span>
            </Item>
            <Item>
              <span className='left'>商品图片：</span>
              <span>
                {imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))}
              </span>
            </Item>
            <Item>
              <span className='left'>商品详情：</span>
              <span dangerouslySetInnerHTML={{ __html: detail }}></span>
            </Item>
          </List>
        </Card>
      </div>
    )
  }
}
