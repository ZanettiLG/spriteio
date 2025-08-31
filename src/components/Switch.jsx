function Switch({ cases, value }) {
  return (
    <div>
      {cases[value]}
    </div>
  )
}

export default Switch