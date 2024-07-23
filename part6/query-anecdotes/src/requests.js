import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)


export const createAnecdote = (content) => {
  const newAnecdote = { content, votes: 0, id: getId() }
  return axios.post(baseUrl, newAnecdote).then(res => res.data)
}
  

export const updateAnecdote = (updateAnecdote) => 
  axios.put(`${baseUrl}/${updateAnecdote.id}`, updateAnecdote).then(res => res.data)