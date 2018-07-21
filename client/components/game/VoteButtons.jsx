import React from 'react'
import {connect} from 'react-redux'

import {castVote} from '../../actions/votes'

class VoteButtons extends React.Component {
  vote(isYes) {
    const {
      votes,
      room,
      dispatch, // the other things come from props, dispatch comes by virtue of being connected. 
      socket
    } = this.props
    if (votes.hasVoted) return //return nothing to prevent dispatch

    dispatch(castVote())
    socket.emit('vote', room, isYes)  //the socket in redux is the socket we emit to in order to change the db

    //receiving socket is in server/socket.js 
  }
  reset() {
    const {room, socket} = this.props
    socket.emit('reset', room)
  }
  render() {
    const {hasVoted} = this.props.votes
    return <div className="column is-offset-3 is-6">
      <button disabled={hasVoted} onClick={() => this.vote(true)} className="button is-large is-success is-fullwidth">Yes</button>
      <button disabled={hasVoted} onClick={() => this.vote(false)} className="button is-large is-danger is-fullwidth">No</button>
      <button onClick={() => this.reset()}className="button is-small is-info">Reset!</button>
    </div>
  }
}

const mapStateToProps = ({
  socket,
  votes,
  room
}) => ({
  socket,
  votes,
  room
})

export default connect(mapStateToProps)(VoteButtons)
