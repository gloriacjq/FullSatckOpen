import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const Anecodote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  
  const filteredAnecdotes = [...anecdotes].filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  const sortedFilteredAnecdotes = filteredAnecdotes.sort((a, b) => b.votes - a.votes);

  return (
    <div>
      {sortedFilteredAnecdotes.map(anecdote =>
        <Anecodote 
          key = {anecdote.id}
          anecdote={anecdote} 
          handleClick={() => {
            dispatch(voteAnecdote(anecdote.id))
            dispatch(showNotification(`you voted for '${anecdote.content}'`))
          }}
        />
      )}
    </div>
  )
}

export default AnecdoteList