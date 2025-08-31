
function HomePage({ setPage }) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setPage("game")}>Game</button>
      <button onClick={() => setPage("editor")}>Editor</button>
      <button onClick={() => setPage("character")}>Character Selector</button>
    </div>
  )
}

export default HomePage
