import React, { Component, cloneElement } from 'react'
import ReactDOM from 'react-dom'
import { DIRECTIONS } from './utils'

class SwipeCards extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alertLeft: false,
      alertRight: false,
      alertTop: false,
      alertBottom: false,
      containerSize: { x: 0, y: 0 }
    }
    this.removeCard = this.removeCard.bind(this)
    this.setSize = this.setSize.bind(this)
  }

  removeCard (side) {
    const { children, onEnd } = this.props
    this.setState({
      [`alert${side}`]: true
    })

    setTimeout(() => this.setState({ [`alert${side}`]: false }), 300)
  }

  componentDidMount () {
    this.setSize()
    window.addEventListener('resize', this.setSize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setSize)
  }

  setSize () {
    const container = ReactDOM.findDOMNode(this)
    const containerSize = {
      x: container.offsetWidth,
      y: container.offsetHeight
    }
    this.setState({ containerSize })
  }

  render () {
    const { containerSize } = this.state
    const { children, className, onSwipeTop, onSwipeBottom } = this.props
    if (!containerSize.x || !containerSize.y) return  <div className={className} />

    const _cards = children.reduce((memo, c, i) => {
      const props = {
        key: i,
        containerSize,
        index: i,
        ...DIRECTIONS.reduce((m, d) => ({ ...m, [`onOutScreen${d}`]: () => this.removeCard(d) }), {}),
        active: i === 0
      }
      return [ ...memo, cloneElement(c, props) ]
    }, [])
    
    return (
      <div className={className}>
        {DIRECTIONS.map(d => 
          <div key={d} className={`${this.state[`alert${d}`] ? 'alert-visible': ''} alert-${d.toLowerCase()} alert`}>
            {this.props[`alert${d}`]}
          </div>
        )}
        <div id='cards'>
          {_cards}
        </div>
      </div>
    )
  }
}

export default SwipeCards