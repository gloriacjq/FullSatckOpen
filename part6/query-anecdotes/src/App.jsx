import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['anecdotes']})
  })

  const handleVote = (anecdote) => {
    const updateAnecdote = {...anecdote, votes: anecdote.votes + 1}
    voteMutation.mutate(updateAnecdote)
    const message = `anecdote '${anecdote.content}' voted`
    dispatch({type: 'SHOW_NOTI', message: message})
    setTimeout(() => {
      dispatch({type: 'CLEAR_NOTI'})
    }, 5000)
  }

  const queryAnecdotes = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if ( queryAnecdotes.isLoading ) {
    return <div>loading data...</div>
  }

  // console.log(JSON.parse(JSON.stringify(queryAnecdotes)))

  const anecdotes = queryAnecdotes.data

  return anecdotes 
  ? (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
  : (
    <div>
      anecdote service not available due to problems in server
    </div>
  )
}

export default App
